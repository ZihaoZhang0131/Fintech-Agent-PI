import assert from "node:assert/strict";
import test from "node:test";

import {
  DEEPSEEK_MODEL_OPTIONS,
  getAvailableModelOptions,
  resolveModelId,
} from "../lib/model-options.ts";

test("model options expose the DeepSeek models registered by PI", () => {
  assert.deepEqual(
    DEEPSEEK_MODEL_OPTIONS.map((model) => model.id),
    ["deepseek-v4-flash", "deepseek-v4-pro"],
  );
});

test("configured custom model remains available and invalid requests fall back safely", () => {
  const options = getAvailableModelOptions("custom-deepseek-model");
  assert.equal(options[0].id, "custom-deepseek-model");
  assert.equal(resolveModelId("deepseek-v4-pro", "custom-deepseek-model"), "deepseek-v4-pro");
  assert.equal(resolveModelId("untrusted-model", "custom-deepseek-model"), "custom-deepseek-model");
});
