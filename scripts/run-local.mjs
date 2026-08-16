import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mode = process.argv[2] === "start" ? "start" : "dev";
const token = randomBytes(32).toString("hex");
const requestedPort = Number(process.env.LOCAL_RUNTIME_PORT) || 4318;
const defaultAktoolsUrl = "http://127.0.0.1:8080";
const aktoolsUrl = (process.env.AKTOOLS_BASE_URL || defaultAktoolsUrl).replace(/\/$/, "");
const managedAktoolsPython = path.join(root, ".local-data", "aktools-venv", "bin", "python");

function probePort(port) {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.unref();
    probe.once("error", reject);
    probe.listen({ host: "127.0.0.1", port, exclusive: true }, () => {
      const address = probe.address();
      const availablePort = typeof address === "object" && address ? address.port : port;
      probe.close((error) => (error ? reject(error) : resolve(availablePort)));
    });
  });
}

async function chooseRuntimePort(preferredPort) {
  try {
    return await probePort(preferredPort);
  } catch (error) {
    if (error?.code !== "EADDRINUSE") throw error;
    return probePort(0);
  }
}

async function isAktoolsAvailable(baseUrl) {
  try {
    const response = await fetch(`${baseUrl}/version`, { signal: AbortSignal.timeout(1_000) });
    if (!response.ok) return false;
    const version = await response.json();
    return typeof version === "object" && version !== null && (
      typeof version.ak_current_version === "string" || typeof version.at_current_version === "string"
    );
  } catch {
    return false;
  }
}

function usesManagedAktoolsUrl(baseUrl) {
  try {
    const url = new URL(baseUrl);
    return url.protocol === "http:" && url.hostname === "127.0.0.1" && url.port === "8080";
  } catch {
    return false;
  }
}

async function waitForAktools(child) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (await isAktoolsAvailable(aktoolsUrl)) return;
    if (child.exitCode !== null || child.signalCode !== null) break;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  stopAktools(child);
  throw new Error(`AKTools 未能在 ${aktoolsUrl} 启动。请运行 npm run aktools:setup 后重试。`);
}

function stopAktools(child) {
  if (!child?.pid) return;
  try {
    process.kill(-child.pid, "SIGTERM");
  } catch (error) {
    if (error?.code !== "ESRCH") child.kill("SIGTERM");
  }
}

async function startAktools() {
  if (!usesManagedAktoolsUrl(aktoolsUrl)) {
    console.log(`使用外部 AKTools 服务：${aktoolsUrl}`);
    return null;
  }
  if (await isAktoolsAvailable(aktoolsUrl)) {
    console.log(`检测到已运行的 AKTools 服务：${aktoolsUrl}`);
    return null;
  }
  if (!existsSync(managedAktoolsPython)) {
    throw new Error("未安装 AKTools。请先运行 npm run aktools:setup，再重新启动项目。");
  }
  console.log(`启动 AKTools HTTP 数据服务：${aktoolsUrl}`);
  const child = spawn(managedAktoolsPython, ["-m", "aktools", "--host", "127.0.0.1", "--port", "8080"], {
    cwd: root,
    env: process.env,
    detached: true,
    stdio: "inherit",
  });
  await waitForAktools(child);
  return child;
}

const availablePort = await chooseRuntimePort(requestedPort);
const port = String(availablePort);
if (availablePort !== requestedPort) {
  console.log(`Local Runtime port ${requestedPort} is in use; using ${availablePort} instead.`);
}
const environment = {
  ...process.env,
  LOCAL_RUNTIME_PORT: port,
  LOCAL_RUNTIME_TOKEN: token,
  LOCAL_RUNTIME_URL: `http://127.0.0.1:${port}`,
};

let aktools;
try {
  aktools = await startAktools();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
  process.exit();
}

const runtimeArguments = mode === "dev"
  ? [
      "--watch",
      `--watch-path=${path.join(root, "server")}`,
      `--watch-path=${path.join(root, ".agents", "skills")}`,
      path.join(root, "server/local-runtime.mjs"),
    ]
  : [path.join(root, "server/local-runtime.mjs")];
const runtime = spawn(process.execPath, runtimeArguments, {
  cwd: root,
  env: environment,
  stdio: "inherit",
});
const vinext = spawn(path.join(root, "node_modules/.bin/vinext"), [mode], {
  cwd: root,
  env: environment,
  stdio: "inherit",
});

let stopping = false;
function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  runtime.kill("SIGTERM");
  vinext.kill("SIGTERM");
  stopAktools(aktools);
  process.exitCode = exitCode;
}

runtime.on("exit", (code, signal) => {
  if (!stopping) {
    console.error(`Local Agent Runtime stopped unexpectedly (${signal ?? code}).`);
    stop(code || 1);
  }
});
aktools?.on("exit", (code, signal) => {
  if (!stopping) {
    console.error(`AKTools HTTP 数据服务意外停止（${signal ?? code}）。`);
    stop(code || 1);
  }
});
vinext.on("exit", (code) => stop(code || 0));
process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));
