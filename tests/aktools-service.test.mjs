import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { EventEmitter } from "node:events";
import { PassThrough } from "node:stream";
import { setTimeout as delay } from "node:timers/promises";
import test from "node:test";
import { DEFAULT_AKTOOLS_URL, inspectAktools, reserveAvailablePort, startAktools, stopAktools } from "../scripts/aktools-service.mjs";

const version = { ak_current_version: "1.18.83", at_current_version: "0.0.91" };
const unavailable = { available: false, errorKind: "connection_error", error: "ECONNREFUSED" };
const fixture = `
import { createServer } from 'node:http';
const server = createServer((req, res) => {
  if (process.env.AKTOOLS_TEST_HANG) return;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(${JSON.stringify(version)}));
});
server.listen(Number(process.argv.at(-1)), '127.0.0.1');
`;
function options(overrides = {}) {
  return {
    python: process.execPath, cwd: process.cwd(), log() {}, warn() {},
    startupTimeoutMs: 2_000, pollIntervalMs: 10,
    inspect: (url, args) => url === DEFAULT_AKTOOLS_URL ? Promise.resolve(unavailable) : inspectAktools(url, args),
    choosePort: () => reserveAvailablePort(0),
    spawnImpl: (_python, args, config) => spawn(process.execPath, ['--input-type=module', '-e', fixture, '--', ...args], config),
    ...overrides,
  };
}
async function serve(t, handler) {
  const server = createServer(handler);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => { server.closeAllConnections(); return new Promise((resolve) => server.close(resolve)); });
  return `http://127.0.0.1:${server.address().port}`;
}

test('version probes distinguish identity, HTTP, JSON, timeout and connection failures', async (t) => {
  for (const [body, status, expected] of [
    [version, 200, undefined], [{ message: 'Hello Java' }, 200, 'identity_mismatch'],
    [{ ak_current_version: 'x', at_current_version: ' ' }, 200, 'identity_mismatch'],
    [[], 200, 'identity_mismatch'], ['not json', 200, 'invalid_json'], [{ error: 'Not Found' }, 404, 'http_error'],
  ]) {
    const url = await serve(t, (_req, res) => { res.writeHead(status); res.end(typeof body === 'string' ? body : JSON.stringify(body)); });
    const result = await inspectAktools(url);
    assert.equal(result.available, !expected);
    assert.equal(result.errorKind, expected);
  }
  const hanging = await serve(t, () => {});
  assert.equal((await inspectAktools(hanging, { timeoutMs: 30 })).errorKind, 'timeout');
  const port = await reserveAvailablePort(0);
  assert.equal((await inspectAktools(`http://127.0.0.1:${port}`)).errorKind, 'connection_error');
});

test('managed service starts on chosen free port and cleanup releases its listener', async () => {
  const calls = [];
  const service = await startAktools(options({ choosePort: async (port) => { calls.push(port); return reserveAvailablePort(0); } }));
  try {
    assert.deepEqual(calls, [8080]);
    assert.equal((await inspectAktools(service.baseUrl)).available, true);
    assert.ok(service.child.pid);
  } finally { await stopAktools(service.child); }
  assert.equal((await inspectAktools(service.baseUrl)).available, false);
});

test('unrelated occupied default port selects a new port without touching its server', async (t) => {
  const other = await serve(t, (_req, res) => { res.writeHead(404); res.end('Hello Java'); });
  const calls = [];
  const warnings = [];
  const service = await startAktools(options({
    inspect: (url, args) => inspectAktools(url === DEFAULT_AKTOOLS_URL ? other : url, args),
    choosePort: async (port) => { calls.push(port); if (port === 8080) throw Object.assign(new Error('busy'), { code: 'EADDRINUSE' }); return reserveAvailablePort(0); },
    warn: (text) => warnings.push(text),
  }));
  await stopAktools(service.child);
  assert.deepEqual(calls, [8080, 0]);
  assert.match(warnings.join(''), /8080.*占用/);
  assert.equal((await fetch(other)).status, 404);
});

test('existing managed AKTools is reused without spawning or requiring local Python', async () => {
  const service = await startAktools(options({
    python: '/missing/python', inspect: async () => ({ available: true, version }),
    choosePort: () => { throw new Error('must not reserve'); }, spawnImpl: () => { throw new Error('must not spawn'); },
  }));
  assert.deepEqual(service, { baseUrl: DEFAULT_AKTOOLS_URL, child: null });
  await stopAktools(service.child);
});

