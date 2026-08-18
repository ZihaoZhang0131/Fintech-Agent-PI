import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { chmod, mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const version = "3.9.0.2";
const platform = process.platform;
const architecture = process.arch;
const assets = {
  "darwin-arm64": {
    file: `pandoc-${version}-arm64-macOS.zip`,
    sha256: "6e9eca844076bcbb599bbeebbba78a70f93b5307782b85c2c272872812c88875",
    binary: `pandoc-${version}-arm64/bin/pandoc`,
  },
  "darwin-x64": {
    file: `pandoc-${version}-x86_64-macOS.zip`,
    sha256: "b9fbceabccbc8f34ac021a50483fc32f8160568d0b4b2c22d81bb29e3054fd82",
    binary: `pandoc-${version}-x86_64/bin/pandoc`,
  },
};
const asset = assets[`${platform}-${architecture}`];
const dataDirectory = process.env.PI_LOCAL_DATA_DIR
  ? path.resolve(process.env.PI_LOCAL_DATA_DIR)
  : path.join(root, ".local-data");
const destination = path.join(dataDirectory, "pandoc", "bin", "pandoc");
const documentEnvironment = path.join(dataDirectory, "documents-venv");
const documentPython = path.join(documentEnvironment, "bin", "python");
const downloadTimeoutSeconds = 300;
const documentPackages = ["python-docx==1.2.0", "reportlab==4.4.9", "Pillow==12.3.0", "pypdfium2==5.12.1"];
const documentReadyMarker = path.join(dataDirectory, "documents-ready-v2");

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: "inherit", ...options });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} 执行失败（${signal ?? code}）。`));
    });
  });
}

if (!asset) {
  throw new Error(`当前平台 ${platform}-${architecture} 暂不支持受管 Pandoc 安装。`);
}

if (existsSync(destination)) {
  console.log(`已安装 Pandoc ${version}：${destination}`);
} else {
  const temporaryRoot = await (async () => {
    const temporary = path.join(tmpdir(), `pi-pandoc-${process.pid}-${Date.now()}`);
    await mkdir(temporary, { recursive: true, mode: 0o700 });
    return temporary;
  })();
  try {
    const archive = path.join(temporaryRoot, asset.file);
    try {
      await run("/usr/bin/curl", [
        "--fail", "--location", "--retry", "2", "--connect-timeout", "15",
        "--max-time", String(downloadTimeoutSeconds), "--output", archive,
        `https://github.com/jgm/pandoc/releases/download/${version}/${asset.file}`,
      ]);
    } catch (error) {
      throw new Error(`Pandoc 下载失败或超时（最多 ${downloadTimeoutSeconds} 秒），文件未安装：${error instanceof Error ? error.message : error}`);
    }
    const bytes = await readFile(archive);
    const digest = createHash("sha256").update(bytes).digest("hex");
    if (digest !== asset.sha256) throw new Error("Pandoc 下载校验失败，文件未安装。");
    await run("/usr/bin/unzip", ["-q", archive, "-d", temporaryRoot]);
    const extracted = path.join(temporaryRoot, asset.binary);
    if (!(await stat(extracted)).isFile()) throw new Error("Pandoc 压缩包结构不符合预期。");
    await mkdir(path.dirname(destination), { recursive: true, mode: 0o700 });
    const staged = `${destination}.${process.pid}.tmp`;
    await rename(extracted, staged);
    await chmod(staged, 0o755);
    await rename(staged, destination);
    console.log(`Pandoc ${version} 安装完成：${destination}`);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
}

if (!existsSync(documentPython)) {
  await run("uv", ["venv", "--python", "3.12", documentEnvironment]);
}
await run("uv", ["pip", "install", "--python", documentPython, ...documentPackages]);
await writeFile(documentReadyMarker, "pandoc=3.9.0.2\npdf-renderer=pypdfium2-5.12.1\n", { mode: 0o600 });
console.log(`文档 Python 环境安装完成：${documentPython}`);
