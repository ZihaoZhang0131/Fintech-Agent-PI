import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const skillRoot = fileURLToPath(new URL("../.agents/skills/akshare-http-data/", import.meta.url));
const scriptsDirectory = path.join(skillRoot, "scripts");
const referencesDirectory = path.join(skillRoot, "references");

function runPython(script, args, environment) {
  return new Promise((resolve, reject) => {
    const child = spawn("python3", [path.join(scriptsDirectory, script), ...args], {
      env: { ...process.env, ...environment },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => resolve({ code, stdout, stderr }));
  });
}

test("AKShare reference manifest covers every documented entry in the frozen snapshot", async () => {
  const instructions = await readFile(path.join(skillRoot, "SKILL.md"), "utf8");
  assert.match(instructions, /run_skill_script/);
  assert.match(instructions, /read_skill_resource/);
  assert.match(instructions, /npm run aktools:setup/);
  assert.match(instructions, /不是项目工作目录中的文件路径/);
  assert.match(instructions, /不得删减后缀/);
  const manifest = JSON.parse(await readFile(path.join(referencesDirectory, "manifest.json"), "utf8"));
  assert.equal(manifest.upstream.version, "1.18.83");
  assert.equal(manifest.upstream.commit, "5cb11b4270ee5c4c97fdb6c4db040b51c82a46fd");
  assert.equal(manifest.source_file_count, 28);
  assert.equal(manifest.sources.reduce((total, source) => total + source.interface_count, 0), 1009);
  assert.equal(manifest.documented_interface_count, 1009);
  assert.equal(manifest.unique_interface_count, 1008);
  assert.deepEqual(manifest.duplicate_documented_names, ["bond_zh_cov_value_analysis"]);
  assert.equal(manifest.interfaces.length, manifest.documented_interface_count);

  for (const entry of manifest.interfaces) {
    const reference = await readFile(path.join(skillRoot, entry.reference), "utf8");
    assert.match(reference, new RegExp(`^### ${entry.name}$`, "m"));
    const category = entry.reference.split("/")[1];
    const index = await readFile(path.join(referencesDirectory, category, "index.md"), "utf8");
    assert.ok(index.includes("| `" + entry.name + "` | `" + entry.reference + "` |"));
  }
  for (const entries of Object.values(manifest.categories)) {
    for (const entry of entries) {
      await readFile(path.join(skillRoot, entry.path), "utf8");
    }
  }
});

test("AKTools scripts encode parameters, limit rows, support no-argument calls, and surface errors", async (t) => {
  const requests = [];
  const server = createServer((request, response) => {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    requests.push(url);
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    if (url.pathname === "/version") {
      response.end(JSON.stringify({ ak_current_version: "1.18.83", at_current_version: "0.0.91" }));
      return;
    }
    if (url.pathname === "/api/public/error_case") {
      response.statusCode = 503;
      response.end(JSON.stringify({ error: "upstream unavailable" }));
      return;
    }
    if (url.pathname === "/api/public/no_args") {
      response.end(JSON.stringify([{ value: 1 }]));
      return;
    }
    response.end(JSON.stringify([{ row: 1 }, { row: 2 }, { row: 3 }]));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const address = server.address();
  const environment = { AKTOOLS_BASE_URL: `http://127.0.0.1:${address.port}` };

  const status = await runPython("aktools_status.py", [], environment);
  assert.equal(status.code, 0, status.stderr);
  assert.equal(JSON.parse(status.stdout).available, true);

  const data = await runPython(
    "aktools_get.py",
    ["stock_zh_a_hist", "--param", "symbol=600519", "--param", "note=天&地", "--max-rows", "2"],
    environment,
  );
  assert.equal(data.code, 0, data.stderr);
  const payload = JSON.parse(data.stdout);
  assert.equal(payload.row_count, 3);
  assert.equal(payload.truncated, true);
  assert.equal(payload.data.length, 2);
  const dataRequest = requests.find((url) => url.pathname === "/api/public/stock_zh_a_hist");
  assert.equal(dataRequest.searchParams.get("symbol"), "600519");
  assert.equal(dataRequest.searchParams.get("note"), "天&地");

  const noArgs = await runPython("aktools_get.py", ["no_args"], environment);
  assert.equal(noArgs.code, 0, noArgs.stderr);
  const noArgsRequest = requests.find((url) => url.pathname === "/api/public/no_args");
  assert.equal(noArgsRequest.search, "");

  const failed = await runPython("aktools_get.py", ["error_case"], environment);
  assert.equal(failed.code, 1);
  assert.match(failed.stderr, /AKTools HTTP 503/);
});
