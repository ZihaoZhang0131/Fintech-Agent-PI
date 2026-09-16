import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { mkdtemp, mkdir, readFile, writeFile, chmod, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import test from "node:test";
import { inspectAktools } from "../scripts/aktools-service.mjs";

async function fixture(t, { missingWeb = false, hang = false } = {}) {
  const root = await mkdtemp(path.join(tmpdir(), "pi-aktools-startup-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const directory of ["scripts", "server", "node_modules/.bin", ".local-data/aktools-venv/bin", ".local-data/documents-venv/bin", ".local-data/python-analysis-venv/bin", ".local-data/pandoc/bin"]) {
    await mkdir(path.join(root, directory), { recursive: true });
  }
  for (const name of ["run-local.mjs", "aktools-service.mjs", "setup-python-analysis.mjs"]) {
    await writeFile(path.join(root, "scripts", name), await readFile(new URL(`../scripts/${name}`, import.meta.url)));
  }
  for (const name of ["documents-ready-v3", "documents-venv/bin/python", "pandoc/bin/pandoc"]) {
    await writeFile(path.join(root, ".local-data", name), "fixture");
  }
  await writeFile(path.join(root, ".local-data/python-analysis-venv/bin/python"), "fixture");
  const analysisPackages = ["numpy==2.5.1", "pandas==3.0.5", "matplotlib==3.11.2", "openpyxl==3.1.5"];
  await writeFile(
    path.join(root, ".local-data/python-analysis-ready-v1"),
    `python=3.12\npackages-sha256=${createHash("sha256").update(analysisPackages.join("\n")).digest("hex")}\n`,
  );
  const python = path.join(root, ".local-data/aktools-venv/bin/python");
  await writeFile(python, `#!${process.execPath}
const { createServer } = require('node:http');
console.log('FIXTURE_AKTOOLS_PID=' + process.pid);
createServer((req,res)=>{
  if (${hang}) return;
  res.end(JSON.stringify({ak_current_version:'1',at_current_version:'1'}));
}).listen(Number(process.argv.at(-1)), '127.0.0.1');
`);
  await chmod(python, 0o755);
  await writeFile(path.join(root, "server/local-runtime.mjs"), `console.log('RUNTIME_URL='+process.env.AKTOOLS_BASE_URL); setInterval(()=>{},1000);`);
  if (!missingWeb) {
    const web = path.join(root, "node_modules/.bin/vinext");
    await writeFile(web, `#!${process.execPath}\nconsole.log('WEB_URL='+process.env.AKTOOLS_BASE_URL); setInterval(()=>{},1000);`);
    await chmod(web, 0o755);
  }
  const env = { ...process.env };
  delete env.AKTOOLS_BASE_URL;
  delete env.PI_LOCAL_DATA_DIR;
  const child = spawn(process.execPath, [path.join(root, "scripts/run-local.mjs"), "start"], { cwd: root, env, stdio: ["ignore", "pipe", "pipe"] });
  let output = "";
  child.stdout.on("data", (chunk) => { output += chunk; });
  child.stderr.on("data", (chunk) => { output += chunk; });
  const closed = new Promise((resolve) => child.on("close", (code) => resolve(code)));
  t.after(async () => {
    if (child.exitCode === null) child.kill("SIGTERM");
    await closed;
  });
  async function waitFor(pattern) {
    const deadline = Date.now() + 10_000;
    while (Date.now() < deadline) {
      const match = output.match(pattern);
      if (match) return match;
      if (child.exitCode !== null) throw new Error(output);
      await delay(20);
    }
    throw new Error(`startup fixture timeout: ${output}`);
  }
  return { child, closed, waitFor, output: () => output };
}

test("project launcher propagates fallback URL and cleans owned AKTools on shutdown or startup failure", async (t) => {
  const blocker = createServer((_request, response) => { response.writeHead(404); response.end("Hello Java"); });
  try {
    await new Promise((resolve, reject) => { blocker.once("error", reject); blocker.listen(8080, "127.0.0.1", resolve); });
  } catch (error) {
    if (error.code === "EADDRINUSE") { t.skip("8080 is owned by an existing service; conflict fixture cannot own it"); return; }
    throw error;
  }
  t.after(() => new Promise((resolve) => blocker.close(resolve)));
  await t.test("same selected address reaches both child processes and normal shutdown releases it", async (t) => {
    const run = await fixture(t);
    const runtime = (await run.waitFor(/RUNTIME_URL=(http:\/\/127\.0\.0\.1:\d+)/))[1];
    const web = (await run.waitFor(/WEB_URL=(http:\/\/127\.0\.0\.1:\d+)/))[1];
    assert.equal(web, runtime);
    assert.notEqual(runtime, "http://127.0.0.1:8080");
    assert.equal((await inspectAktools(runtime)).available, true);
    run.child.kill("SIGTERM");
    assert.equal(await run.closed, 0);
    assert.equal((await inspectAktools(runtime)).available, false);
    assert.equal((await fetch("http://127.0.0.1:8080")).status, 404);
  });
  await t.test("later child spawn failure releases the managed service", async (t) => {
    const run = await fixture(t, { missingWeb: true });
    await run.closed;
    assert.equal(run.child.exitCode, 1);
    assert.match(run.output(), /网页服务.*启动失败/);
    const url = run.output().match(/AKTools 已就绪：(http:\/\/127\.0\.0\.1:\d+)/)[1];
    assert.equal((await inspectAktools(url)).available, false);
  });
  await t.test("signal during readiness wait cleans the pending child", async (t) => {
    const run = await fixture(t, { hang: true });
    const pid = Number((await run.waitFor(/FIXTURE_AKTOOLS_PID=(\d+)/))[1]);
    run.child.kill("SIGTERM");
    assert.equal(await run.closed, 0);
    assert.throws(() => process.kill(pid, 0), { code: "ESRCH" });
  });
});
