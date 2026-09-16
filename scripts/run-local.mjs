import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";
import { DEFAULT_AKTOOLS_URL, startAktools, stopAktools } from "./aktools-service.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mode = process.argv[2] === "start" ? "start" : "dev";
const token = randomBytes(32).toString("hex");
const requestedPort = Number(process.env.LOCAL_RUNTIME_PORT) || 4318;
const requestedAktoolsUrl = process.env.AKTOOLS_BASE_URL || DEFAULT_AKTOOLS_URL;
const localDataDirectory = process.env.PI_LOCAL_DATA_DIR
  ? path.resolve(process.env.PI_LOCAL_DATA_DIR)
  : path.join(root, ".local-data");
const managedAktoolsPython = path.join(localDataDirectory, "aktools-venv", "bin", "python");
const managedPandoc = path.join(localDataDirectory, "pandoc", "bin", "pandoc");
const managedDocumentPython = path.join(localDataDirectory, "documents-venv", "bin", "python");
const documentReadyMarker = path.join(localDataDirectory, "documents-ready-v3");
const managedAnalysisPython = path.join(localDataDirectory, "python-analysis-venv", "bin", "python");
const analysisReadyMarker = path.join(localDataDirectory, "python-analysis-ready-v1");

function readOptionalEnvironmentFile(filePath) {
  if (!existsSync(filePath)) return {};
  return parseEnv(readFileSync(filePath, "utf8"));
}

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

async function waitForRuntime(url, authorizationToken, signal, timeoutMs = 10_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    signal.throwIfAborted();
    try {
      const response = await fetch(`${url}/health`, {
        headers: { Authorization: `Bearer ${authorizationToken}` },
        signal,
      });
      if (response.ok) return;
      lastError = new Error(`Local Runtime health check returned ${response.status}.`);
    } catch (error) {
      if (signal.aborted) throw error;
      lastError = error;
    }
    await new Promise((resolve, reject) => {
      const onAbort = () => {
        clearTimeout(timer);
        reject(signal.reason ?? new Error("启动已取消。"));
      };
      const timer = setTimeout(() => {
        signal.removeEventListener("abort", onAbort);
        resolve();
      }, 100);
      signal.addEventListener("abort", onAbort, { once: true });
    });
  }
  throw new Error(`Local Agent Runtime 在 ${timeoutMs}ms 内未就绪：${lastError instanceof Error ? lastError.message : "未知错误"}`);
}

function startPandocProvisioning() {
  if (existsSync(managedPandoc) && existsSync(managedDocumentPython) && existsSync(documentReadyMarker)) {
    console.log(`检测到可用文档组件：${managedPandoc}`);
    return null;
  }
  console.log("正在后台初始化文档组件（Pandoc 与受管 Python）；PDF/Word 工具准备完成前会自动等待。");
  const child = spawn(process.execPath, [path.join(root, "scripts", "setup-pandoc.mjs")], {
    cwd: root,
    env: process.env,
    stdio: "inherit",
  });
  child.on("error", (error) => console.error(`文档组件初始化失败：${error.message}`));
  child.on("exit", (code, signal) => {
    if (code !== 0) {
      console.error(`文档组件初始化未完成（${signal ?? code}）。应用仍可使用，稍后重新启动会自动重试。`);
    }
  });
  return child;
}

function startPythonAnalysisProvisioning() {
  console.log(
    existsSync(managedAnalysisPython) && existsSync(analysisReadyMarker)
      ? "正在后台校验 Python 分析环境。"
      : "正在后台初始化 Python 分析环境；其他功能可继续使用。",
  );
  const child = spawn(process.execPath, [path.join(root, "scripts", "setup-python-analysis.mjs")], {
    cwd: root,
    env: process.env,
    stdio: "inherit",
  });
  child.on("error", (error) => console.error(`Python 分析环境初始化失败：${error.message}`));
  child.on("exit", (code, signal) => {
    if (code !== 0) {
      console.error(`Python 分析环境初始化未完成（${signal ?? code}）。应用仍可使用，稍后重新启动会自动重试。`);
    }
  });
  return child;
}

