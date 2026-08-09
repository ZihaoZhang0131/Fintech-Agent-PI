import { randomUUID } from "node:crypto";
import { constants } from "node:fs";
import { access, mkdir, readFile, readdir, realpath, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Unzip, UnzipInflate, zipSync } from "fflate";

const STORE_VERSION = 2;
const MAX_SKILL_SOURCE_LENGTH = 20_000;
const MAX_FILES = 200;
const MAX_TOTAL_BYTES = 8 * 1024 * 1024;
const MAX_ZIP_BYTES = 5 * 1024 * 1024;
const MAX_TEXT_FILE_BYTES = 1 * 1024 * 1024;
const SKILL_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const BUNDLED_SKILL_NAMES = new Set([
  "equity-research",
  "earnings-review",
  "policy-tracking",
  "akshare-http-data",
  "a-share-value-investing",
  "akshare-china-macro",
  "akshare-us-macro",
  "akshare-euro-macro",
  "akshare-institutions-macro",
]);
const TEXT_EXTENSIONS = new Set([
  ".c", ".cc", ".conf", ".cpp", ".css", ".csv", ".env", ".go", ".graphql", ".h", ".html",
  ".ini", ".java", ".js", ".json", ".jsx", ".log", ".md", ".mdx", ".mjs", ".mts", ".py",
  ".rb", ".rs", ".scss", ".sh", ".sql", ".svg", ".toml", ".ts", ".tsx", ".txt", ".yaml", ".yml",
]);
const IMAGE_TYPES = new Map([
  [".avif", "image/avif"], [".gif", "image/gif"], [".jpeg", "image/jpeg"], [".jpg", "image/jpeg"],
  [".png", "image/png"], [".webp", "image/webp"],
]);
const BUNDLED_SKILLS_DIRECTORY = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.agents/skills");
const MACOS_PYTHON_TOOL_SHIMS = new Set([
  "/usr/bin/python3",
  "/System/Cryptexes/App/usr/bin/python3",
]);

function error(message, status = 400) {
  return Object.assign(new Error(message), { status });
}

function storePath(dataDirectory) { return path.join(dataDirectory, "skills.json"); }
function skillsDirectory(dataDirectory) { return path.join(dataDirectory, "skills"); }
function emptyStore() { return { version: STORE_VERSION, entries: [], deletedBundledNames: [] }; }

