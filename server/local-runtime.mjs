import { createServer } from "node:http";
import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, realpath, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { pathToFileURL } from "node:url";

const execFileAsync = promisify(execFile);
const DEFAULT_PORT = 4318;
const MAX_BODY_BYTES = 2 * 1024 * 1024;
const MAX_PREVIEW_BYTES = 5 * 1024 * 1024;
const MAX_FILE_ENTRIES = 800;
const EXCLUDED_DIRECTORIES = new Set([
  ".git",
  ".next",
  ".vinext",
  ".wrangler",
  "node_modules",
  "dist",
  "coverage",
]);
const TEXT_EXTENSIONS = new Set([
  ".c",
  ".cc",
  ".conf",
  ".cpp",
  ".css",
  ".csv",
  ".env",
  ".go",
  ".graphql",
  ".h",
  ".html",
  ".ini",
  ".java",
  ".js",
  ".json",
  ".jsx",
  ".log",
  ".md",
  ".mdx",
  ".mjs",
  ".mts",
  ".py",
  ".rb",
  ".rs",
  ".scss",
  ".sh",
  ".sql",
  ".svg",
  ".toml",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);
const IMAGE_TYPES = new Map([
  [".avif", "image/avif"],
  [".gif", "image/gif"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".png", "image/png"],
  [".webp", "image/webp"],
]);

function isInside(root, target) {
  const relative = path.relative(root, target);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

export function resolveWorkspacePath(root, relativePath = "") {
  if (typeof relativePath !== "string" || relativePath.includes("\0")) {
    throw new Error("文件路径无效。");
  }
  const normalized = relativePath.replaceAll("\\", "/").replace(/^\/+/, "");
  const target = path.resolve(root, normalized);
  if (!isInside(root, target)) throw new Error("文件路径超出了已绑定的项目目录。");
  return target;
}

async function ensureSafeWriteTarget(root, target) {
  let ancestor = path.dirname(target);
  while (ancestor !== path.dirname(ancestor)) {
    try {
      const canonical = await realpath(ancestor);
      if (!isInside(root, canonical)) throw new Error("写入路径经过了项目目录外的链接。");
      return;
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
      ancestor = path.dirname(ancestor);
    }
  }
  throw new Error("无法验证写入目录。");
}

function workspaceStorePath(dataDirectory) {
  return path.join(dataDirectory, "workspaces.json");
}

export async function readWorkspaceRegistry(dataDirectory) {
  try {
    const value = JSON.parse(await readFile(workspaceStorePath(dataDirectory), "utf8"));
    return Array.isArray(value) ? value : [];
  } catch (error) {
    if (error?.code === "ENOENT" || error instanceof SyntaxError) return [];
    throw error;
  }
}

async function saveWorkspaceRegistry(dataDirectory, workspaces) {
  await mkdir(dataDirectory, { recursive: true });
  const target = workspaceStorePath(dataDirectory);
  const temporary = `${target}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(workspaces, null, 2)}\n`, { mode: 0o600 });
  await rename(temporary, target);
}

export async function registerWorkspace(dataDirectory, selectedPath) {
  const canonicalPath = await realpath(selectedPath);
  const info = await stat(canonicalPath);
  if (!info.isDirectory()) throw new Error("选择的路径不是文件夹。");

  const workspaces = await readWorkspaceRegistry(dataDirectory);
  const existing = workspaces.find((workspace) => workspace.path === canonicalPath);
  if (existing) return existing;

  const now = Date.now();
  const workspace = {
    id: randomUUID(),
    name: path.basename(canonicalPath) || canonicalPath,
    path: canonicalPath,
    createdAt: now,
    updatedAt: now,
  };
  await saveWorkspaceRegistry(dataDirectory, [workspace, ...workspaces]);
  return workspace;
}

async function chooseFolder() {
  if (process.platform !== "darwin") {
    throw new Error("当前版本的系统文件夹选择器仅支持 macOS。");
  }
  const { stdout } = await execFileAsync("osascript", [
    "-e",
    'POSIX path of (choose folder with prompt "选择 Agent 项目文件夹")',
  ]);
  return stdout.trim().replace(/\/$/, "");
}

async function findWorkspace(dataDirectory, workspaceId) {
  const workspace = (await readWorkspaceRegistry(dataDirectory)).find(
    (item) => item.id === workspaceId,
  );
  if (!workspace) throw Object.assign(new Error("项目不存在或已解除绑定。"), { status: 404 });
  const canonicalPath = await realpath(workspace.path).catch(() => null);
  if (!canonicalPath) {
    throw Object.assign(new Error("项目文件夹已移动或不可访问。"), { status: 410 });
  }
  return { ...workspace, path: canonicalPath };
}

export async function listWorkspaceFiles(root, requestedDepth = 8) {
  const maxDepth = Math.max(1, Math.min(Number(requestedDepth) || 8, 12));
  const entries = [];

  async function visit(directory, relativeDirectory, depth) {
    if (entries.length >= MAX_FILE_ENTRIES || depth > maxDepth) return;
    const children = await readdir(directory, { withFileTypes: true });
    children.sort((left, right) => {
      if (left.isDirectory() !== right.isDirectory()) return left.isDirectory() ? -1 : 1;
      return left.name.localeCompare(right.name, "zh-CN");
    });

    for (const child of children) {
      if (entries.length >= MAX_FILE_ENTRIES) break;
      if (child.isSymbolicLink()) continue;
      if (child.isDirectory() && EXCLUDED_DIRECTORIES.has(child.name)) continue;
      const relativePath = path.posix.join(relativeDirectory, child.name);
      const absolutePath = path.join(directory, child.name);
      const info = await stat(absolutePath);
      entries.push({
        path: relativePath,
        name: child.name,
        kind: child.isDirectory() ? "directory" : "file",
        size: child.isFile() ? info.size : 0,
        modifiedAt: info.mtimeMs,
        extension: child.isFile() ? path.extname(child.name).toLowerCase() : "",
      });
      if (child.isDirectory()) await visit(absolutePath, relativePath, depth + 1);
    }
  }

  await visit(root, "", 1);
  return { entries, truncated: entries.length >= MAX_FILE_ENTRIES };
}

function previewKind(extension, buffer) {
  if (IMAGE_TYPES.has(extension)) return { kind: "image", mimeType: IMAGE_TYPES.get(extension) };
  if (extension === ".pdf") return { kind: "pdf", mimeType: "application/pdf" };
  if (TEXT_EXTENSIONS.has(extension) || !buffer.includes(0)) {
    return { kind: "text", mimeType: "text/plain; charset=utf-8" };
  }
  return { kind: "unsupported", mimeType: "application/octet-stream" };
}

export async function readWorkspaceFile(root, relativePath) {
  const target = resolveWorkspacePath(root, relativePath);
  const canonicalTarget = await realpath(target);
  if (!isInside(root, canonicalTarget)) throw new Error("文件链接指向项目目录之外。");
  const info = await stat(canonicalTarget);
  if (!info.isFile()) throw new Error("所选路径不是文件。");
  const extension = path.extname(canonicalTarget).toLowerCase();
  if (info.size > MAX_PREVIEW_BYTES) {
    return {
      path: relativePath,
      name: path.basename(canonicalTarget),
      size: info.size,
      modifiedAt: info.mtimeMs,
      extension,
      kind: "too-large",
      mimeType: "application/octet-stream",
    };
  }
  const buffer = await readFile(canonicalTarget);
  const preview = previewKind(extension, buffer);
  return {
    path: relativePath,
    name: path.basename(canonicalTarget),
    size: info.size,
    modifiedAt: info.mtimeMs,
    extension,
    ...preview,
    content: preview.kind === "text" ? buffer.toString("utf8") : undefined,
    data: preview.kind === "image" || preview.kind === "pdf" ? buffer.toString("base64") : undefined,
  };
}

export async function writeWorkspaceFile(root, relativePath, content) {
  if (typeof content !== "string" || Buffer.byteLength(content) > MAX_BODY_BYTES) {
    throw new Error("写入内容无效或超过 2MB 限制。");
  }
  const target = resolveWorkspacePath(root, relativePath);
  if (target === root) throw new Error("必须提供文件名。");
  await ensureSafeWriteTarget(root, target);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content, "utf8");
  const info = await stat(target);
  return {
    path: path.relative(root, target).split(path.sep).join("/"),
    size: info.size,
    modifiedAt: info.mtimeMs,
  };
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

async function readJsonBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw Object.assign(new Error("请求内容过大。"), { status: 413 });
    chunks.push(chunk);
  }
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export function createLocalRuntimeHandler({ dataDirectory, token }) {
  return async function handle(request, response) {
    try {
      if (!token || request.headers.authorization !== `Bearer ${token}`) {
        return sendJson(response, 401, { message: "本机 Runtime 鉴权失败。" });
      }
      const url = new URL(request.url ?? "/", "http://127.0.0.1");
      const segments = url.pathname.split("/").filter(Boolean).map(decodeURIComponent);

      if (request.method === "GET" && url.pathname === "/health") {
        return sendJson(response, 200, { status: "ok", platform: process.platform });
      }
      if (request.method === "GET" && url.pathname === "/workspaces") {
        return sendJson(response, 200, { workspaces: await readWorkspaceRegistry(dataDirectory) });
      }
      if (request.method === "POST" && url.pathname === "/workspaces/select") {
        const selectedPath = await chooseFolder();
        return sendJson(response, 201, { workspace: await registerWorkspace(dataDirectory, selectedPath) });
      }

      if (segments[0] === "workspaces" && segments[1]) {
        const workspace = await findWorkspace(dataDirectory, segments[1]);
        if (request.method === "DELETE" && segments.length === 2) {
          const workspaces = await readWorkspaceRegistry(dataDirectory);
          await saveWorkspaceRegistry(
            dataDirectory,
            workspaces.filter((item) => item.id !== workspace.id),
          );
          return sendJson(response, 200, { removed: workspace.id });
        }
        if (request.method === "GET" && segments[2] === "files" && segments.length === 3) {
          return sendJson(response, 200, {
            ...(await listWorkspaceFiles(workspace.path, url.searchParams.get("depth"))),
            workspaceId: workspace.id,
          });
        }
        if (request.method === "GET" && segments[2] === "files" && segments[3] === "content") {
          const filePath = url.searchParams.get("path") ?? "";
          return sendJson(response, 200, await readWorkspaceFile(workspace.path, filePath));
        }
        if (request.method === "POST" && segments[2] === "files" && segments[3] === "write") {
          const payload = await readJsonBody(request);
          return sendJson(
            response,
            201,
            await writeWorkspaceFile(workspace.path, payload.path, payload.content),
          );
        }
      }

      return sendJson(response, 404, { message: "本机 Runtime 路由不存在。" });
    } catch (error) {
      const status = Number(error?.status) || (error instanceof SyntaxError ? 400 : 500);
      const message =
        error?.code === "ENOENT"
          ? "文件或目录不存在。"
          : error?.message || "本机 Runtime 发生未知错误。";
      return sendJson(response, status, { message });
    }
  };
}

async function start() {
  const port = Number(process.env.LOCAL_RUNTIME_PORT) || DEFAULT_PORT;
  const token = process.env.LOCAL_RUNTIME_TOKEN;
  const dataDirectory = process.env.PI_LOCAL_DATA_DIR ?? path.join(process.cwd(), ".local-data");
  if (!token) throw new Error("缺少 LOCAL_RUNTIME_TOKEN，必须通过 npm run dev 启动。");
  const server = createServer(createLocalRuntimeHandler({ dataDirectory, token }));
  server.listen(port, "127.0.0.1", () => {
    console.log(`Local Agent Runtime ready on http://127.0.0.1:${port}`);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  start().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