const startup = new AbortController();
let aktools;
let pandocProvisioner;
let pythonAnalysisProvisioner;
let runtime;
let vinext;
let stopping = false;
let stopPromise;

function stop(exitCode = 0) {
  if (stopping) return stopPromise;
  stopping = true;
  startup.abort();
  process.exitCode = exitCode;
  runtime?.kill("SIGTERM");
  vinext?.kill("SIGTERM");
  pandocProvisioner?.kill("SIGTERM");
  pythonAnalysisProvisioner?.kill("SIGTERM");
  stopPromise = stopAktools(aktools);
  return stopPromise;
}

function watchChild(child, label) {
  child.on("error", (error) => {
    if (!stopping) {
      console.error(`${label} 启动失败：${error.message}`);
      void stop(1);
    }
  });
  child.on("exit", (code, signal) => {
    if (!stopping) {
      console.error(`${label} 已退出（${signal ?? code}）。`);
      void stop(code || (signal ? 1 : 0));
    }
  });
  if (child.exitCode !== null || child.signalCode !== null) {
    throw new Error(`${label} 在启动期间已退出。`);
  }
}

process.on("SIGINT", () => void stop(0));
process.on("SIGTERM", () => void stop(0));

try {
  const availablePort = await chooseRuntimePort(requestedPort);
  if (availablePort !== requestedPort) {
    console.log(`Local Runtime port ${requestedPort} is in use; using ${availablePort} instead.`);
  }
  const service = await startAktools({
    python: managedAktoolsPython, cwd: root, baseUrl: requestedAktoolsUrl, signal: startup.signal,
  });
  aktools = service.child;
  startup.signal.throwIfAborted();
  if (aktools) watchChild(aktools, "AKTools HTTP 数据服务");
  const environment = {
    // Match the app's local-file precedence without making Node --watch watch
    // the environment files. Shell-provided values still take precedence.
    ...readOptionalEnvironmentFile(path.join(root, ".env")),
    ...readOptionalEnvironmentFile(path.join(root, ".env.local")),
    ...process.env,
    AKTOOLS_BASE_URL: service.baseUrl,
    LOCAL_RUNTIME_PORT: String(availablePort),
    LOCAL_RUNTIME_TOKEN: token,
    LOCAL_RUNTIME_URL: `http://127.0.0.1:${availablePort}`,
    PI_STRICT_APP_PORT: "1",
  };
  pandocProvisioner = startPandocProvisioning();
  pythonAnalysisProvisioner = startPythonAnalysisProvisioning();
  const runtimeArguments = mode === "dev"
    ? [
        "--experimental-strip-types",
        "--watch",
        `--watch-path=${path.join(root, "server")}`,
        `--watch-path=${path.join(root, ".agents", "skills")}`,
        path.join(root, "server/local-runtime.mjs"),
      ]
    : ["--experimental-strip-types", path.join(root, "server/local-runtime.mjs")];
  runtime = spawn(process.execPath, runtimeArguments, { cwd: root, env: environment, stdio: "inherit" });
  watchChild(runtime, "Local Agent Runtime");
  await waitForRuntime(environment.LOCAL_RUNTIME_URL, token, startup.signal);
  vinext = spawn(
    path.join(root, "node_modules/.bin/vinext"),
    [mode, "--hostname", "localhost", "--port", "3000"],
    { cwd: root, env: environment, stdio: "inherit" },
  );
  watchChild(vinext, "网页服务");
} catch (error) {
  if (!stopping) console.error(error instanceof Error ? error.message : error);
  await stop(stopping ? process.exitCode : 1);
  // A signal may have arrived while startAktools was still returning ownership.
  await stopAktools(aktools);
}
