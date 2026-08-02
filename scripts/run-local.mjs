import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mode = process.argv[2] === "start" ? "start" : "dev";
const token = randomBytes(32).toString("hex");
const requestedPort = Number(process.env.LOCAL_RUNTIME_PORT) || 4318;

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

const runtime = spawn(process.execPath, [path.join(root, "server/local-runtime.mjs")], {
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
  process.exitCode = exitCode;
}

runtime.on("exit", (code, signal) => {
  if (!stopping) {
    console.error(`Local Agent Runtime stopped unexpectedly (${signal ?? code}).`);
    stop(code || 1);
  }
});
vinext.on("exit", (code) => stop(code || 0));
process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));
