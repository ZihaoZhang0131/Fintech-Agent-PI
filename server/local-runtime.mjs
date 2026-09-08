import { createTraceQuery } from "./trace-query.mjs";
import { createWorkflowHttp } from "./workflow/http.mjs";
import { createChatStore, MAX_CONVERSATION_BYTES } from "./chat-store.mjs";
import { createServer } from "node:http";
import { execFile, spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { copyFile, mkdir, readFile, readdir, realpath, rename, rm, stat, writeFile } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createMcpManager } from "./mcp-manager.mjs";
import { createLocalDatabase } from "./local-database.mjs";
import { createTraceStore } from "./trace-store.mjs";
import { createSkillStore } from "./skill-store.mjs";
import { resolvePythonInterpreter } from "./skill-store.mjs";
import {
  deleteModelProvider,
  listPublicModelProviders,
  resolveConfiguredModel,
  saveModelProvider,
  updateModelVerification,
} from "./model-providers.mjs";

const execFileAsync = promisify(execFile);
const DEFAULT_PORT = 4318;
const MAX_BODY_BYTES = 2 * 1024 * 1024;
const MAX_SKILL_BODY_BYTES = 12 * 1024 * 1024;
const MAX_TEXT_PREVIEW_BYTES = 1 * 1024 * 1024;
const MAX_ASSET_PREVIEW_BYTES = 20 * 1024 * 1024;
const MAX_FILE_ENTRIES = 800;
const MAX_COMMAND_BYTES = 20_000;
const MAX_COMMAND_OUTPUT_BYTES = 200 * 1024;
const DEFAULT_COMMAND_TIMEOUT_MS = 60_000;
const MAX_COMMAND_TIMEOUT_MS = 120_000;
const COMMAND_JOB_TTL_MS = 10 * 60_000;
const MAX_DOCUMENT_MARKDOWN_BYTES = 500_000;
const MAX_DOCUMENT_TEMPLATE_BYTES = 20 * 1024 * 1024;
const MAX_DOCUMENT_CHARTS = 12;
const DOCUMENT_COMPONENT_WAIT_MS = 75_000;
const RUNTIME_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOCUMENT_RENDERER_PATH = path.join(RUNTIME_ROOT, "server", "document-renderer.py");
const EXCLUDED_DIRECTORIES = new Set([
  ".git",
  ".next",
  ".vinext",
  ".wrangler",
  "node_modules",
  "dist",
  "coverage",
  ".venv",
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

function normalizeWorkspaceRelativePath(relativePath = "") {
  const slashPath = relativePath.replaceAll("\\", "/").replace(/^\/+/, "");
  const normalized = path.posix.normalize(slashPath);
  return normalized === "." ? "" : normalized.replace(/\/$/, "");
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

export async function listWorkspaceFiles(root, requestedDepth = 1) {
  const maxDepth = Math.max(1, Math.min(Number(requestedDepth) || 1, 12));
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

export async function listWorkspaceDirectory(root, relativeDirectory = "") {
  if (typeof relativeDirectory !== "string" || relativeDirectory.includes("\0")) {
    throw Object.assign(new Error("目录路径无效。"), { status: 400 });
  }

  const normalizedDirectory = normalizeWorkspaceRelativePath(relativeDirectory);
  const canonicalRoot = await realpath(root);
  const target = resolveWorkspacePath(canonicalRoot, normalizedDirectory);
  const canonicalTarget = await realpath(target);
  if (!isInside(canonicalRoot, canonicalTarget)) {
    throw Object.assign(new Error("目录链接指向项目目录之外。"), { status: 400 });
  }
  const targetInfo = await stat(canonicalTarget);
  if (!targetInfo.isDirectory()) {
    throw Object.assign(new Error("所选路径不是目录。"), { status: 400 });
  }

  const children = await readdir(canonicalTarget, { withFileTypes: true });
  children.sort((left, right) => {
    if (left.isDirectory() !== right.isDirectory()) return left.isDirectory() ? -1 : 1;
    return left.name.localeCompare(right.name, "zh-CN");
  });
  const visibleChildren = children.filter(
    (child) =>
      !child.isSymbolicLink() &&
      !(child.isDirectory() && EXCLUDED_DIRECTORIES.has(child.name)),
  );

  const entries = [];
  for (const child of visibleChildren) {
    if (entries.length >= MAX_FILE_ENTRIES) break;
    const absolutePath = path.join(canonicalTarget, child.name);
    const info = await stat(absolutePath);
    entries.push({
      path: path.posix.join(normalizedDirectory, child.name),
      name: child.name,
      kind: child.isDirectory() ? "directory" : "file",
      size: child.isFile() ? info.size : 0,
      modifiedAt: info.mtimeMs,
      extension: child.isFile() ? path.extname(child.name).toLowerCase() : "",
    });
  }

  return {
    directory: normalizedDirectory,
    entries,
    truncated: visibleChildren.length > entries.length,
  };
}

function previewKind(extension, buffer) {
  if (IMAGE_TYPES.has(extension)) return { kind: "image", mimeType: IMAGE_TYPES.get(extension) };
  if (extension === ".pdf") return { kind: "pdf", mimeType: "application/pdf" };
  if (TEXT_EXTENSIONS.has(extension)) {
    if (buffer.includes(0)) return { kind: "unsupported", mimeType: "application/octet-stream" };
    return { kind: "text", mimeType: "text/plain; charset=utf-8" };
  }
  if (!buffer.includes(0)) {
    return { kind: "text", mimeType: "text/plain; charset=utf-8" };
  }
  return { kind: "unsupported", mimeType: "application/octet-stream" };
}

async function inspectWorkspaceFile(root, relativePath) {
  const target = resolveWorkspacePath(root, relativePath);
  const canonicalTarget = await realpath(target);
  if (!isInside(root, canonicalTarget)) throw new Error("文件链接指向项目目录之外。");
  const info = await stat(canonicalTarget);
  if (!info.isFile()) throw new Error("所选路径不是文件。");
  return {
    path: relativePath,
    name: path.basename(canonicalTarget),
    size: info.size,
    modifiedAt: info.mtimeMs,
    extension: path.extname(canonicalTarget).toLowerCase(),
    canonicalTarget,
  };
}

function contentDisposition(name, disposition) {
  return `${disposition}; filename="download"; filename*=UTF-8''${encodeURIComponent(name)}`;
}

export async function readWorkspaceFile(root, relativePath) {
  const file = await inspectWorkspaceFile(root, relativePath);
  const assetPreview = previewKind(file.extension, Buffer.alloc(0));
  if (assetPreview.kind === "image" || assetPreview.kind === "pdf") {
    return {
      ...file,
      canonicalTarget: undefined,
      ...assetPreview,
      kind: file.size > MAX_ASSET_PREVIEW_BYTES ? "too-large" : assetPreview.kind,
      previewLimitBytes: MAX_ASSET_PREVIEW_BYTES,
    };
  }
  if (file.size > MAX_TEXT_PREVIEW_BYTES) {
    return {
      ...file,
      canonicalTarget: undefined,
      kind: "too-large",
      mimeType: "application/octet-stream",
      previewLimitBytes: MAX_TEXT_PREVIEW_BYTES,
    };
  }
  const buffer = await readFile(file.canonicalTarget);
  const preview = previewKind(file.extension, buffer);
  return {
    ...file,
    canonicalTarget: undefined,
    ...preview,
    content: preview.kind === "text" ? buffer.toString("utf8") : undefined,
  };
}

async function sendWorkspaceAsset(response, root, relativePath, download) {
  const file = await inspectWorkspaceFile(root, relativePath);
  const preview = previewKind(file.extension, Buffer.alloc(0));
  const isPreviewableAsset = preview.kind === "image" || preview.kind === "pdf";
  if (!download && !isPreviewableAsset) {
    throw Object.assign(new Error("该文件不能以内嵌资源方式预览。"), { status: 415 });
  }
  if (!download && file.size > MAX_ASSET_PREVIEW_BYTES) {
    throw Object.assign(new Error(`文件超过 ${MAX_ASSET_PREVIEW_BYTES / 1024 / 1024}MB 预览限制。`), {
      status: 413,
    });
  }
  response.writeHead(200, {
    "Content-Type": isPreviewableAsset ? preview.mimeType : "application/octet-stream",
    "Content-Length": file.size,
    "Content-Disposition": contentDisposition(file.name, download ? "attachment" : "inline"),
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  await pipeline(createReadStream(file.canonicalTarget), response);
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

function sandboxString(value) {
  return JSON.stringify(value);
}

function createSandboxProfile(workspaceRoot, commandHome, commandTemporaryDirectory, extraReadableRoots = []) {
  const readableRoots = [
    "/System",
    "/Library",
    "/Applications",
    "/bin",
    "/sbin",
    "/usr",
    "/opt",
    "/private/etc",
    "/dev",
    workspaceRoot,
    commandHome,
    commandTemporaryDirectory,
    ...extraReadableRoots,
  ];
  const writableRoots = [workspaceRoot, commandHome, commandTemporaryDirectory];
  const readable = readableRoots.map((root) => `(subpath ${sandboxString(root)})`).join(" ");
  const writable = writableRoots.map((root) => `(subpath ${sandboxString(root)})`).join(" ");
  return [
    "(version 1)",
    "(deny default)",
    "(allow process*)",
    "(allow signal (target same-sandbox))",
    "(allow sysctl-read)",
    "(allow mach-lookup)",
    "(allow network*)",
    `(allow file-read* (literal "/") ${readable})`,
    `(allow file-write* ${writable} (literal \"/dev/null\"))`,
  ].join(" ");
}

function commandEnvironment(permissionMode, commandHome, commandTemporaryDirectory) {
  const environment = {
    PATH: process.env.PATH ?? "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin",
    LANG: process.env.LANG ?? "en_US.UTF-8",
    LC_ALL: process.env.LC_ALL ?? "en_US.UTF-8",
    SHELL: "/bin/bash",
    TERM: process.env.TERM ?? "xterm-256color",
    TMPDIR: commandTemporaryDirectory,
    HOME: permissionMode === "sandbox" ? commandHome : process.env.HOME ?? commandHome,
    NPM_CONFIG_CACHE: path.join(commandHome, ".npm"),
    XDG_CACHE_HOME: path.join(commandHome, ".cache"),
  };
  if (process.env.USER) environment.USER = process.env.USER;
  if (process.env.AKTOOLS_BASE_URL) environment.AKTOOLS_BASE_URL = process.env.AKTOOLS_BASE_URL;
  return environment;
}

function appendCommandOutput(current, chunk, remainingBytes) {
  if (remainingBytes <= 0) return { value: current, addedBytes: 0, truncated: true };
  const buffer = Buffer.from(chunk);
  const accepted = buffer.subarray(0, remainingBytes);
  return {
    value: current + accepted.toString("utf8"),
    addedBytes: accepted.length,
    truncated: buffer.length > accepted.length,
  };
}

function terminateProcessGroup(child, signal = "SIGTERM") {
  if (!child.pid) return;
  try {
    process.kill(-child.pid, signal);
  } catch {
    try {
      child.kill(signal);
    } catch {
      // The process already exited.
    }
  }
}

export async function executeWorkspaceCommand({
  root,
  dataDirectory,
  command,
  permissionMode = "sandbox",
  timeoutMs = DEFAULT_COMMAND_TIMEOUT_MS,
  extraReadableRoots = [],
  signal,
}) {
  if (typeof command !== "string" || !command.trim()) throw new Error("Bash 命令不能为空。");
  if (Buffer.byteLength(command) > MAX_COMMAND_BYTES) throw new Error("Bash 命令过长。");
  if (permissionMode !== "sandbox" && permissionMode !== "full") {
    throw new Error("Bash 权限模式无效。");
  }
  if (permissionMode === "sandbox" && process.platform !== "darwin") {
    throw new Error("当前系统不支持项目沙箱，命令未执行。");
  }

  const canonicalRoot = await realpath(root);
  const canonicalExtraReadableRoots = await Promise.all(extraReadableRoots.map((directory) => realpath(directory)));
  const boundedTimeout = Math.max(
    1_000,
    Math.min(Number(timeoutMs) || DEFAULT_COMMAND_TIMEOUT_MS, MAX_COMMAND_TIMEOUT_MS),
  );
  const commandHome = path.join(dataDirectory, "command-home");
  const commandTemporaryDirectory = path.join(dataDirectory, "command-tmp");
  await mkdir(commandHome, { recursive: true, mode: 0o700 });
  await mkdir(commandTemporaryDirectory, { recursive: true, mode: 0o700 });

  const executable = permissionMode === "sandbox" ? "/usr/bin/sandbox-exec" : "/bin/bash";
  const args =
    permissionMode === "sandbox"
      ? [
          "-p",
          createSandboxProfile(canonicalRoot, commandHome, commandTemporaryDirectory, canonicalExtraReadableRoots),
          "/bin/bash",
          "-c",
          command,
        ]
      : ["-c", command];
  const startedAt = Date.now();

  return await new Promise((resolve, reject) => {
    const child = spawn(executable, args, {
      cwd: canonicalRoot,
      env: commandEnvironment(permissionMode, commandHome, commandTemporaryDirectory),
      detached: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    let outputBytes = 0;
    let truncated = false;
    let timedOut = false;
    let settled = false;
    let forceKillTimeout;

    const collect = (target, chunk) => {
      const appended = appendCommandOutput(
        target === "stdout" ? stdout : stderr,
        chunk,
        MAX_COMMAND_OUTPUT_BYTES - outputBytes,
      );
      outputBytes += appended.addedBytes;
      truncated ||= appended.truncated;
      if (target === "stdout") stdout = appended.value;
      else stderr = appended.value;
    };
    child.stdout.on("data", (chunk) => collect("stdout", chunk));
    child.stderr.on("data", (chunk) => collect("stderr", chunk));

    const killTimer = () => {
      if (forceKillTimeout) return;
      terminateProcessGroup(child, "SIGTERM");
      forceKillTimeout = setTimeout(() => terminateProcessGroup(child, "SIGKILL"), 1_000);
      forceKillTimeout.unref();
    };
    const timeout = setTimeout(() => {
      timedOut = true;
      killTimer();
    }, boundedTimeout);
    timeout.unref();
    const abort = () => killTimer();
    if (signal?.aborted) abort();
    else signal?.addEventListener("abort", abort, { once: true });

    child.once("error", (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (forceKillTimeout) clearTimeout(forceKillTimeout);
      signal?.removeEventListener("abort", abort);
      reject(error);
    });
    child.once("close", (exitCode, exitSignal) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (forceKillTimeout) clearTimeout(forceKillTimeout);
      signal?.removeEventListener("abort", abort);
      resolve({
        stdout,
        stderr,
        exitCode,
        signal: exitSignal,
        timedOut,
        cancelled: Boolean(signal?.aborted),
        truncated,
        durationMs: Date.now() - startedAt,
      });
    });
  });
}

export function createCommandManager({ dataDirectory }) {
  const jobs = new Map();

  function snapshot(job) {
    return {
      id: job.id,
      workspaceId: job.workspaceId,
      command: job.command,
      approvalMode: job.approvalMode,
      permissionMode: job.permissionMode,
      timeoutMs: job.timeoutMs,
      status: job.status,
      createdAt: job.createdAt,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
      result: job.result,
      error: job.error,
    };
  }

  function requireJob(workspaceId, commandId) {
    const job = jobs.get(commandId);
    if (!job || job.workspaceId !== workspaceId) {
      throw Object.assign(new Error("Bash 命令任务不存在。"), { status: 404 });
    }
    return job;
  }

  async function run(job) {
    if (job.status !== "approved" && job.status !== "created") return;
    job.status = "running";
    job.startedAt = Date.now();
    job.controller = new AbortController();
    try {
      job.result = await executeWorkspaceCommand({
        root: job.workspaceRoot,
        dataDirectory,
        command: job.command,
        permissionMode: job.permissionMode,
        timeoutMs: job.timeoutMs,
        extraReadableRoots: job.extraReadableRoots,
        signal: job.controller.signal,
      });
      job.status = job.result.cancelled ? "cancelled" : "completed";
    } catch (error) {
      job.status = "failed";
      job.error = error instanceof Error ? error.message : String(error);
    } finally {
      job.completedAt = Date.now();
      job.controller = undefined;
    }
  }

  function create(workspace, payload, { extraReadableRoots = [] } = {}) {
    const command = typeof payload.command === "string" ? payload.command.trim() : "";
    if (!command || Buffer.byteLength(command) > MAX_COMMAND_BYTES) {
      throw Object.assign(new Error("Bash 命令为空或过长。"), { status: 400 });
    }
    if (
      payload.approvalMode !== undefined &&
      payload.approvalMode !== "ask" &&
      payload.approvalMode !== "auto"
    ) {
      throw Object.assign(new Error("Bash 执行模式无效。"), { status: 400 });
    }
    if (
      payload.permissionMode !== undefined &&
      payload.permissionMode !== "sandbox" &&
      payload.permissionMode !== "full"
    ) {
      throw Object.assign(new Error("Bash 权限模式无效。"), { status: 400 });
    }
    const approvalMode = payload.approvalMode ?? "auto";
    const permissionMode = payload.permissionMode ?? "sandbox";
    const timeoutMs = Math.max(
      1_000,
      Math.min(Number(payload.timeoutMs) || DEFAULT_COMMAND_TIMEOUT_MS, MAX_COMMAND_TIMEOUT_MS),
    );
    const job = {
      id: randomUUID(),
      workspaceId: workspace.id,
      workspaceRoot: workspace.path,
      extraReadableRoots,
      command,
      approvalMode,
      permissionMode,
      timeoutMs,
      status: approvalMode === "ask" ? "pending_approval" : "created",
      createdAt: Date.now(),
    };
    jobs.set(job.id, job);
    if (approvalMode === "auto") void run(job);
    return snapshot(job);
  }

  function get(workspaceId, commandId) {
    return snapshot(requireJob(workspaceId, commandId));
  }

  function decide(workspaceId, commandId, decision) {
    const job = requireJob(workspaceId, commandId);
    if (job.status !== "pending_approval") {
      throw Object.assign(new Error("Bash 命令已经处理，不能重复审批。"), { status: 409 });
    }
    if (decision === "reject") {
      job.status = "rejected";
      job.completedAt = Date.now();
    } else if (decision === "approve") {
      job.status = "approved";
      void run(job);
    } else {
      throw Object.assign(new Error("Bash 审批决定无效。"), { status: 400 });
    }
    return snapshot(job);
  }

  function cancel(workspaceId, commandId) {
    const job = requireJob(workspaceId, commandId);
    if (job.status === "running") job.controller?.abort();
    else if (job.status === "pending_approval" || job.status === "created" || job.status === "approved") {
      job.status = "cancelled";
      job.completedAt = Date.now();
    }
    return snapshot(job);
  }

  const cleanupTimer = setInterval(() => {
    const cutoff = Date.now() - COMMAND_JOB_TTL_MS;
    for (const [id, job] of jobs) {
      if ((job.completedAt ?? job.createdAt) < cutoff && job.status !== "running") jobs.delete(id);
    }
  }, 60_000);
  cleanupTimer.unref();

  return { create, get, decide, cancel };
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

async function readJsonBody(request, maxBytes = MAX_BODY_BYTES) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBytes) throw Object.assign(new Error("请求内容过大。"), { status: 413 });
    chunks.push(chunk);
  }
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function shellQuote(value) {
  return `'${String(value).replaceAll("'", "'\\\"'\\\"'")}'`;
}

function documentError(message, status = 400) {
  return Object.assign(new Error(message), { status });
}

function throwIfDocumentCancelled(signal) {
  if (signal?.aborted) throw documentError("文档生成已取消。", 499);
}

async function waitForManagedDocumentComponents(dataDirectory, signal) {
  const pandocPath = path.resolve(process.env.PANDOC_PATH || path.join(dataDirectory, "pandoc", "bin", "pandoc"));
  const pythonPath = path.resolve(process.env.DOCUMENT_PYTHON_PATH || path.join(dataDirectory, "documents-venv", "bin", "python"));
  const readyMarkerPath = path.join(dataDirectory, "documents-ready-v2");
  const deadline = Date.now() + DOCUMENT_COMPONENT_WAIT_MS;
  while (Date.now() < deadline) {
    throwIfDocumentCancelled(signal);
    const [pandoc, python, readyMarker] = await Promise.all([
      realpath(pandocPath).catch(() => null),
      realpath(pythonPath).catch(() => null),
      realpath(readyMarkerPath).catch(() => null),
    ]);
    // The Python virtualenv entrypoint is usually a symlink. Probe its realpath,
    // but retain the entrypoint so Python keeps the virtualenv site-packages.
    if (pandoc && python && readyMarker) return { pandoc: pandocPath, python: pythonPath };
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw documentError("文档组件尚未初始化完成。请稍后重试；不要在当前项目目录运行 npm、Pandoc 或 Python。", 503);
}

function normalizeDocumentFilename(filename, format) {
  if (typeof filename !== "string" || !filename.trim() || filename.length > 120) {
    throw documentError("文档文件名无效。");
  }
  const trimmed = filename.trim();
  if (trimmed.includes("/") || trimmed.includes("\\") || trimmed.includes("\0")) {
    throw documentError("文档文件名不能包含路径。");
  }
  const basename = trimmed.replace(/\.(docx|pdf)$/i, "").trim();
  if (!basename || basename === "." || basename === "..") {
    throw documentError("文档文件名无效。");
  }
  return `${basename}.${format}`;
}

function validateDocumentPayload(payload) {
  if (!payload || typeof payload !== "object") throw documentError("文档请求无效。");
  if (payload.format !== "docx" && payload.format !== "pdf") {
    throw documentError("文档格式仅支持 docx 或 pdf。");
  }
  if (typeof payload.markdown !== "string" || !payload.markdown.trim()) {
    throw documentError("文档 Markdown 内容不能为空。");
  }
  if (Buffer.byteLength(payload.markdown, "utf8") > MAX_DOCUMENT_MARKDOWN_BYTES) {
    throw documentError("文档 Markdown 内容超过 500KB 限制。", 413);
  }
  if (payload.referenceDocxPath !== undefined && typeof payload.referenceDocxPath !== "string") {
    throw documentError("referenceDocxPath 必须是项目内 .docx 文件路径。");
  }
  if (payload.charts !== undefined && !Array.isArray(payload.charts)) {
    throw documentError("charts 必须是数组。");
  }
  const charts = payload.charts ?? [];
  if (charts.length > MAX_DOCUMENT_CHARTS) throw documentError("最多支持 12 个基础图表。");
  const ids = new Set();
  for (const chart of charts) {
    if (!chart || typeof chart !== "object" || !/^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(chart.id ?? "")) {
      throw documentError("图表 ID 无效。");
    }
    if (ids.has(chart.id)) throw documentError("图表 ID 不能重复。");
    ids.add(chart.id);
    if ((chart.type !== "bar" && chart.type !== "line") || !Array.isArray(chart.labels) || !Array.isArray(chart.series)) {
      throw documentError("图表类型或数据无效。");
    }
    if (!chart.labels.length || chart.labels.length > 48 || !chart.series.length || chart.series.length > 8) {
      throw documentError("图表标签或数据序列数量无效。");
    }
    if (chart.labels.some((label) => typeof label !== "string" || !label.trim() || label.length > 80)) {
      throw documentError("图表标签必须是 1 至 80 个字符的文本。");
    }
    if (chart.title !== undefined && (typeof chart.title !== "string" || chart.title.length > 200)) {
      throw documentError("图表标题无效。");
    }
    for (const series of chart.series) {
      if (!series || typeof series.name !== "string" || !series.name.trim() || series.name.length > 80 || !Array.isArray(series.values) || series.values.length !== chart.labels.length) {
        throw documentError("图表序列必须与标签数量一致。");
      }
      if (series.values.some((value) => typeof value !== "number" || !Number.isFinite(value))) {
        throw documentError("图表数值必须是有限数字。");
      }
    }
  }
  return {
    format: payload.format,
    filename: normalizeDocumentFilename(payload.filename, payload.format),
    markdown: payload.markdown,
    referenceDocxPath: payload.referenceDocxPath,
    charts,
  };
}

async function resolveDocumentTemplate(root, relativePath) {
  let normalized;
  try {
    normalized = normalizeWorkspaceRelativePath(relativePath);
  } catch {
    throw documentError("样式模板必须是当前项目内的 .docx 文件。");
  }
  if (!normalized || normalized === ".." || normalized.startsWith("../") || path.extname(normalized).toLowerCase() !== ".docx") {
    throw documentError("样式模板必须是当前项目内的 .docx 文件。");
  }
  const target = resolveWorkspacePath(root, normalized);
  const canonical = await realpath(target).catch(() => null);
  if (!canonical || !isInside(root, canonical)) {
    throw documentError("样式模板不存在或指向项目目录之外。");
  }
  const info = await stat(canonical);
  if (!info.isFile() || info.size > MAX_DOCUMENT_TEMPLATE_BYTES) {
    throw documentError("样式模板不是有效文件或超过 20MB 限制。");
  }
  const header = await readFile(canonical);
  if (header.length < 4 || header.subarray(0, 2).toString("utf8") !== "PK") {
    throw documentError("样式模板不是有效的 DOCX 文件。");
  }
  return canonical;
}

function safeProcessMessage(error, fallback) {
  const detail = error?.stderr || error?.stdout || error?.message;
  return typeof detail === "string" && detail.trim() ? detail.trim().slice(0, 2_000) : fallback;
}

async function validateRenderedPdf(pdfPath, temporaryDirectory) {
  const pdfInfo = process.env.DOCUMENT_PDFINFO_PATH || "pdfinfo";
  const pdftoppm = process.env.DOCUMENT_PDFTOPPM_PATH || "pdftoppm";
  let info;
  try {
    info = await execFileAsync(pdfInfo, [pdfPath], { maxBuffer: 64 * 1024 });
  } catch (error) {
    throw documentError(`无法读取生成的 PDF：${safeProcessMessage(error, "pdfinfo 执行失败。")}`, 500);
  }
  const pageMatch = /^Pages:\s+(\d+)$/m.exec(info.stdout);
  const pageCount = Number(pageMatch?.[1] ?? 0);
  if (!Number.isInteger(pageCount) || pageCount < 1) throw documentError("生成的 PDF 没有有效页面。", 500);
  const renderDirectory = path.join(temporaryDirectory, `pdf-pages-${randomUUID()}`);
  await mkdir(renderDirectory, { recursive: true, mode: 0o700 });
  try {
    await execFileAsync(pdftoppm, ["-png", pdfPath, path.join(renderDirectory, "page")], { maxBuffer: 64 * 1024 });
  } catch (error) {
    throw documentError(`PDF 渲染校验失败：${safeProcessMessage(error, "pdftoppm 执行失败。")}`, 500);
  }
  const renderedPages = (await readdir(renderDirectory)).filter((name) => /^page-\d+\.png$/.test(name));
  if (renderedPages.length !== pageCount) throw documentError("PDF 渲染页数与文档页数不一致。", 500);
  return { pageCount, renderedPages: renderedPages.length };
}

async function validateDirectPdf(pdfPath, renderDirectory, rendererStdout) {
  const pdf = await readFile(pdfPath).catch(() => null);
  if (!pdf || pdf.length < 5 || pdf.subarray(0, 5).toString("utf8") !== "%PDF-") {
    throw documentError("PDF 输出校验失败。", 500);
  }
  const resultLine = rendererStdout.split(/\r?\n/).find((line) => line.startsWith("DOCUMENT_RESULT "));
  let metadata;
  try {
    metadata = JSON.parse(resultLine?.slice("DOCUMENT_RESULT ".length) ?? "null");
  } catch {
    metadata = null;
  }
  const pageCount = metadata?.pageCount;
  const renderedPages = metadata?.renderedPages;
  if (!Number.isInteger(pageCount) || pageCount < 1 || renderedPages !== pageCount) {
    throw documentError("PDF 逐页渲染结果无效。", 500);
  }
  const names = (await readdir(renderDirectory)).filter((name) => /^page-\d+\.png$/.test(name));
  if (names.length !== pageCount) throw documentError("PDF 渲染页数与文档页数不一致。", 500);
  for (const name of names) {
    const image = await readFile(path.join(renderDirectory, name));
    if (image.length < 8 || image.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
      throw documentError("PDF 页面预览校验失败。", 500);
    }
  }
  return { pageCount, renderedPages };
}

async function generateDocumentArtifact(workspace, dataDirectory, payload, signal) {
  throwIfDocumentCancelled(signal);
  const request = validateDocumentPayload(payload);
  const temporaryDirectory = path.join(dataDirectory, "document-jobs", randomUUID());
  const outputPath = resolveWorkspacePath(workspace.path, path.posix.join("outputs", request.filename));
  await ensureSafeWriteTarget(workspace.path, outputPath);
  await mkdir(temporaryDirectory, { recursive: true, mode: 0o700 });
  try {
    const templatePath = request.referenceDocxPath ? await resolveDocumentTemplate(workspace.path, request.referenceDocxPath) : undefined;
    const referenceDocx = templatePath ? path.join(temporaryDirectory, "reference.docx") : undefined;
    if (templatePath && referenceDocx) await copyFile(templatePath, referenceDocx);
    const inputPath = path.join(temporaryDirectory, "input.json");
    const docxPath = path.join(temporaryDirectory, "document.docx");
    const cjkPdfPath = path.join(temporaryDirectory, "document-cjk.pdf");
    const cjkRenderDirectory = path.join(temporaryDirectory, "document-cjk-pages");
    await writeFile(inputPath, JSON.stringify({ markdown: request.markdown, charts: request.charts, referenceDocx }), { encoding: "utf8", mode: 0o600 });
    const documentComponents = await waitForManagedDocumentComponents(dataDirectory, signal);
    const python = await resolvePythonInterpreter({
      environment: { ...process.env, SKILL_PYTHON_PATH: documentComponents.python },
    });
    let rendererStdout = "";
    try {
      const rendererArguments = [DOCUMENT_RENDERER_PATH, inputPath, docxPath];
      if (request.format === "pdf" && !referenceDocx) rendererArguments.push("--pdf", cjkPdfPath, "--pdf-render-dir", cjkRenderDirectory);
      const renderer = await execFileAsync(python.executable, rendererArguments, {
        cwd: temporaryDirectory,
        env: { ...process.env, PANDOC_PATH: documentComponents.pandoc },
        signal,
        maxBuffer: 256 * 1024,
      });
      rendererStdout = renderer.stdout;
    } catch (error) {
      throwIfDocumentCancelled(signal);
      throw documentError(`DOCX 生成失败：${safeProcessMessage(error, "文档渲染器执行失败。")}`, 500);
    }
    const docx = await readFile(docxPath);
    if (docx.length < 4 || docx.subarray(0, 2).toString("utf8") !== "PK") throw documentError("DOCX 输出校验失败。", 500);
    await mkdir(path.dirname(outputPath), { recursive: true });
    if (request.format === "docx") {
      await copyFile(docxPath, outputPath);
      const outputInfo = await stat(outputPath);
      return {
        path: path.relative(workspace.path, outputPath).split(path.sep).join("/"),
        format: request.format,
        size: outputInfo.size,
        pageCount: 0,
        renderedPages: 0,
        verification: "structural",
      };
    }
    if (!referenceDocx) {
      const rendering = await validateDirectPdf(cjkPdfPath, cjkRenderDirectory, rendererStdout);
      await copyFile(cjkPdfPath, outputPath);
      const outputInfo = await stat(outputPath);
      return {
        path: path.relative(workspace.path, outputPath).split(path.sep).join("/"),
        format: request.format,
        size: outputInfo.size,
        ...rendering,
        verification: "rendered",
      };
    }
    const pdfPath = path.join(temporaryDirectory, "document.pdf");
    const soffice = process.env.DOCUMENT_SOFFICE_PATH || (process.platform === "darwin" ? "/Applications/LibreOffice.app/Contents/MacOS/soffice" : "soffice");
    try {
      await execFileAsync(soffice, ["--headless", `-env:UserInstallation=file://${path.join(temporaryDirectory, "lo-profile")}`, "--convert-to", "pdf:writer_pdf_Export", "--outdir", temporaryDirectory, docxPath], {
        cwd: temporaryDirectory,
        env: { ...process.env, TMPDIR: temporaryDirectory },
        signal,
        maxBuffer: 256 * 1024,
      });
    } catch (error) {
      throwIfDocumentCancelled(signal);
      throw documentError(`PDF 转换失败：${safeProcessMessage(error, "LibreOffice 执行失败。")}`, 500);
    }
    throwIfDocumentCancelled(signal);
    const pdf = await readFile(pdfPath).catch(() => null);
    if (!pdf || pdf.length < 5 || pdf.subarray(0, 5).toString("utf8") !== "%PDF-") throw documentError("PDF 输出校验失败。", 500);
    const rendering = await validateRenderedPdf(pdfPath, temporaryDirectory);
    await copyFile(pdfPath, outputPath);
    const outputInfo = await stat(outputPath);
    return { path: path.relative(workspace.path, outputPath).split(path.sep).join("/"), format: request.format, size: outputInfo.size, ...rendering, verification: "rendered" };
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
}

export function createLocalRuntimeHandler({ dataDirectory, token, mcpManager = createMcpManager() }) {
  const commandManager = createCommandManager({ dataDirectory });
  const localDatabase = createLocalDatabase(dataDirectory);
  const traceStore = createTraceStore(dataDirectory);
  const chatStore = createChatStore(dataDirectory);
  const skillStore = createSkillStore(dataDirectory);
  const workflow = createWorkflowHttp({dataDirectory, skillStore, traceStore, localDatabase, commandManager, findWorkspace: id => findWorkspace(dataDirectory, id), readJsonBody, sendJson});
  const traceQuery = createTraceQuery(traceStore, workflow.store, (id) => findWorkspace(dataDirectory, id)?.path);
  const handle = async function handle(request, response) {
    try {
      if (!token || request.headers.authorization !== `Bearer ${token}`) {
        return sendJson(response, 401, { message: "本机 Runtime 鉴权失败。" });
      }
      const url = new URL(request.url ?? "/", "http://127.0.0.1");
      const segments = url.pathname.split("/").filter(Boolean).map(decodeURIComponent);

      if (await workflow.handle(request, response, url, segments)) return;

      if (request.method === "GET" && url.pathname === "/health") {
        return sendJson(response, 200, { status: "ok", platform: process.platform });
      }
      if (request.method === "GET" && url.pathname === "/workspaces") {
        return sendJson(response, 200, { workspaces: await readWorkspaceRegistry(dataDirectory) });
      }
      if (request.method === "GET" && url.pathname === "/chat/conversations") {
        const workspaceIds = new Set((await readWorkspaceRegistry(dataDirectory)).map((item) => item.id));
        return sendJson(response, 200, {
          conversations: chatStore.list().filter((conversation) => workspaceIds.has(conversation.projectId)),
          migrationRequired: chatStore.migrationRequired(),
        });
      }
      if (request.method === "POST" && url.pathname === "/chat/conversations/import") {
        const payload = await readJsonBody(request, MAX_CONVERSATION_BYTES);
        const workspaceIds = new Set((await readWorkspaceRegistry(dataDirectory)).map((item) => item.id));
        if (!Array.isArray(payload.conversations) || payload.conversations.some((conversation) => !workspaceIds.has(conversation?.projectId))) {
          throw Object.assign(new Error("待迁移的会话包含未绑定项目。"), { status: 400 });
        }
        const result = chatStore.importLegacy(payload.conversations);
        return sendJson(response, 200, {
          ...result,
          conversations: result.conversations.filter((conversation) => workspaceIds.has(conversation.projectId)),
        });
      }
      if (segments[0] === "chat" && segments[1] === "conversations" && segments[2] && segments.length === 3) {
        if (request.method === "PUT") {
          const payload = await readJsonBody(request, MAX_CONVERSATION_BYTES);
          await findWorkspace(dataDirectory, payload.projectId);
          return sendJson(
            response,
            200,
            { conversation: chatStore.put(payload, segments[2]) },
          );
        }
        if (request.method === "DELETE") {
          return sendJson(response, 200, chatStore.remove(segments[2]));
        }
      }
      if (request.method === "GET" && url.pathname === "/mcp/servers") {
        return sendJson(response, 200, {
          servers: await mcpManager.listServers({ connect: url.searchParams.get("connect") !== "0" }),
        });
      }
      if (request.method === "GET" && url.pathname === "/models") {
        return sendJson(response, 200, {
          providers: await listPublicModelProviders(dataDirectory),
        });
      }
      if (request.method === "POST" && url.pathname === "/trace-ingest/runs") {
        return sendJson(response, 201, traceStore.createRun(await readJsonBody(request)));
      }
      if (segments[0] === "trace-ingest" && segments[1] === "runs" && segments[2] && segments.length === 4 && segments[3] === "events" && request.method === "POST") {
        return sendJson(response, 202, traceStore.appendBatch(segments[2], await readJsonBody(request)));
      }
      if (segments[0] === "trace-ingest" && segments[1] === "runs" && segments[2] && segments.length === 4 && segments[3] === "abort") {
        if (request.method === "POST") return sendJson(response, 202, traceStore.requestAbort(segments[2]));
        if (request.method === "GET") return sendJson(response, 200, { aborted: traceStore.isAbortRequested(segments[2]) });
      }
      if (segments[0] === "trace-ingest" && segments[1] === "runs" && segments[2] && segments.length === 3 && request.method === "PUT") {
        return sendJson(response, 200, traceStore.finishRun(segments[2], await readJsonBody(request)));
      }
      if (request.method === "GET" && segments[0] === "traces" && ["sessions", "invocations", "context"].includes(segments[1])) {
        return sendJson(response, 200, traceQuery.query(segments.slice(1), Object.fromEntries(url.searchParams)));
      }
      if (request.method === "GET" && url.pathname === "/traces") {
        const numeric = (name) => {
          const raw = url.searchParams.get(name);
          if (!raw) return undefined;
          const value = Number(raw);
          if (!Number.isSafeInteger(value)) throw Object.assign(new Error(`Trace ${name} 参数无效。`), { status: 400 });
          return value;
        };
        return sendJson(response, 200, traceStore.listTraces({
          workspaceId: url.searchParams.get("workspaceId") ?? undefined,
          conversationId: url.searchParams.get("conversationId") ?? undefined,
          status: url.searchParams.get("status") ?? undefined,
          query: url.searchParams.get("query") ?? undefined,
          cursor: url.searchParams.get("cursor") ?? undefined,
          from: numeric("from"),
          to: numeric("to"),
          limit: numeric("limit"),
        }));
      }
      if (request.method === "GET" && url.pathname === "/usage/activity") {
        const numeric = (name) => {
          const raw = url.searchParams.get(name);
          if (!raw) return undefined;
          const value = Number(raw);
          if (!Number.isSafeInteger(value)) throw Object.assign(new Error(`用量 ${name} 参数无效。`), { status: 400 });
          return value;
        };
        return sendJson(response, 200, traceStore.getUsageActivity({ from: numeric("from"), to: numeric("to") }));
      }
      if (request.method === "POST" && url.pathname === "/usage/import") {
        return sendJson(response, 200, traceStore.importUsageContributions(await readJsonBody(request)));
      }
      if (segments[0] === "traces" && segments[1] && segments.length === 2) {
        if (request.method === "GET") return sendJson(response, 200, traceStore.getTrace(segments[1]));
        if (request.method === "DELETE") return sendJson(response, 200, traceStore.deleteTrace(segments[1]));
      }
      if (request.method === "DELETE" && url.pathname === "/traces") {
        return sendJson(response, 200, traceStore.clearTraces(url.searchParams.get("workspaceId") ?? ""));
      }
      if (request.method === "GET" && url.pathname === "/database/tables") {
        return sendJson(response, 200, { tables: localDatabase.listTables() });
      }
      if (segments[0] === "database" && segments[1] === "tables" && segments[2] && segments.length === 3 && request.method === "GET") {
        return sendJson(response, 200, localDatabase.describeTable(segments[2]));
      }
      if (request.method === "POST" && url.pathname === "/database/query") {
        const payload = await readJsonBody(request);
        return sendJson(response, 200, localDatabase.query(payload.sql));
      }
      if (request.method === "POST" && url.pathname === "/database/execute") {
        const payload = await readJsonBody(request);
        return sendJson(response, 200, localDatabase.mutate(payload.sql));
      }
      if (request.method === "GET" && url.pathname === "/skills") {
        return sendJson(response, 200, await skillStore.list());
      }
      if (request.method === "POST" && url.pathname === "/skills/import") {
        return sendJson(response, 201, await skillStore.importFolder(await readJsonBody(request, MAX_SKILL_BODY_BYTES)));
      }
      if (segments[0] === "skills" && segments[1] && segments[2] === "files") {
        const skillId = segments[1];
        if (request.method === "GET" && segments[3] === "content" && segments.length === 4) {
          return sendJson(response, 200, await skillStore.readResource(skillId, url.searchParams.get("path") ?? ""));
        }
        if (request.method === "PUT" && segments.length === 3) {
          return sendJson(response, 200, await skillStore.writeResource(skillId, await readJsonBody(request, MAX_SKILL_BODY_BYTES)));
        }
        if (request.method === "DELETE" && segments.length === 3) {
          return sendJson(response, 200, await skillStore.removeResource(skillId, url.searchParams.get("path") ?? ""));
        }
      }
      if (segments[0] === "skills" && segments[1] && segments[2] === "export" && segments.length === 3 && request.method === "GET") {
        const archive = await skillStore.exportZip(segments[1]);
        response.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": archive.length,
          "Content-Disposition": "attachment; filename=skill.zip",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        });
        response.end(archive);
        return;
      }
      if (segments[0] === "skills" && segments[1] && segments[2] === "scripts" && segments[3] === "run" && segments.length === 4 && request.method === "POST") {
        const payload = await readJsonBody(request);
        const workspace = await findWorkspace(dataDirectory, payload.workspaceId);
        const script = await skillStore.resolveScript(segments[1], payload.path);
        const args = Array.isArray(payload.args) && payload.args.every((value) => typeof value === "string" && value.length <= 1_000)
          ? payload.args
          : null;
        if (!args || args.length > 20) throw Object.assign(new Error("Skill 脚本参数无效。"), { status: 400 });
        const command = [script.interpreter, script.scriptPath, ...args].map(shellQuote).join(" ");
        return sendJson(response, payload.approvalMode === "ask" ? 202 : 201, commandManager.create(workspace, {
          command,
          approvalMode: payload.approvalMode,
          permissionMode: payload.permissionMode,
          timeoutMs: payload.timeoutMs,
        }, { extraReadableRoots: [script.readableRoot, script.interpreterReadableRoot].filter(Boolean) }));
      }
      if (segments[0] === "skills" && segments[1] && segments.length === 2) {
        if (request.method === "POST") {
          return sendJson(response, 200, await skillStore.update(segments[1], await readJsonBody(request)));
        }
        if (request.method === "DELETE") {
          return sendJson(response, 200, await skillStore.remove(segments[1]));
        }
      }
      if (segments[0] === "models" && segments[1]) {
        const providerId = segments[1];
        if (request.method === "POST" && segments.length === 2) {
          return sendJson(
            response,
            200,
            await saveModelProvider(dataDirectory, providerId, await readJsonBody(request)),
          );
        }
        if (request.method === "DELETE" && segments.length === 2) {
          return sendJson(response, 200, await deleteModelProvider(dataDirectory, providerId));
        }
        if (request.method === "GET" && segments[2] === "resolve" && segments.length === 3) {
          return sendJson(
            response,
            200,
            await resolveConfiguredModel(
              dataDirectory,
              providerId,
              url.searchParams.get("modelId") ?? "",
              process.env,
              { allowUnverified: url.searchParams.get("forTest") === "1" },
            ),
          );
        }
        if (request.method === "POST" && segments[2] === "verification" && segments.length === 3) {
          return sendJson(
            response,
            200,
            await updateModelVerification(dataDirectory, providerId, await readJsonBody(request)),
          );
        }
      }
      if (
        request.method === "POST" &&
        segments[0] === "mcp" &&
        segments[1] === "servers" &&
        segments[2] &&
        segments[3] === "tools" &&
        segments[4] &&
        segments[5] === "call" &&
        segments.length === 6
      ) {
        const payload = await readJsonBody(request);
        return sendJson(
          response,
          200,
          await mcpManager.callTool(segments[2], segments[4], payload.arguments),
        );
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
          chatStore.removeWorkspace(workspace.id);
          return sendJson(response, 200, { removed: workspace.id });
        }
        if (request.method === "GET" && segments[2] === "files" && segments.length === 3) {
          return sendJson(response, 200, {
            ...(url.searchParams.has("depth")
              ? await listWorkspaceFiles(workspace.path, url.searchParams.get("depth"))
              : url.searchParams.has("path")
              ? await listWorkspaceDirectory(workspace.path, url.searchParams.get("path") ?? "")
              : await listWorkspaceDirectory(workspace.path)),
            workspaceId: workspace.id,
          });
        }
        if (
          request.method === "GET" &&
          segments[2] === "files" &&
          segments[3] === "content" &&
          segments.length === 4
        ) {
          const filePath = url.searchParams.get("path") ?? "";
          return sendJson(response, 200, await readWorkspaceFile(workspace.path, filePath));
        }
        if (
          request.method === "GET" &&
          segments[2] === "files" &&
          segments[3] === "asset" &&
          segments.length === 4
        ) {
          const filePath = url.searchParams.get("path") ?? "";
          return await sendWorkspaceAsset(
            response,
            workspace.path,
            filePath,
            url.searchParams.get("download") === "1",
          );
        }
        if (request.method === "POST" && segments[2] === "files" && segments[3] === "write") {
          const payload = await readJsonBody(request);
          return sendJson(
            response,
            201,
            await writeWorkspaceFile(workspace.path, payload.path, payload.content),
          );
        }
        if (
          request.method === "POST" &&
          segments[2] === "documents" &&
          segments[3] === "generate" &&
          segments.length === 4
        ) {
          const cancellation = new AbortController();
          const cancelDocument = () => cancellation.abort();
          request.once("aborted", cancelDocument);
          try {
            const payload = await readJsonBody(request);
            return sendJson(response, 201, await generateDocumentArtifact(workspace, dataDirectory, payload, cancellation.signal));
          } finally {
            request.off("aborted", cancelDocument);
          }
        }
        if (request.method === "POST" && segments[2] === "commands" && segments.length === 3) {
          const payload = await readJsonBody(request);
          const command = commandManager.create(workspace, payload);
          return sendJson(response, command.status === "pending_approval" ? 202 : 201, command);
        }
        if (segments[2] === "commands" && segments[3]) {
          if (request.method === "GET" && segments.length === 4) {
            return sendJson(response, 200, commandManager.get(workspace.id, segments[3]));
          }
          if (request.method === "POST" && segments[4] === "decision" && segments.length === 5) {
            const payload = await readJsonBody(request);
            return sendJson(
              response,
              200,
              commandManager.decide(workspace.id, segments[3], payload.decision),
            );
          }
          if (request.method === "DELETE" && segments.length === 4) {
            return sendJson(response, 200, commandManager.cancel(workspace.id, segments[3]));
          }
        }
      }

      return sendJson(response, 404, { message: "本机 Runtime 路由不存在。" });
    } catch (error) {
      if (response.headersSent) {
        response.destroy(error instanceof Error ? error : undefined);
        return;
      }
      const status = Number(error?.status) || (error instanceof SyntaxError ? 400 : 500);
      const message =
        error?.code === "ENOENT"
          ? "文件或目录不存在。"
          : error?.message || "本机 Runtime 发生未知错误。";
      return sendJson(response, status, { message });
    }
  };
  handle.close = async () => { await workflow.close(); chatStore.close(); traceStore.close(); localDatabase.close(); };
  return handle;
}

async function start() {
  const port = Number(process.env.LOCAL_RUNTIME_PORT) || DEFAULT_PORT;
  const token = process.env.LOCAL_RUNTIME_TOKEN;
  const dataDirectory = process.env.PI_LOCAL_DATA_DIR ?? path.join(process.cwd(), ".local-data");
  if (!token) throw new Error("缺少 LOCAL_RUNTIME_TOKEN，必须通过 npm run dev 启动。");
  const mcpManager = createMcpManager();
  const handler = createLocalRuntimeHandler({ dataDirectory, token, mcpManager });
  const server = createServer(handler);
  server.listen(port, "127.0.0.1", () => {
    console.log(`Local Agent Runtime ready on http://127.0.0.1:${port}`);
  });
  let stopping = false;
  const stop = async () => {
    if (stopping) return;
    stopping = true;
    await handler.close();
    await mcpManager.close();
    server.close(() => {
      process.exitCode = 0;
    });
  };
  process.on("SIGINT", () => void stop());
  process.on("SIGTERM", () => void stop());
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  start().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
