import { access, stat, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

export async function resolveDocumentOffice(environment = process.env, platform = process.platform) {
  const explicit = environment.DOCUMENT_SOFFICE_PATH;
  const names = platform === "win32" ? ["soffice.exe"] : ["soffice", "libreoffice"];
  const fromPath = (name) => (environment.PATH ?? "").split(path.delimiter).filter(Boolean).map(dir => path.join(dir, name));
  const candidates = explicit
    ? path.isAbsolute(explicit) || explicit.includes(path.sep) ? [path.resolve(explicit)] : fromPath(explicit)
    : [
      ...(platform === "darwin" ? ["/Applications/LibreOffice.app/Contents/MacOS/soffice"] : []),
      ...(platform === "win32" ? [path.join(environment.ProgramFiles ?? "C:\\Program Files", "LibreOffice/program/soffice.exe")] : []),
      ...names.flatMap(fromPath),
    ];
  for (const candidate of candidates) {
    try {
      await access(candidate, constants.X_OK);
      if ((await stat(candidate)).isFile()) return candidate;
    } catch { /* Continue discovery, but never override a broken explicit configuration. */ }
  }
  throw Object.assign(new Error("含图或模板 PDF 需要 LibreOffice，转换组件不可用。请在应用运行环境配置 DOCUMENT_SOFFICE_PATH；仍可选择生成 DOCX。不要通过 Agent Bash 安装或绕过此错误。"), { status: 503 });
}

// Some headless macOS builds don't discover system CJK fonts. Use a job-local
// fontconfig file; never alter the user's Office profile or installed fonts.
export async function documentOfficeEnvironment(directory, environment = process.env, platform = process.platform) {
  if (environment.FONTCONFIG_FILE || (platform !== "darwin" && !environment.DOCUMENT_CJK_FONT_PATH)) return environment;
  const dirs = [
    ...(environment.DOCUMENT_CJK_FONT_PATH ? [path.dirname(environment.DOCUMENT_CJK_FONT_PATH)] : []),
    ...(platform === "darwin" ? ["/System/Library/Fonts/Supplemental", "/System/Library/Fonts", "/Library/Fonts", path.join(environment.HOME ?? "", "Library/Fonts")] : []),
  ];
  const existing = [];
  for (const dir of dirs) if (await stat(dir).then(s => s.isDirectory()).catch(() => false)) existing.push(dir);
  const xml = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  const config = path.join(directory, "fonts.conf");
  await writeFile(config, `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig><include ignore_missing="yes">/etc/fonts/fonts.conf</include>${existing.map(dir => `<dir>${xml(dir)}</dir>`).join("")}<cachedir>${xml(path.join(directory, "font-cache"))}</cachedir></fontconfig>`, { mode: 0o600 });
  return { ...environment, FONTCONFIG_FILE: config };
}
