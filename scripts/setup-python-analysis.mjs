import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDirectory = process.env.PI_LOCAL_DATA_DIR
  ? path.resolve(process.env.PI_LOCAL_DATA_DIR)
  : path.join(root, ".local-data");
const environmentDirectory = path.join(dataDirectory, "python-analysis-venv");
const python = path.join(environmentDirectory, "bin", "python");
const readyMarker = path.join(dataDirectory, "python-analysis-ready-v1");
const packages = [
  "numpy==2.5.1",
  "pandas==3.0.5",
  "matplotlib==3.11.2",
  "openpyxl==3.1.5",
];
const marker = `python=3.12\npackages-sha256=${createHash("sha256").update(packages.join("\n")).digest("hex")}\n`;

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

await mkdir(dataDirectory, { recursive: true, mode: 0o700 });
const currentMarker = await readFile(readyMarker, "utf8").catch(() => "");
if (existsSync(python) && currentMarker === marker) {
  console.log(`检测到可用 Python 分析环境：${python}`);
} else {
  if (!existsSync(python)) {
    await run("uv", ["venv", "--python", "3.12", environmentDirectory]);
  }
  await run("uv", ["pip", "install", "--python", python, ...packages]);
  await writeFile(readyMarker, marker, { mode: 0o600 });
  console.log(`Python 分析环境安装完成：${python}`);
}
