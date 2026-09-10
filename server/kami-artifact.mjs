import { execFile } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, realpath, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const TEMPLATES = new Set(["one-pager", "long-doc", "letter", "portfolio", "resume", "slides", "equity-report", "changelog", "landing-page"]);
const LANGUAGES = new Set(["zh-CN", "en", "ja", "ko"]);
const MIME_TYPES = new Map([
  [".avif", "image/avif"], [".gif", "image/gif"], [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"], [".png", "image/png"], [".svg", "image/svg+xml"], [".webp", "image/webp"],
]);
const PAGE_LIMITS = new Map([["one-pager", 1], ["letter", 1], ["resume", 2], ["equity-report", 3], ["changelog", 2]]);
const MAX_HTML_BYTES = 1_500_000;
const MAX_CONTENT_BYTES = 1_000_000;
const MAX_ASSET_BYTES = 10 * 1024 * 1024;
const MAX_TOTAL_ASSET_BYTES = 24 * 1024 * 1024;
const MAX_ASSETS = 24;
const CSP = "default-src 'none'; img-src data:; media-src data:; font-src data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none'";

function failure(message, status = 400) {
  return Object.assign(new Error(message), { status });
}

function isInside(root, target) {
  const relative = path.relative(root, target);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function throwIfCancelled(signal) {
  if (signal?.aborted) throw failure("Kami 渲染已取消。", 499);
}

function normalizeFilename(value) {
  if (typeof value !== "string" || !value.trim() || value.length > 120 || /[\\/\0]/.test(value)) throw failure("Kami 文件名无效。");
  const base = value.trim().replace(/\.(?:html|pdf|json)$/i, "").trim();
  if (!base || base === "." || base === "..") throw failure("Kami 文件名无效。");
  return base;
}

export function validateKamiPayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw failure("Kami 请求无效。");
  if (!TEMPLATES.has(payload.template)) throw failure("Kami 模板无效。");
  if (!LANGUAGES.has(payload.language)) throw failure("Kami 语言无效。");
  const expectedFormats = payload.template === "landing-page" ? ["html"] : ["html", "pdf"];
  if (!Array.isArray(payload.formats) || payload.formats.length !== expectedFormats.length || expectedFormats.some((value, index) => payload.formats[index] !== value)) {
    throw failure(payload.template === "landing-page" ? "落地页仅支持 formats: [\"html\"]。" : "正式文档和幻灯片必须使用 formats: [\"html\", \"pdf\"]。");
  }
  if (typeof payload.html !== "string" || !payload.html.trim()) throw failure("Kami HTML 不能为空。");
  if (Buffer.byteLength(payload.html) > MAX_HTML_BYTES) throw failure("Kami HTML 超过 1.5MB 限制。", 413);
  if (!payload.contentIr || typeof payload.contentIr !== "object" || Array.isArray(payload.contentIr)) throw failure("Kami contentIr 必须是对象。");
  const contentBytes = Buffer.byteLength(JSON.stringify(payload.contentIr));
  if (contentBytes > MAX_CONTENT_BYTES) throw failure("Kami contentIr 超过 1MB 限制。", 413);
  const expectedType = payload.template === "slides" ? "slides" : payload.template;
  if (payload.contentIr.type !== expectedType) throw failure(`contentIr.type 必须为 ${expectedType}。`);
  if (payload.contentIr.lang !== payload.language) throw failure("contentIr.lang 必须与 language 一致。");
  if (!payload.contentIr.content || typeof payload.contentIr.content !== "object" || Array.isArray(payload.contentIr.content)) throw failure("contentIr.content 必须是对象。");
  const assets = payload.assets ?? [];
  if (!Array.isArray(assets) || assets.length > MAX_ASSETS) throw failure(`Kami assets 最多 ${MAX_ASSETS} 个。`);
  const ids = new Set();
  for (const asset of assets) {
    if (!asset || typeof asset !== "object" || !/^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(asset.id ?? "") || typeof asset.projectPath !== "string") throw failure("Kami asset 声明无效。");
    if (ids.has(asset.id)) throw failure(`Kami asset id 重复：${asset.id}。`);
    ids.add(asset.id);
  }
  if (payload.overwrite !== undefined && typeof payload.overwrite !== "boolean") throw failure("overwrite 必须是布尔值。");
  return { template: payload.template, language: payload.language, formats: expectedFormats, filename: normalizeFilename(payload.filename), html: payload.html, contentIr: payload.contentIr, assets, overwrite: payload.overwrite === true };
}

async function resolveAssets(root, assets) {
  const values = new Map();
  let total = 0;
  for (const asset of assets) {
    const candidate = asset.projectPath.replaceAll("\\", "/");
    if (!candidate || candidate.startsWith("/") || candidate === ".." || candidate.startsWith("../") || candidate.includes("\0")) throw failure(`asset ${asset.id} 必须引用当前项目内文件。`);
    const target = path.resolve(root, candidate);
    const canonical = await realpath(target).catch(() => null);
    if (!canonical || !isInside(root, canonical)) throw failure(`asset ${asset.id} 不存在或指向项目外部。`);
    const info = await stat(canonical);
    const mime = MIME_TYPES.get(path.extname(canonical).toLowerCase());
    if (!info.isFile() || !mime) throw failure(`asset ${asset.id} 不是受支持的图片。`);
    if (info.size > MAX_ASSET_BYTES) throw failure(`asset ${asset.id} 超过 10MB 限制。`, 413);
    total += info.size;
    if (total > MAX_TOTAL_ASSET_BYTES) throw failure("Kami assets 总大小超过 24MB 限制。", 413);
    const bytes = await readFile(canonical);
    values.set(asset.id, `data:${mime};base64,${bytes.toString("base64")}`);
  }
  return values;
}

function injectCspAndFontFallback(html, language, jetBrainsData) {
  let output = html.replace(/@font-face\s*\{[^{}]*(?:TsangerJinKai02|Source Han Serif K)[^{}]*\}/gis, "");
  output = output.replace(/url\((['"]?)(?:\.\.\/)+(?:fonts\/)?JetBrainsMono\.woff2\1\)/gi, `url("${jetBrainsData}")`);
  const family = language === "zh-CN"
    ? '"Songti SC", "Source Han Serif SC", "Noto Serif CJK SC", STSong, SimSun, serif'
    : language === "ja"
      ? '"Hiragino Mincho ProN", "Yu Mincho", "Noto Serif CJK JP", serif'
      : language === "ko"
        ? 'AppleMyungjo, "Source Han Serif K", "Noto Serif CJK KR", Batang, serif'
        : 'Palatino, "Palatino Linotype", Georgia, serif';
  const addition = `<meta http-equiv="Content-Security-Policy" content="${CSP}"><style id="kami-local-fonts">:root{--serif:${family}}body{font-family:var(--serif)}</style>`;
  return /<head(?:\s[^>]*)?>/i.test(output) ? output.replace(/<head(?:\s[^>]*)?>/i, (head) => `${head}${addition}`) : `<!doctype html><html><head>${addition}</head><body>${output}</body></html>`;
}

function replaceAssetTokens(html, assets) {
  let output = html;
  for (const [id, data] of assets) output = output.replaceAll(`kami-asset://${id}`, data);
  const unresolved = [...output.matchAll(/kami-asset:\/\/([A-Za-z0-9_-]+)/g)].map((match) => match[1]);
  if (unresolved.length) throw failure(`HTML 引用了未声明的 Kami asset：${[...new Set(unresolved)].join(", ")}。`);
  return output;
}

function assertNoExternalResources(html) {
  const visible = html.replace(/<!--[\s\S]*?-->/g, "");
  const candidates = [];
  for (const match of visible.matchAll(/\b(?:src|poster|data)\s*=\s*(["'])(.*?)\1/gis)) candidates.push(match[2].trim());
  for (const match of visible.matchAll(/\bsrcset\s*=\s*(["'])(.*?)\1/gis)) candidates.push(...match[2].split(",").map((item) => item.trim().split(/\s+/)[0]));
  for (const match of visible.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/gis)) candidates.push(match[2].trim());
  for (const match of visible.matchAll(/<(?:link|image|use)\b[^>]*\b(?:href|xlink:href)\s*=\s*(["'])(.*?)\1[^>]*>/gis)) {
    const tag = match[0];
    if (/^<link/i.test(tag) && !/\brel\s*=\s*["'][^"']*(?:stylesheet|icon|preload|modulepreload)[^"']*["']/i.test(tag)) continue;
    candidates.push(match[2].trim());
  }
  const unsafe = candidates.find((value) => value && !value.startsWith("data:") && !value.startsWith("#"));
  if (unsafe) throw failure(`HTML 包含禁止的外部或本机资源：${unsafe.slice(0, 160)}。请使用 kami-asset://<id>。`);
  if (/<(?:iframe|object|embed|base)\b/i.test(visible)) throw failure("HTML 不得嵌入 iframe、object、embed 或 base。");
  if (/<form\b/i.test(visible)) throw failure("HTML 不得包含可提交表单。");
}

async function runCheck(python, buildScript, args, options) {
  throwIfCancelled(options.signal);
  try {
    const result = await execFileAsync(python, [buildScript, ...args], { cwd: options.cwd, env: options.env, signal: options.signal, maxBuffer: 512 * 1024 });
    return (result.stdout || result.stderr || "OK").trim().slice(0, 4_000);
  } catch (error) {
    throwIfCancelled(options.signal);
    const detail = String(error?.stdout || error?.stderr || error?.message || "Kami 检查失败。").trim().slice(0, 4_000);
    throw failure(detail, 422);
  }
}

async function assertPublishTargets(root, targets, overwrite) {
  for (const target of targets) {
    if (!isInside(root, target)) throw failure("Kami 发布路径超出项目。");
    const info = await stat(target).catch(() => null);
    if (info && !overwrite) throw failure(`产物已存在：${path.relative(root, target)}。如需覆盖请明确设置 overwrite: true。`, 409);
  }
}

async function publishWithRollback(pairs, backupDirectory, signal) {
  const backups = [];
  const published = [];
  try {
    for (const { final } of pairs) {
      const info = await stat(final).catch(() => null);
      if (!info) continue;
      const backup = path.join(backupDirectory, String(backups.length));
      await rename(final, backup);
      backups.push({ final, backup });
    }
    throwIfCancelled(signal);
    for (const pair of pairs) {
      await mkdir(path.dirname(pair.final), { recursive: true });
      await rename(pair.staged, pair.final);
      published.push(pair.final);
    }
  } catch (error) {
    for (const target of published.reverse()) await rm(target, { recursive: true, force: true });
    for (const item of backups.reverse()) await rename(item.backup, item.final).catch(() => undefined);
    throw error;
  }
}

export async function renderKamiArtifact({ workspace, dataDirectory, payload, signal, pythonPath, runtimeRoot }) {
  const request = validateKamiPayload(payload);
  throwIfCancelled(signal);
  const workspaceRoot = await realpath(workspace.path);
  const [pythonReady, kamiReady] = await Promise.all([
    realpath(pythonPath).catch(() => null),
    realpath(path.join(dataDirectory, "kami-ready-v1")).catch(() => null),
  ]);
  if (!pythonReady || !kamiReady) throw failure("Kami 组件尚未安装。请先运行 npm run kami:setup。", 503);
  const skillRoot = path.join(runtimeRoot, ".agents", "skills", "kami");
  const buildScript = path.join(skillRoot, "scripts", "build.py");
  const renderer = path.join(runtimeRoot, "server", "kami-renderer.py");
  const temporaryDirectory = path.join(dataDirectory, "kami-jobs", randomUUID());
  const staged = path.join(temporaryDirectory, "staged");
  const previewStaged = path.join(staged, `${request.filename}.preview`);
  const rawHtml = path.join(temporaryDirectory, "coverage.html");
  const renderInputHtml = path.join(temporaryDirectory, "render-input.html");
  const finalHtml = path.join(staged, `${request.filename}.html`);
  const contentPath = path.join(staged, `${request.filename}.content.json`);
  const pdfPath = path.join(staged, `${request.filename}.pdf`);
  const manifestPath = path.join(staged, `${request.filename}.kami.json`);
  const outputRoot = path.join(workspaceRoot, "outputs");
  const finalTargets = {
    content: path.join(outputRoot, `${request.filename}.content.json`),
    html: path.join(outputRoot, `${request.filename}.html`),
    pdf: path.join(outputRoot, `${request.filename}.pdf`),
    manifest: path.join(outputRoot, `${request.filename}.kami.json`),
    preview: path.join(outputRoot, `${request.filename}.preview`),
  };
  const pairs = [
    { staged: contentPath, final: finalTargets.content },
    { staged: finalHtml, final: finalTargets.html },
    ...(request.formats.includes("pdf") ? [{ staged: pdfPath, final: finalTargets.pdf }, { staged: previewStaged, final: finalTargets.preview }] : []),
    { staged: manifestPath, final: finalTargets.manifest },
  ];
  await assertPublishTargets(workspaceRoot, pairs.map((item) => item.final), request.overwrite);
  await mkdir(staged, { recursive: true, mode: 0o700 });
  await mkdir(path.join(temporaryDirectory, "backup"), { recursive: true, mode: 0o700 });
  const checks = [];
  try {
    const [assetValues, jetBrains] = await Promise.all([
      resolveAssets(workspaceRoot, request.assets),
      readFile(path.join(skillRoot, "assets", "fonts", "JetBrainsMono.woff2")),
    ]);
    const jetBrainsData = `data:font/woff2;base64,${jetBrains.toString("base64")}`;
    const coverageHtml = injectCspAndFontFallback(request.html, request.language, jetBrainsData);
    const selfContainedHtml = replaceAssetTokens(coverageHtml, assetValues);
    assertNoExternalResources(selfContainedHtml);
    checks.push({ name: "resources", status: "passed", detail: `${assetValues.size} project asset(s); CSP injected` });
    await writeFile(rawHtml, coverageHtml, { mode: 0o600 });
    await writeFile(renderInputHtml, selfContainedHtml, { mode: 0o600 });
    await writeFile(contentPath, `${JSON.stringify(request.contentIr, null, 2)}\n`, { mode: 0o600 });
    const environment = { ...process.env, KAMI_RUNTIME_DIR: path.join(dataDirectory, "kami-runtime"), KAMI_ALLOW_FALLBACK_ONLY: "1", PYTHONDONTWRITEBYTECODE: "1" };
    for (const [name, args] of [
      ["schema-and-coverage", ["--check-content", contentPath, rawHtml]],
      ["placeholders", ["--check-placeholders", rawHtml]],
      ["markdown", ["--check-markdown", rawHtml]],
      ["style", ["--check-style", rawHtml]],
    ]) {
      const detail = await runCheck(pythonPath, buildScript, args, { cwd: temporaryDirectory, env: environment, signal });
      checks.push({ name, status: "passed", detail });
    }
    const rendererArgs = [renderer, "--skill-root", skillRoot, "--input-html", renderInputHtml, "--output-html", finalHtml];
    if (request.formats.includes("pdf")) rendererArgs.push("--output-pdf", pdfPath, "--preview-dir", previewStaged);
    const rendered = await execFileAsync(pythonPath, rendererArgs, { cwd: temporaryDirectory, env: environment, signal, maxBuffer: 512 * 1024 }).catch((error) => {
      throwIfCancelled(signal);
      throw failure(String(error?.stderr || error?.stdout || error?.message || "Kami 渲染失败。").slice(0, 4_000), 422);
    });
    const resultLine = rendered.stdout.split(/\r?\n/).find((line) => line.startsWith("KAMI_RESULT "));
    const renderResult = JSON.parse(resultLine?.slice("KAMI_RESULT ".length) ?? "null");
    if (!renderResult || !Number.isInteger(renderResult.pageCount) || renderResult.renderedPages !== renderResult.pageCount) throw failure("Kami PDF 逐页渲染结果无效。", 500);
    checks.push({ name: "pdf-render", status: "passed", detail: request.formats.includes("pdf") ? `${renderResult.pageCount} page(s), ${renderResult.renderedPages} preview(s)` : "HTML-only artifact" });
    if (request.formats.includes("pdf")) {
      const pageLimit = PAGE_LIMITS.get(request.template);
      if (pageLimit && renderResult.pageCount > pageLimit) throw failure(`Kami ${request.template} 超过 ${pageLimit} 页限制。`, 422);
      checks.push({ name: "page-count", status: "passed", detail: pageLimit ? `${renderResult.pageCount}/${pageLimit}` : String(renderResult.pageCount) });
      for (const [name, args] of [
        ["fonts", ["--check-fonts", pdfPath]],
        ["density", ["--check-density", pdfPath]],
      ]) {
        const detail = await runCheck(pythonPath, buildScript, args, { cwd: temporaryDirectory, env: environment, signal });
        checks.push({ name, status: "passed", detail });
      }
    } else {
      checks.push({ name: "fonts", status: "passed", detail: "system/open-source serif fallback declared" });
      checks.push({ name: "page-count", status: "not-applicable", detail: "landing-page HTML" });
      checks.push({ name: "density", status: "not-applicable", detail: "landing-page HTML" });
    }
    const htmlBytes = await readFile(finalHtml);
    if (/\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]|\$\$[\s\S]*?\$\$/.test(htmlBytes.toString("utf8"))) throw failure("Kami 产物仍包含未转换的 TeX 公式。", 422);
    checks.push({ name: "math", status: "passed", detail: "strict MathJax SVG conversion complete" });
    const htmlRelative = path.posix.join("outputs", `${request.filename}.html`);
    const previewNames = request.formats.includes("pdf") ? (await readdir(previewStaged)).filter((name) => /^page-\d+\.png$/.test(name)).sort() : [];
    if (request.formats.includes("pdf") && previewNames.length !== renderResult.pageCount) throw failure("Kami 预览 PNG 数量与 PDF 页数不一致。", 500);
    const cjkUsage = renderResult.cjkFontUsage ?? {};
    const cjkFont = Object.entries(cjkUsage).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    const resolvedFont = cjkFont ?? ((renderResult.fonts ?? []).join(", ") || null);
    const fontFallback = { used: request.language !== "en", requested: request.language === "zh-CN" ? "Songti SC / Source Han Serif SC" : "system serif", resolved: resolvedFont };
    const manifest = {
      kind: "kami-artifact",
      version: 1,
      kami: { version: "1.15.0", commit: "4dab24cc4c527dbb35aa8fae09e02822992dfbe2" },
      generatedAt: new Date().toISOString(), template: request.template, language: request.language, formats: request.formats,
      files: { html: { path: htmlRelative, sha256: sha256(htmlBytes) }, ...(request.formats.includes("pdf") ? { pdf: { path: path.posix.join("outputs", `${request.filename}.pdf`), sha256: sha256(await readFile(pdfPath)) } } : {}) },
      contentSha256: sha256(await readFile(contentPath)), checks, pageCount: renderResult.pageCount, renderedPages: renderResult.renderedPages,
      previewPaths: previewNames.map((name) => path.posix.join("outputs", `${request.filename}.preview`, name)), fontFallback, visualReviewPending: true,
    };
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o600 });
    throwIfCancelled(signal);
    await publishWithRollback(pairs, path.join(temporaryDirectory, "backup"), signal);
    const paths = { content: path.posix.join("outputs", `${request.filename}.content.json`), html: htmlRelative, manifest: path.posix.join("outputs", `${request.filename}.kami.json`), ...(request.formats.includes("pdf") ? { pdf: path.posix.join("outputs", `${request.filename}.pdf`) } : {}) };
    return { paths, previewPaths: manifest.previewPaths, pageCount: renderResult.pageCount, renderedPages: renderResult.renderedPages, checks, fontFallback, visualReviewPending: true };
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
}

export async function verifyKamiHtmlManifest(root, relativePath, htmlBuffer) {
  if (path.extname(relativePath).toLowerCase() !== ".html") return null;
  const normalized = relativePath.replaceAll("\\", "/").replace(/^\/+/, "");
  const manifestRelative = normalized.replace(/\.html$/i, ".kami.json");
  const manifestPath = path.resolve(root, manifestRelative);
  if (!isInside(root, manifestPath)) return null;
  try {
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    if (manifest?.kind !== "kami-artifact" || manifest?.files?.html?.path !== normalized || manifest.files.html.sha256 !== sha256(htmlBuffer)) return null;
    return { manifestPath: manifestRelative, sha256: manifest.files.html.sha256, visualReviewPending: manifest.visualReviewPending === true };
  } catch {
    return null;
  }
}
