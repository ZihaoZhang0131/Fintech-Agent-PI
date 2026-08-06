import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const project = path.join(root, "mcp/akshare-one");

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} 执行失败（${signal ?? code}）。`));
    });
  });
}

try {
  await run("uv", ["python", "install", "3.12"]);
  await run("uv", ["sync", "--project", project, "--locked", "--python", "3.12"]);
  console.log("AKShare One MCP 安装完成。重新执行 npm run dev 后即可连接。");
} catch (error) {
  if (error?.code === "ENOENT") {
    console.error("未找到 uv。请先安装 uv：https://docs.astral.sh/uv/getting-started/installation/");
  } else {
    console.error(error instanceof Error ? error.message : error);
  }
  process.exitCode = 1;
}
