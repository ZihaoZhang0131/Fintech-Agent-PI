import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  deleteModelProvider,
  listPublicModelProviders,
  modelProviderStorePath,
  resolveConfiguredModel,
  saveModelProvider,
  updateModelVerification,
} from "../server/model-providers.mjs";

test("model provider configuration never returns API keys and requires verification", async (t) => {
  const dataDirectory = await mkdtemp(path.join(tmpdir(), "pi-model-providers-"));
  t.after(() => rm(dataDirectory, { recursive: true, force: true }));

  const state = await saveModelProvider(
    dataDirectory,
    "openai",
    { apiKey: "sk-test-secret", enabledModelIds: ["gpt-5.4", "gpt-5.4-mini"] },
    {},
  );
  assert.equal(state.configured, true);
  assert.equal(state.verified, false);
  assert.deepEqual(state.enabledModelIds, ["gpt-5.4", "gpt-5.4-mini"]);
  assert.doesNotMatch(JSON.stringify(state), /sk-test-secret/);
  await assert.rejects(
    resolveConfiguredModel(dataDirectory, "openai", "gpt-5.4", {}),
    /尚未完成配置和验证/,
  );

  const verified = await updateModelVerification(
    dataDirectory,
    "openai",
    { modelId: "gpt-5.4", status: "verified" },
    {},
  );
  assert.equal(verified.verified, true);
  const resolved = await resolveConfiguredModel(dataDirectory, "openai", "gpt-5.4", {});
  assert.equal(resolved.piProviderId, "openai");
  assert.equal(resolved.apiKey, "sk-test-secret");

  const file = await readFile(modelProviderStorePath(dataDirectory), "utf8");
  assert.match(file, /sk-test-secret/);
  assert.equal((await stat(modelProviderStorePath(dataDirectory))).mode & 0o777, 0o600);
});

test("DeepSeek environment configuration remains available after local configuration removal", async (t) => {
  const dataDirectory = await mkdtemp(path.join(tmpdir(), "pi-model-provider-env-"));
  t.after(() => rm(dataDirectory, { recursive: true, force: true }));
  const environment = { DEEPSEEK_API_KEY: "env-key", DEEPSEEK_MODEL: "deepseek-v4-pro" };

  const providers = await listPublicModelProviders(dataDirectory, environment);
  const deepseek = providers.find((provider) => provider.id === "deepseek");
  assert.equal(deepseek?.verified, true);
  assert.deepEqual(deepseek?.enabledModelIds, ["deepseek-v4-pro"]);

  await saveModelProvider(
    dataDirectory,
    "deepseek",
    { apiKey: "local-key", enabledModelIds: ["deepseek-v4-flash"] },
    environment,
  );
  const local = await resolveConfiguredModel(dataDirectory, "deepseek", "deepseek-v4-flash", environment, {
    allowUnverified: true,
  });
  assert.equal(local.apiKey, "local-key");

  await deleteModelProvider(dataDirectory, "deepseek", environment);
  const fallback = await resolveConfiguredModel(dataDirectory, "deepseek", "deepseek-v4-pro", environment);
  assert.equal(fallback.apiKey, "env-key");
});
