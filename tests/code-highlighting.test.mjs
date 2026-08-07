import assert from "node:assert/strict";
import test from "node:test";
import Prism from "prismjs";
import "prismjs/components/prism-python.js";
import "prismjs/components/prism-scss.js";
import "prismjs/components/prism-typescript.js";

test("Prism grammars generate syntax tokens for the supported IDE code preview languages", () => {
  const python = Prism.highlight("def preview(value):\n  return value\n", Prism.languages.python, "python");
  const typescript = Prism.highlight(
    "const preview: string = 'ready';\n",
    Prism.languages.typescript,
    "typescript",
  );
  const scss = Prism.highlight("$accent: #c96442;\n.button { color: $accent; }\n", Prism.languages.scss, "scss");

  assert.match(python, /token keyword/);
  assert.match(typescript, /token keyword/);
  assert.match(scss, /token variable/);
});