async function readStore(dataDirectory) {
  try {
    const parsed = JSON.parse(await readFile(storePath(dataDirectory), "utf8"));
    if (!Array.isArray(parsed?.entries) || !Array.isArray(parsed?.deletedBundledNames)) return emptyStore();
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
  await writeFile(temporary, `${JSON.stringify({ ...store, version: STORE_VERSION }, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
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
  if (typeof name !== "string" || !SKILL_NAME_PATTERN.test(name)) throw error("技能名称只能使用小写字母、数字和连字符。");
  if (typeof description !== "string" || !description.trim() || description.length > 300) throw error("技能描述不能为空且不能超过 300 个字符。");
  if (typeof instructions !== "string" || !instructions.trim() || instructions.length > MAX_SKILL_SOURCE_LENGTH) throw error("Skill 内容不能为空且不能超过 20000 个字符。");
}

function toSkillSource({ name, description, instructions }) {
  return `---\nname: ${name}\ndescription: ${description}\n---\n\n${instructions.trim()}\n`;
}

function normalizeRelativePath(value) {
  if (typeof value !== "string" || value.includes("\0")) throw error("上传文件路径无效。");
  const normalized = path.posix.normalize(value.replaceAll("\\", "/").replace(/^\/+/, ""));
  if (!normalized || normalized === "." || normalized.startsWith("../") || path.posix.isAbsolute(normalized)) throw error("上传文件路径超出了技能文件夹。");
  return normalized;
}

function trimSingleArchiveRoot(files) {
  const first = files[0]?.path.split("/")[0];
  if (!first || !files.every((file) => file.path.startsWith(`${first}/`))) return files;
  return files.map((file) => ({ ...file, path: file.path.slice(first.length + 1) }));
}

function validateFiles(files) {
  if (!files.length || files.length > MAX_FILES) throw error("请选择不超过 200 个文件的技能文件夹。");
  const normalized = trimSingleArchiveRoot(files.map((file) => ({ ...file, path: normalizeRelativePath(file.path) })));
  const seen = new Set();
  let total = 0;
  for (const file of normalized) {
    if (seen.has(file.path)) throw error(`技能文件夹包含重复路径：${file.path}`);
    seen.add(file.path);
    if (!Buffer.isBuffer(file.data)) throw error("上传文件内容无效。");
    total += file.data.length;
  }
  if (total > MAX_TOTAL_BYTES) throw error("技能文件夹解压后不能超过 8 MB。", 413);
  const skillFile = normalized.find((file) => file.path === "SKILL.md");
  if (!skillFile) throw error("技能文件夹根目录必须包含 SKILL.md。");
  let metadata;
  try { metadata = parseSkill(new TextDecoder("utf-8", { fatal: true }).decode(skillFile.data)); }
  catch (caught) { throw caught instanceof Error ? caught : error("SKILL.md 必须是 UTF-8 文本。"); }
  return { files: normalized, metadata };
}

function decodeBase64(data) {
  if (typeof data !== "string") throw error("上传文件内容无效。");
  try { return Buffer.from(data, "base64"); } catch { throw error("上传文件内容无效。"); }
}

function unzipSkill(buffer) {
  if (buffer.length > MAX_ZIP_BYTES) throw error("ZIP 技能包不能超过 5 MB。", 413);
  const files = [];
  let total = 0;
  let failure;
  const unzip = new Unzip((file) => {
    if (failure) return;
    if (file.name.endsWith("/")) { file.start(); return; }
    let size = 0;
    const chunks = [];
    file.ondata = (caught, chunk, final) => {
      if (caught || failure) { failure ||= error("ZIP 技能包无法解压。"); return; }
      size += chunk.length;
      total += chunk.length;
      if (files.length >= MAX_FILES || total > MAX_TOTAL_BYTES) {
        failure = error("ZIP 技能包超过文件数量或解压大小限制。", 413);
        return;
      }
      chunks.push(Buffer.from(chunk));
      if (final) files.push({ path: file.name, data: Buffer.concat(chunks, size) });
    };
    file.start();
  });
  unzip.register(UnzipInflate);
  try { unzip.push(buffer, true); } catch { throw error("ZIP 技能包无法解压。"); }
  if (failure) throw failure;
  return files;
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

function isInside(root, target) {
  const relative = path.relative(root, target);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function skillRoot(dataDirectory, entry) {
  return entry.storageId ? path.join(skillsDirectory(dataDirectory), entry.storageId) : path.join(BUNDLED_SKILLS_DIRECTORY, entry.baseName);
}

async function writeFolder(dataDirectory, storageId, files) {
  const destination = path.join(skillsDirectory(dataDirectory), storageId);
  const temporary = `${destination}.${process.pid}.${randomUUID()}.tmp`;
  await mkdir(temporary, { recursive: true, mode: 0o700 });
  try {
    for (const file of files) {
      const target = path.resolve(temporary, file.path);
      if (!isInside(temporary, target)) throw error("上传文件路径无效。");
      await mkdir(path.dirname(target), { recursive: true, mode: 0o700 });
      await writeFile(target, file.data, { mode: 0o600 });
    }
    await rm(destination, { recursive: true, force: true });
    await rename(temporary, destination);
  } catch (caught) {
    await rm(temporary, { recursive: true, force: true });
    throw caught;
  }
}

async function readFolder(root) {
  const canonicalRoot = await realpath(root);
  const files = [];
  async function visit(directory, relativeDirectory = "") {
    const children = await readdir(directory, { withFileTypes: true });
    for (const child of children) {
      if (child.isSymbolicLink()) throw error("Skill 文件夹不能包含符号链接。");
      const relative = path.posix.join(relativeDirectory, child.name);
      const absolute = path.join(directory, child.name);
      if (child.isDirectory()) await visit(absolute, relative);
      else if (child.isFile()) files.push({ path: relative, data: await readFile(absolute) });
    }
  }
  await visit(canonicalRoot);
  return files;
}

async function listFolder(root) {
  const canonicalRoot = await realpath(root);
  const files = [];
  async function visit(directory, relativeDirectory = "") {
    const children = await readdir(directory, { withFileTypes: true });
    for (const child of children) {
      if (child.isSymbolicLink()) continue;
      const relative = path.posix.join(relativeDirectory, child.name);
      const absolute = path.join(directory, child.name);
      if (child.isDirectory()) await visit(absolute, relative);
      else if (child.isFile()) {
        const info = await stat(absolute);
        const extension = path.extname(child.name).toLowerCase();
        files.push({
          path: relative,
          name: child.name,
          size: info.size,
          extension,
          category: relative.startsWith("scripts/") ? "script" : relative.startsWith("references/") ? "reference" : relative.startsWith("assets/") ? "asset" : "file",
          isText: TEXT_EXTENSIONS.has(extension),
        });
      }
    }
  }
  await visit(canonicalRoot);
  return files.sort((left, right) => {
    if (left.path === "SKILL.md") return -1;
    if (right.path === "SKILL.md") return 1;
    return left.path.localeCompare(right.path, "zh-CN");
  });
}

async function inspectFile(root, relativePath) {
  const normalized = normalizeRelativePath(relativePath);
  const canonicalRoot = await realpath(root);
  const target = path.resolve(canonicalRoot, normalized);
  if (!isInside(canonicalRoot, target)) throw error("技能文件路径超出了技能目录。");
  const canonicalTarget = await realpath(target).catch(() => null);
  if (!canonicalTarget || !isInside(canonicalRoot, canonicalTarget)) throw error("技能文件不存在或链接到目录之外。", 404);
  const info = await stat(canonicalTarget);
  if (!info.isFile()) throw error("所选路径不是文件。");
  return { path: normalized, canonicalTarget, size: info.size, extension: path.extname(canonicalTarget).toLowerCase() };
}

function assetType(extension) {
  if (IMAGE_TYPES.has(extension)) return { kind: "image", mimeType: IMAGE_TYPES.get(extension) };
  if (extension === ".pdf") return { kind: "pdf", mimeType: "application/pdf" };
  return { kind: "binary", mimeType: "application/octet-stream" };
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

export async function resolvePythonInterpreter({
  environment = process.env,
  platform = process.platform,
  fallbackCandidates,
} = {}) {
  const configured = environment.SKILL_PYTHON_PATH;
  if (configured && !path.isAbsolute(configured)) {
    throw error("SKILL_PYTHON_PATH 必须是 Python 解释器的绝对路径。", 503);
  }
  const pathCandidates = (environment.PATH ?? "")
    .split(path.delimiter)
    .filter(Boolean)
    .map((directory) => path.resolve(directory, "python3"));
  const defaults = platform === "darwin"
    ? [
        environment.DEVELOPER_DIR && path.join(environment.DEVELOPER_DIR, "usr/bin/python3"),
        "/Applications/Xcode.app/Contents/Developer/usr/bin/python3",
        "/Library/Developer/CommandLineTools/usr/bin/python3",
      ]
    : [];
  const candidates = unique([configured, ...pathCandidates, ...(fallbackCandidates ?? defaults)]);

  for (const candidate of candidates) {
    if (platform === "darwin" && MACOS_PYTHON_TOOL_SHIMS.has(candidate)) continue;
    const canonical = await realpath(candidate).catch(() => null);
    if (!canonical || (platform === "darwin" && MACOS_PYTHON_TOOL_SHIMS.has(canonical))) continue;
    const info = await stat(canonical).catch(() => null);
    if (!info?.isFile()) continue;
    const executable = await access(canonical, constants.X_OK).then(() => true).catch(() => false);
    if (!executable) continue;
    const readableRoot = path.resolve(path.dirname(canonical), "..");
    if (readableRoot === path.parse(readableRoot).root) continue;
    return {
      executable: canonical,
      readableRoot,
    };
  }

  throw error(
    "未找到可运行的 Python 3。请安装独立 Python，或通过 SKILL_PYTHON_PATH 指定解释器；为避免系统安装弹窗，不会调用 macOS 的 /usr/bin/python3 工具链代理。",
    503,
  );
}

export function createSkillStore(dataDirectory, { resolvePython = resolvePythonInterpreter } = {}) {
  async function resolveEntry(id, providedStore) {
    const store = providedStore ?? await readStore(dataDirectory);
    const existing = store.entries.find((entry) => entry.id === id);
    if (existing) return { entry: existing, store };
    if (typeof id === "string" && id.startsWith("bundled:")) {
      const baseName = id.slice("bundled:".length);
      if (BUNDLED_SKILL_NAMES.has(baseName) && !store.deletedBundledNames.includes(baseName)) {
        return { entry: { id, origin: "bundled", baseName }, store };
      }
    }
    throw error("技能不存在。", 404);
  }

  async function ensureEditableEntry(id, store) {
    const existing = store.entries.find((entry) => entry.id === id);
    if (existing) return existing;
    if (!id.startsWith("bundled:")) throw error("技能不存在。", 404);
    const baseName = id.slice("bundled:".length);
    if (!BUNDLED_SKILL_NAMES.has(baseName)) throw error("技能不存在。", 404);
    const entry = { id, origin: "bundled", baseName, storageId: randomUUID() };
    await writeFolder(dataDirectory, entry.storageId, await readFolder(path.join(BUNDLED_SKILLS_DIRECTORY, baseName)));
    store.entries.push(entry);
    return entry;
  }

  async function list() {
    const store = await readStore(dataDirectory);
    const resourceFilesByName = {};
    const overrides = new Map(store.entries.filter((entry) => entry.origin === "bundled").map((entry) => [entry.id, entry]));
    for (const baseName of BUNDLED_SKILL_NAMES) {
      if (store.deletedBundledNames.includes(baseName)) continue;
      const entry = overrides.get(`bundled:${baseName}`) ?? { id: `bundled:${baseName}`, origin: "bundled", baseName };
      const source = entry.storageId ? entry : { ...entry, baseName };
      const skill = parseSkill(await readFile(path.join(skillRoot(dataDirectory, source), "SKILL.md"), "utf8"));
      resourceFilesByName[skill.name] = await listFolder(skillRoot(dataDirectory, source));
    }
    for (const entry of store.entries.filter((entry) => entry.origin === "custom")) {
      resourceFilesByName[entry.name] = await listFolder(skillRoot(dataDirectory, entry));
    }
    return {
      entries: store.entries.map(({ id, origin, baseName, name, description, instructions }) => ({ id, origin, baseName, name, description, instructions })),
      deletedBundledNames: store.deletedBundledNames,
      resourceFilesByName,
    };
  }

  async function importFolder(payload) {
    let rawFiles;
    if (payload?.kind === "zip") rawFiles = unzipSkill(decodeBase64(payload.data));
    else {
      const received = Array.isArray(payload?.files) ? payload.files : [];
      rawFiles = received.map((file) => ({ path: file?.path, data: decodeBase64(file?.data) }));
    }
    const { files, metadata } = validateFiles(rawFiles);
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
    const entry = await ensureEditableEntry(id, store);
    ensureUniqueName(store, next.name, id);
    await writeFile(path.join(skillRoot(dataDirectory, entry), "SKILL.md"), toSkillSource(next), { encoding: "utf8", mode: 0o600 });
    Object.assign(entry, next);
    store.deletedBundledNames = store.deletedBundledNames.filter((name) => name !== entry.baseName);
    await saveStore(dataDirectory, store);
    return { id: entry.id, origin: entry.origin, baseName: entry.baseName, ...next };
  }

  async function readResource(id, relativePath) {
    const { entry } = await resolveEntry(id);
    const file = await inspectFile(skillRoot(dataDirectory, entry), relativePath);
    const buffer = await readFile(file.canonicalTarget);
    if (file.size <= MAX_TEXT_FILE_BYTES && !buffer.includes(0) && TEXT_EXTENSIONS.has(file.extension)) {
      return { path: file.path, size: file.size, kind: "text", mimeType: "text/plain; charset=utf-8", content: buffer.toString("utf8") };
    }
    return { path: file.path, size: file.size, ...assetType(file.extension), data: buffer.toString("base64") };
  }

  async function writeResource(id, payload) {
    const relativePath = normalizeRelativePath(payload?.path);
    if (relativePath === "SKILL.md") throw error("请使用 Skill 说明编辑器修改 SKILL.md。");
    const data = decodeBase64(payload?.data);
    if (data.length > MAX_TOTAL_BYTES) throw error("技能文件不能超过 8 MB。", 413);
    const store = await readStore(dataDirectory);
    const entry = await ensureEditableEntry(id, store);
    const root = skillRoot(dataDirectory, entry);
    const currentFiles = await readFolder(root);
    const previous = currentFiles.find((file) => file.path === relativePath);
    const nextTotal = currentFiles.reduce((total, file) => total + file.data.length, 0) - (previous?.data.length ?? 0) + data.length;
    if (nextTotal > MAX_TOTAL_BYTES) throw error("技能文件夹解压后不能超过 8 MB。", 413);
    if (!previous && currentFiles.length >= MAX_FILES) throw error("技能文件夹不能超过 200 个文件。", 413);
    const target = path.resolve(root, relativePath);
    if (!isInside(root, target)) throw error("技能文件路径超出了技能目录。");
    await mkdir(path.dirname(target), { recursive: true, mode: 0o700 });
    await writeFile(target, data, { mode: 0o600 });
    await saveStore(dataDirectory, store);
    return { path: relativePath, size: data.length };
  }

  async function removeResource(id, relativePath) {
    const normalized = normalizeRelativePath(relativePath);
    if (normalized === "SKILL.md") throw error("SKILL.md 不能删除。");
    const store = await readStore(dataDirectory);
    const entry = await ensureEditableEntry(id, store);
    const root = skillRoot(dataDirectory, entry);
    const target = path.resolve(root, normalized);
    if (!isInside(root, target)) throw error("技能文件路径超出了技能目录。");
    await rm(target, { force: false });
    await saveStore(dataDirectory, store);
    return { removed: normalized };
  }

  async function exportZip(id) {
    const { entry } = await resolveEntry(id);
    const files = await readFolder(skillRoot(dataDirectory, entry));
    return Buffer.from(zipSync(Object.fromEntries(files.map((file) => [file.path, file.data]))));
  }

  async function resolveScript(id, relativePath) {
    const { entry } = await resolveEntry(id);
    const normalized = normalizeRelativePath(relativePath);
    if (!normalized.startsWith("scripts/")) throw error("只能运行 Skill 的 scripts/ 目录中的脚本。", 403);
    const extension = path.extname(normalized).toLowerCase();
    const interpreters = { ".sh": "/bin/bash", ".js": process.execPath, ".mjs": process.execPath };
    let interpreter = interpreters[extension];
    let interpreterReadableRoot;
    if (extension === ".py") {
      const python = await resolvePython();
      interpreter = python.executable;
      interpreterReadableRoot = python.readableRoot;
    }
    if (!interpreter) throw error("仅支持运行 .sh、.py、.js 和 .mjs Skill 脚本。", 415);
    const root = skillRoot(dataDirectory, entry);
    const file = await inspectFile(root, normalized);
    return { interpreter, interpreterReadableRoot, scriptPath: file.canonicalTarget, readableRoot: root, path: file.path };
  }

  async function remove(id) {
    const store = await readStore(dataDirectory);
    const index = store.entries.findIndex((entry) => entry.id === id);
    if (index >= 0) {
      const [entry] = store.entries.splice(index, 1);
      if (entry.origin === "bundled" && entry.baseName && !store.deletedBundledNames.includes(entry.baseName)) store.deletedBundledNames.push(entry.baseName);
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

  return { list, importFolder, update, remove, readResource, writeResource, removeResource, exportZip, resolveScript };
}
