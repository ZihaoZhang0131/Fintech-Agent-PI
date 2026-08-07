import { createServer } from "node:http";
import { execFile, spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, readFile, readdir, realpath, rename, stat, writeFile } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import { promisify } from "node:util";
import { pathToFileURL } from "node:url";
import { createMcpManager } from "./mcp-manager.mjs";

const execFileAsync = promisify(execFile);
const DEFAULT_PORT = 4318;
const MAX_BODY_BYTES = 2 * 1024 * 1024;
const MAX_TEXT_PREVIEW_BYTES = 1 * 1024 * 1024;
const MAX_ASSET_PREVIEW_BYTES = 20 * 1024 * 1024;
const MAX_FILE_ENTRIES = 800;
const MAX_COMMAND_BYTES = 20_000;
const MAX_COMMAND_OUTPUT_BYTES = 200 * 1024;
const DEFAULT_COMMAND_TIMEOUT_MS = 60_000;
const MAX_COMMAND_TIMEOUT_MS = 120_000;
const COMMAND_JOB_TTL_MS = 10 * 60_000;
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

function createSandboxProfile(workspaceRoot, commandHome, commandTemporaryDirectory) {
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
          createSandboxProfile(canonicalRoot, commandHome, commandTemporaryDirectory),
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

  function create(workspace, payload) {
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

export function createLocalRuntimeHandler({ dataDirectory, token, mcpManager = createMcpManager() }) {
  const commandManager = createCommandManager({ dataDirectory });
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
      if (request.method === "GET" && url.pathname === "/mcp/servers") {
        return sendJson(response, 200, {
          servers: await mcpManager.listServers({ connect: url.searchParams.get("connect") !== "0" }),
        });
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
          return sendJson(response, 200, { removed: workspace.id });
        }
        if (request.method === "GET" && segments[2] === "files" && segments.length === 3) {
          return sendJson(response, 200, {
            ...(await listWorkspaceFiles(workspace.path, url.searchParams.get("depth"))),
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
}

async function start() {
  const port = Number(process.env.LOCAL_RUNTIME_PORT) || DEFAULT_PORT;
  const token = process.env.LOCAL_RUNTIME_TOKEN;
  const dataDirectory = process.env.PI_LOCAL_DATA_DIR ?? path.join(process.cwd(), ".local-data");
  if (!token) throw new Error("缺少 LOCAL_RUNTIME_TOKEN，必须通过 npm run dev 启动。");
  const mcpManager = createMcpManager();
  const server = createServer(createLocalRuntimeHandler({ dataDirectory, token, mcpManager }));
  server.listen(port, "127.0.0.1", () => {
    console.log(`Local Agent Runtime ready on http://127.0.0.1:${port}`);
  });
  let stopping = false;
  const stop = async () => {
    if (stopping) return;
    stopping = true;
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
