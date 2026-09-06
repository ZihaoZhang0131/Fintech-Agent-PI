import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const stylesheet = await readFile(
  new URL("../app/globals.css", import.meta.url),
  "utf8",
);

test("active workflow nodes show restrained progress feedback", () => {
  assert.match(
    stylesheet,
    /\.wf-node\.running \.wf-node-status::before,\.wf-node\.recovering \.wf-node-status::before\s*\{[^}]*animation:wf-active-pulse 1\.6s ease-in-out infinite/,
  );
  assert.match(
    stylesheet,
    /@keyframes wf-active-pulse\s*\{[^}]*opacity:\.45[^}]*transform:scale\(\.78\)[\s\S]*opacity:1[^}]*transform:scale\(1\)/,
  );
  assert.match(stylesheet, /@media \(prefers-reduced-motion: reduce\)/);
});
