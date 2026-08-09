import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const environmentDirectory = path.join(root, ".local-data", "aktools-venv");
const python = path.join(environmentDirectory, "bin", "python");

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
  if (!existsSync(python)) {
    await run("uv", ["venv", "--python", "3.12", environmentDirectory]);
  }
  await run("uv", ["pip", "install", "--python", python, "aktools==0.0.91"]);
  console.log("AKTools HTTP 数据服务安装完成。之后 npm run dev 会自动启动并在项目退出时停止它。");
} catch (error) {
  if (error?.code === "ENOENT") {
    console.error("未找到 uv。请先安装 uv：https://docs.astral.sh/uv/getting-started/installation/");
  } else {
    console.error(error instanceof Error ? error.message : error);
  }
  process.exitCode = 1;
}
