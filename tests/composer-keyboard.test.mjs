import assert from "node:assert/strict";
import test from "node:test";
import { shouldSubmitComposerKey } from "../lib/composer-keyboard.ts";

const normalEnter = {
  key: "Enter",
  shiftKey: false,
  compositionActive: false,
  nativeIsComposing: false,
  keyCode: 13,
};

test("normal Enter submits after composition has ended", () => {
  assert.equal(shouldSubmitComposerKey(normalEnter), true);
});

test("Enter does not submit while the textarea composition cycle is active", () => {
  assert.equal(
    shouldSubmitComposerKey({ ...normalEnter, compositionActive: true }),
    false,
  );
});

test("Enter does not submit when the native event reports IME composition", () => {
  assert.equal(
    shouldSubmitComposerKey({ ...normalEnter, nativeIsComposing: true }),
    false,
  );
});

test("legacy IME key code 229 does not submit", () => {
  assert.equal(shouldSubmitComposerKey({ ...normalEnter, keyCode: 229 }), false);
});

test("Shift + Enter and non-Enter keys do not submit", () => {
  assert.equal(shouldSubmitComposerKey({ ...normalEnter, shiftKey: true }), false);
  assert.equal(shouldSubmitComposerKey({ ...normalEnter, key: "a", keyCode: 65 }), false);
});
