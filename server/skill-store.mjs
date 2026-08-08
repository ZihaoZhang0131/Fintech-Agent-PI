import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const STORE_VERSION = 1;
const MAX_SKILL_SOURCE_LENGTH = 20_000;
const MAX_FILES = 100;
const MAX_TOTAL_BYTES = 1_500_000;
const SKILL_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const BUNDLED_SKILL_NAMES = new Set(["equity-research", "earnings-review", "policy-tracking"]);

function error(message, status = 400) {
  return Object.assign(new Error(message), { status });
}

function storePath(dataDirectory) {
  return path.join(dataDirectory, "skills.json");
}

function skillsDirectory(dataDirectory) {
  return path.join(dataDirectory, "skills");
}

function emptyStore() {
  return { version: STORE_VERSION, entries: [], deletedBundledNames: [] };
}

async function readStore(dataDirectory) {
  try {
    const parsed = JSON.parse(await readFile(storePath(dataDirectory), "utf8"));
    if (parsed?.version !== STORE_VERSION || !Array.isArray(parsed.entries) || !Array.isArray(parsed.deletedBundledNames)) {
      return emptyStore();
    }
    return {
      version: STORE_VERSION,
      entries: parsed.entries.filter((entry) => entry && typeof entry === "object"),
      deletedBundledNames: parsed.deletedBundledNames.filter((name) => typeof name === "string"),
    };
  } catch (caught) {
    if (caught?.code === "ENOENT" || caught instanceof SyntaxError) return emptyStore();
    throw caught;
  }
}