test('external service stays external on success and failure', async () => {
  for (const available of [true, false]) {
    const warnings = [];
    const service = await startAktools(options({
      baseUrl: 'http://127.0.0.1:18089', python: '/missing/python',
      inspect: async () => available ? { available, version } : unavailable,
      warn: (text) => warnings.push(text),
      spawnImpl: () => { throw new Error('external spawn'); }, choosePort: () => { throw new Error('external port change'); },
    }));
    assert.deepEqual(service, { baseUrl: 'http://127.0.0.1:18089', child: null });
    assert.equal(warnings.length, available ? 0 : 1);
  }
});

function failedChild(message, cause) {
  const child = new EventEmitter();
  Object.assign(child, { exitCode: null, signalCode: null, stdout: new PassThrough(), stderr: new PassThrough() });
  queueMicrotask(() => {
    if (cause) child.emit('error', cause);
    if (message) child.stderr.write(message);
    child.exitCode = 1;
    child.emit('exit', 1, null);
  });
  return child;
}

test('bind races retry at most three times and stop every attempted process', async () => {
  let spawned = 0;
  let stopped = 0;
  await assert.rejects(startAktools(options({
    spawnImpl: () => { spawned++; return failedChild('address already in use'); },
    stopChild: async () => { stopped++; },
  })), /三次.*端口冲突/);
  assert.equal(spawned, 3);
  assert.equal(stopped, 3);
});

test('a bind race can recover on the next port', async () => {
  const defaults = options();
  let spawned = 0;
  const service = await startAktools(options({ spawnImpl: (...args) => ++spawned === 1 ? failedChild('EADDRINUSE') : defaults.spawnImpl(...args) }));
  try { assert.equal(spawned, 2); assert.equal((await inspectAktools(service.baseUrl)).available, true); }
  finally { await stopAktools(service.child); }
});

test('missing dependency, execution permission and ordinary early exits are not retried', async () => {
  for (const [message, cause, expected, setup] of [
    ["ModuleNotFoundError: No module named 'aktools'", null, /依赖缺失/, true],
    ['', Object.assign(new Error('permission'), { code: 'EACCES' }), /权限不足/, false],
    ['unexpected failure', null, /unexpected failure/, false],
    ['', null, /未就绪|提前退出/, false],
  ]) {
    let count = 0;
    await assert.rejects(startAktools(options({ spawnImpl: () => { count++; return failedChild(message, cause); } })), (error) => {
      assert.match(error.message, expected);
      assert.equal(error.message.includes('npm run aktools:setup'), setup);
      return true;
    });
    assert.equal(count, 1);
  }
  await assert.rejects(startAktools(options({ python: '/missing/python' })), /解释器缺失.*aktools:setup/);
});

test('timeout and startup cancellation clean up owned processes', async () => {
  for (const cancel of [false, true]) {
    let child;
    const controller = new AbortController();
    const defaults = options();
    const started = startAktools(options({
      signal: controller.signal, startupTimeoutMs: 150, environment: { ...process.env, AKTOOLS_TEST_HANG: '1' },
      spawnImpl: (...args) => { child = defaults.spawnImpl(...args); if (cancel) setTimeout(() => controller.abort(), 50); return child; },
    }));
    await assert.rejects(started);
    assert.ok(child?.pid);
    await delay(30);
    assert.throws(() => process.kill(child.pid, 0), { code: 'ESRCH' });
  }
});

test('cleanup terminates descendants even when their launcher already exited', async () => {
  const child = spawn(process.execPath, ['-e', `
    const {spawn}=require('node:child_process');
    const nested=spawn(process.execPath,['-e','setInterval(()=>{},1000)'],{stdio:'ignore'});
    console.log(nested.pid); nested.unref();
  `], { detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
  let output = '';
  child.stdout.on('data', (chunk) => output += chunk);
  await new Promise((resolve) => child.on('close', resolve));
  const descendant = Number(output.trim());
  try { assert.ok(descendant); process.kill(descendant, 0); }
  finally { await stopAktools(child); }
  for (let i = 0; i < 30; i++) {
    try { process.kill(descendant, 0); } catch (error) { assert.equal(error.code, 'ESRCH'); return; }
    await delay(25);
  }
  assert.fail('descendant survived cleanup');
});
