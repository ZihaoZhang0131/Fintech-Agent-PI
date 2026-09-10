import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDirectory = process.env.PI_LOCAL_DATA_DIR ? path.resolve(process.env.PI_LOCAL_DATA_DIR) : path.join(root, ".local-data");
const documentEnvironment = path.join(dataDirectory, "documents-venv");
const documentPython = path.join(documentEnvironment, "bin", "python");
const runtimeDirectory = path.join(dataDirectory, "kami-runtime");
const skillScripts = path.join(root, ".agents", "skills", "kami", "scripts");
const mathjaxSource = path.join(skillScripts, "mathjax-runtime");
const mathjaxPackage = JSON.parse(await readFile(path.join(mathjaxSource, "package.json"), "utf8"));
const mathjaxVersion = mathjaxPackage.dependencies["@mathjax/src"];
const mathjaxDestination = path.join(runtimeDirectory, "mathjax", mathjaxVersion);
const packages = ["weasyprint==70.0", "pypdf==6.18.0", "pymupdf==1.28.2", "Pygments==2.21.0"];
const marker = path.join(dataDirectory, "kami-ready-v1");

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: "inherit", ...options });
    child.once("error", reject);
    child.once("exit", (code, signal) => code === 0 ? resolve() : reject(new Error(`${command} 执行失败（${signal ?? code}）。`)));
  });
}

if (process.platform === "darwin") {
  try {
    await run("brew", ["list", "--versions", "pango"]);
  } catch {
    console.log("正在安装 WeasyPrint 必需的 Homebrew Pango…");
    await run("brew", ["install", "pango"]);
  }
}

if (!existsSync(documentPython)) await run("uv", ["venv", "--python", "3.12", documentEnvironment]);
await run("uv", ["pip", "install", "--python", documentPython, ...packages]);

if (!existsSync(mathjaxDestination)) {
  const parent = path.dirname(mathjaxDestination);
  const staging = path.join(parent, `.install-${mathjaxVersion}-${process.pid}`);
  await mkdir(staging, { recursive: true, mode: 0o700 });
  try {
    await writeFile(path.join(staging, "package.json"), await readFile(path.join(mathjaxSource, "package.json")), { mode: 0o600 });
    await writeFile(path.join(staging, "package-lock.json"), await readFile(path.join(mathjaxSource, "package-lock.json")), { mode: 0o600 });
    await run("npm", ["ci", "--ignore-scripts", "--no-audit", "--no-fund"], { cwd: staging, env: { ...process.env, NODE_OPTIONS: "" } });
    await mkdir(parent, { recursive: true, mode: 0o700 });
    await rename(staging, mathjaxDestination);
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
}

await run("node", [path.join(skillScripts, "mathjax_svg.js"), "--probe"], { env: { ...process.env, KAMI_RUNTIME_DIR: runtimeDirectory } });
const pythonEnvironment = process.platform === "darwin"
  ? { ...process.env, DYLD_FALLBACK_LIBRARY_PATH: ["/opt/homebrew/lib", "/usr/local/lib", process.env.DYLD_FALLBACK_LIBRARY_PATH].filter(Boolean).join(":"), XDG_CACHE_HOME: path.join(runtimeDirectory, "font-cache") }
  : process.env;
await run(documentPython, ["-c", "import weasyprint, pypdf, fitz, pygments; print('Kami Python runtime OK')"], { env: pythonEnvironment });
await mkdir(dataDirectory, { recursive: true, mode: 0o700 });
await writeFile(marker, `kami=1.15.0\ncommit=4dab24cc4c527dbb35aa8fae09e02822992dfbe2\nmathjax=${mathjaxVersion}\n`, { mode: 0o600 });
console.log(`Kami Runtime 安装完成：${runtimeDirectory}`);