async function saveStore(dataDirectory, store) {
  await mkdir(dataDirectory, { recursive: true, mode: 0o700 });
  const target = storePath(dataDirectory);
  const temporary = `${target}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(store, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
  await rename(temporary, target);
}

function parseSkill(source) {
  const normalized = source.replace(/\r\n/g, "\n").trim();
  if (normalized.length > MAX_SKILL_SOURCE_LENGTH) throw error("SKILL.md 内容不能超过 20000 个字符。");
  const lines = normalized.split("\n");
  if (lines[0] !== "---") throw error("SKILL.md 必须以 YAML frontmatter 开头。");
  const endIndex = lines.indexOf("---", 1);
  if (endIndex < 0) throw error("SKILL.md 的 YAML frontmatter 未闭合。");
  const values = new Map();
  for (const line of lines.slice(1, endIndex)) {
    const field = line.match(/^([a-z_]+):\s*(.*)$/);
    if (field?.[2]) values.set(field[1], field[2].trim());
  }
  const name = values.get("name") ?? "";
  const description = values.get("description") ?? "";
  const instructions = lines.slice(endIndex + 1).join("\n").trim();
  validateFields({ name, description, instructions });
  return { name, description, instructions };
}

function validateFields({ name, description, instructions }) {
  if (typeof name !== "string" || !SKILL_NAME_PATTERN.test(name)) {
    throw error("技能名称只能使用小写字母、数字和连字符。");
  }
  if (typeof description !== "string" || !description.trim() || description.length > 300) {
    throw error("技能描述不能为空且不能超过 300 个字符。");
  }
  if (typeof instructions !== "string" || !instructions.trim() || instructions.length > MAX_SKILL_SOURCE_LENGTH) {
    throw error("Skill 内容不能为空且不能超过 20000 个字符。");
  }
}

function toSkillSource({ name, description, instructions }) {
  return `---\nname: ${name}\ndescription: ${description}\n---\n\n${instructions.trim()}\n`;
}

function normalizeRelativePath(value) {
  if (typeof value !== "string" || value.includes("\0")) throw error("上传文件路径无效。");
  const normalized = path.posix.normalize(value.replaceAll("\\", "/").replace(/^\/+/, ""));
  if (!normalized || normalized === "." || normalized.startsWith("../") || path.posix.isAbsolute(normalized)) {
    throw error("上传文件路径超出了技能文件夹。");
  }
  return normalized;
}

function allNames(store, editingId) {
  const names = new Set(BUNDLED_SKILL_NAMES);
  for (const removed of store.deletedBundledNames) names.delete(removed);
  for (const entry of store.entries) {
    if (entry.baseName) names.delete(entry.baseName);
    if (entry.id === editingId) continue;
    if (typeof entry.name === "string") names.add(entry.name);
  }
  return names;
}

function ensureUniqueName(store, name, editingId) {
  if (allNames(store, editingId).has(name)) throw error(`技能名称 “${name}” 已存在。`, 409);
}

async function writeFolder(dataDirectory, storageId, files, replacementSource) {
  const destination = path.join(skillsDirectory(dataDirectory), storageId);
  const temporary = `${destination}.${process.pid}.${randomUUID()}.tmp`;
  await mkdir(temporary, { recursive: true, mode: 0o700 });
  try {
    for (const file of files) {
      const target = path.join(temporary, file.path);
      if (!target.startsWith(`${temporary}${path.sep}`)) throw error("上传文件路径无效。");
      await mkdir(path.dirname(target), { recursive: true, mode: 0o700 });
      await writeFile(target, file.data, { mode: 0o600 });
    }
    if (replacementSource) await writeFile(path.join(temporary, "SKILL.md"), replacementSource, { encoding: "utf8", mode: 0o600 });
    await rm(destination, { recursive: true, force: true });
    await rename(temporary, destination);
  } catch (caught) {
    await rm(temporary, { recursive: true, force: true });
    throw caught;
  }
}

async function writeSkillSource(dataDirectory, storageId, source) {
  const destination = path.join(skillsDirectory(dataDirectory), storageId);
  await mkdir(destination, { recursive: true, mode: 0o700 });
  const target = path.join(destination, "SKILL.md");
  const temporary = `${target}.${process.pid}.tmp`;
  await writeFile(temporary, source, { encoding: "utf8", mode: 0o600 });
  await rename(temporary, target);
}

export function createSkillStore(dataDirectory) {
  async function list() {
    const store = await readStore(dataDirectory);
    return {
      entries: store.entries.map(({ id, origin, baseName, name, description, instructions }) => ({
        id, origin, baseName, name, description, instructions,
      })),
      deletedBundledNames: store.deletedBundledNames,
    };
  }

  async function importFolder(payload) {
    const received = Array.isArray(payload?.files) ? payload.files : [];
    if (!received.length || received.length > MAX_FILES) throw error("请选择不超过 100 个文件的技能文件夹。");
    let total = 0;
    const files = received.map((file) => {
      const filePath = normalizeRelativePath(file?.path);
      if (typeof file?.data !== "string") throw error("上传文件内容无效。");
      let data;
      try { data = Buffer.from(file.data, "base64"); } catch { throw error("上传文件内容无效。"); }
      total += data.length;
      return { path: filePath, data };
    });
    if (total > MAX_TOTAL_BYTES) throw error("技能文件夹不能超过 1.5 MB。", 413);
    const skillFile = files.find((file) => file.path === "SKILL.md");
    if (!skillFile) throw error("技能文件夹根目录必须包含 SKILL.md。");
    let metadata;
    try { metadata = parseSkill(new TextDecoder("utf-8", { fatal: true }).decode(skillFile.data)); }
    catch (caught) { throw caught instanceof Error ? caught : error("SKILL.md 必须是 UTF-8 文本。"); }
    const store = await readStore(dataDirectory);
    ensureUniqueName(store, metadata.name);
    const id = `custom:${randomUUID()}`;
    const storageId = randomUUID();
    await writeFolder(dataDirectory, storageId, files);
    store.entries.push({ id, origin: "custom", storageId, ...metadata });
    await saveStore(dataDirectory, store);
    return { id, origin: "custom", ...metadata };
  }

  async function update(id, payload) {
    if (typeof id !== "string" || !id) throw error("技能标识无效。");
    const next = {
      name: typeof payload?.name === "string" ? payload.name.trim() : "",
      description: typeof payload?.description === "string" ? payload.description.trim() : "",
      instructions: typeof payload?.instructions === "string" ? payload.instructions.trim() : "",
    };
    validateFields(next);
    const store = await readStore(dataDirectory);
    let entry = store.entries.find((item) => item.id === id);
    if (!entry && id.startsWith("bundled:")) {
      const baseName = id.slice("bundled:".length);
      if (!BUNDLED_SKILL_NAMES.has(baseName)) throw error("技能不存在。", 404);
      entry = { id, origin: "bundled", baseName, storageId: randomUUID() };
      store.entries.push(entry);
    }
    if (!entry) throw error("技能不存在。", 404);
    ensureUniqueName(store, next.name, id);
    await writeSkillSource(dataDirectory, entry.storageId, toSkillSource(next));
    Object.assign(entry, next);
    store.deletedBundledNames = store.deletedBundledNames.filter((name) => name !== entry.baseName);
    await saveStore(dataDirectory, store);
    return { id: entry.id, origin: entry.origin, baseName: entry.baseName, ...next };
  }

  async function remove(id) {
    const store = await readStore(dataDirectory);
    const index = store.entries.findIndex((entry) => entry.id === id);
    if (index >= 0) {
      const [entry] = store.entries.splice(index, 1);
      if (entry.origin === "bundled" && entry.baseName) {
        if (!store.deletedBundledNames.includes(entry.baseName)) store.deletedBundledNames.push(entry.baseName);
      }
      if (entry.storageId) await rm(path.join(skillsDirectory(dataDirectory), entry.storageId), { recursive: true, force: true });
      await saveStore(dataDirectory, store);
      return { removed: id };
    }
    if (id.startsWith("bundled:")) {
      const baseName = id.slice("bundled:".length);
      if (!BUNDLED_SKILL_NAMES.has(baseName)) throw error("技能不存在。", 404);
      if (!store.deletedBundledNames.includes(baseName)) store.deletedBundledNames.push(baseName);
      await saveStore(dataDirectory, store);
      return { removed: id };
    }
    throw error("技能不存在。", 404);
  }

  return { list, importFolder, update, remove };
}
