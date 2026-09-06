import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { createServer } from "node:net";
import { setTimeout as delay } from "node:timers/promises";

export const DEFAULT_AKTOOLS_URL = "http://127.0.0.1:8080";

export async function inspectAktools(baseUrl, { timeoutMs = 3_000, signal, fetchImpl = fetch } = {}) {
  try {
    const response = await fetchImpl(`${baseUrl}/version`, {
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(timeoutMs)]) : AbortSignal.timeout(timeoutMs),
    });
    if (!response.ok) return { available: false, errorKind: "http_error", error: `HTTP ${response.status}` };
    let version;
    try {
      version = await response.json();
    } catch (error) {
      if (error.name === "AbortError" || error.name === "TimeoutError") throw error;
      return { available: false, errorKind: "invalid_json", error: "版本端点未返回有效 JSON" };
    }
    if (!version || Array.isArray(version) || !["ak_current_version", "at_current_version"].every(
      (key) => typeof version[key] === "string" && version[key].trim(),
    )) return { available: false, errorKind: "identity_mismatch", error: "版本响应缺少 AKShare/AKTools 版本字段，无法确认服务身份" };
    return { available: true, version };
  } catch (error) {
    signal?.throwIfAborted();
    const timeout = error.name === "TimeoutError" || error.name === "AbortError";
    return { available: false, errorKind: timeout ? "timeout" : "connection_error", error: timeout ? "版本探测超时" : `无法连接服务：${error.cause?.code || error.message}` };
  }
}

export function reserveAvailablePort(port) {
  // AKTools binds its own socket; release the probe before spawning and handle bind races below.
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen({ host: "127.0.0.1", port, exclusive: true }, () => {
      const selected = server.address().port;
      server.close((error) => error ? reject(error) : resolve(selected));
    });
  });
}

function groupExists(pid) {
  try { process.kill(-pid, 0); return true; } catch (error) { return error.code !== "ESRCH"; }
}

export async function stopAktools(child) {
  if (!child?.pid) return;
  try { process.kill(-child.pid, "SIGTERM"); } catch (error) {
    if (error.code !== "ESRCH") throw error;
    return;
  }
  const deadline = Date.now() + 1_000;
  while (groupExists(child.pid) && Date.now() < deadline) await delay(25);
  if (groupExists(child.pid)) {
    try { process.kill(-child.pid, "SIGKILL"); } catch (error) { if (error.code !== "ESRCH") throw error; }
  }
}

function startupError(cause, stderr, baseUrl) {
  if (cause?.code === "ENOENT" || /ModuleNotFoundError: No module named/.test(stderr)) {
    return new Error(`AKTools 解释器或依赖缺失。请运行 npm run aktools:setup。${cause?.message || stderr.trim()}`);
  }
  if (["EACCES", "EPERM"].includes(cause?.code) || /Permission denied|Operation not permitted/.test(stderr)) {
    return new Error(`AKTools 解释器执行权限不足：${cause?.message || stderr.trim()}。请核验解释器路径及执行权限。`);
  }
  return new Error(`AKTools 在 ${baseUrl} 启动失败：${cause?.message || stderr.trim() || "进程提前退出"}`);
}

export async function startAktools({
  python, cwd, baseUrl = DEFAULT_AKTOOLS_URL, environment = process.env, signal,
  log = console.log, warn = console.error,
  startupTimeoutMs = 30_000, pollIntervalMs = 500,
  inspect = inspectAktools, choosePort = reserveAvailablePort, spawnImpl = spawn,
  stopChild = stopAktools,
} = {}) {
  baseUrl = baseUrl.replace(/\/$/, "");
  const url = new URL(baseUrl);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("AKTOOLS_BASE_URL 必须是 HTTP(S) 地址。");
  const managed = baseUrl === DEFAULT_AKTOOLS_URL;
  signal?.throwIfAborted();
  const existing = await inspect(baseUrl, { signal });
  signal?.throwIfAborted();
  if (!managed) {
    log(`使用外部 AKTools 服务：${baseUrl}`);
    if (!existing.available) warn(`外部 AKTools 探测失败（${existing.errorKind}）：${existing.error}；保留配置地址，应用继续启动。`);
    return { baseUrl, child: null };
  }
  if (existing.available) {
    log(`检测到已运行的 AKTools 服务：${baseUrl}`);
    return { baseUrl, child: null };
  }
  let port;
  try { port = await choosePort(8080); } catch (error) {
    if (error.code !== "EADDRINUSE") throw error;
    warn(`8080 已被占用，未确认是 AKTools（${existing.errorKind}：${existing.error}）；自动选择空闲端口。`);
    port = await choosePort(0);
  }
  if (!existsSync(python)) throw new Error("AKTools 解释器缺失。请运行 npm run aktools:setup，再重新启动项目。");
  for (let attempt = 0; attempt < 3; attempt += 1) {
    signal?.throwIfAborted();
    baseUrl = `http://127.0.0.1:${port}`;
    log(`启动 AKTools HTTP 数据服务：${baseUrl}`);
    let child;
    let stderr = "";
    let spawnError;
    let lastProbe;
    try {
      child = spawnImpl(python, ["-m", "aktools", "--host", "127.0.0.1", "--port", String(port)], {
        cwd, env: environment, detached: true, stdio: ["ignore", "pipe", "pipe"],
      });
      child.on("error", (error) => { spawnError = error; });
      child.stdout?.on("data", (chunk) => process.stdout.write(chunk));
      child.stderr?.on("data", (chunk) => {
        stderr = (stderr + chunk).slice(-16_384);
        process.stderr.write(chunk);
      });
      const deadline = Date.now() + startupTimeoutMs;
      while (Date.now() < deadline) {
        signal?.throwIfAborted();
        if (spawnError || child.exitCode !== null || child.signalCode !== null) break;
        lastProbe = await inspect(baseUrl, { signal, timeoutMs: Math.max(1, Math.min(3_000, deadline - Date.now())) });
        signal?.throwIfAborted();
        if (lastProbe.available && !spawnError && child.exitCode === null && child.signalCode === null) {
          log(`AKTools 已就绪：${baseUrl}`);
          return { baseUrl, child };
        }
        await delay(Math.max(1, Math.min(pollIntervalMs, deadline - Date.now())), undefined, { signal });
      }
      const timedOut = !spawnError && child.exitCode === null && child.signalCode === null;
      const bindConflict = spawnError?.code === "EADDRINUSE" || /address already in use|EADDRINUSE|\[Errno (?:48|98)\]/i.test(stderr);
      await stopChild(child);
      child = null;
      if (bindConflict && attempt < 2) {
        warn(`AKTools 端口在启动时被占用，重新选择端口（${attempt + 2}/3）。`);
        port = await choosePort(0);
        continue;
      }
      if (bindConflict) throw new Error("AKTools 连续三次遇到端口冲突，启动停止。请检查本机服务。 ");
      if (timedOut) {
        throw new Error(`AKTools 在 ${baseUrl} 启动超时：${lastProbe?.error || "未返回有效版本响应"}。${stderr.trim()}`);
      }
      if (!spawnError && !stderr.trim()) {
        throw new Error(`AKTools 在 ${baseUrl} 未就绪：${lastProbe?.error || "进程提前退出"}。请检查服务启动输出及响应；不能据此判断依赖未安装。`);
      }
      throw startupError(spawnError, stderr, baseUrl);
    } catch (error) {
      if (child) await stopChild(child);
      throw error;
    }
  }
}
