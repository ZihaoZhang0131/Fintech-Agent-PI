import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const stylesheet = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("the interface color literals stay monochrome", () => {
  const hexColors = [...stylesheet.matchAll(/#([0-9a-f]{6})(?:[0-9a-f]{2})?\b/gi)];
  assert.ok(hexColors.length > 0);
  for (const [, hex] of hexColors) {
    assert.equal(hex.slice(0, 2), hex.slice(2, 4), `non-gray color #${hex}`);
    assert.equal(hex.slice(2, 4), hex.slice(4, 6), `non-gray color #${hex}`);
  }

  const rgbColors = [
    ...stylesheet.matchAll(
      /\brgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[0-9.]+)?\s*\)/g,
    ),
  ];
  for (const [, red, green, blue] of rgbColors) {
    assert.equal(red, green, `non-gray rgb color ${red}, ${green}, ${blue}`);
    assert.equal(green, blue, `non-gray rgb color ${red}, ${green}, ${blue}`);
  }
});

test("the interface does not introduce alternate color functions or colored utilities", () => {
  assert.doesNotMatch(stylesheet, /\b(?:hsl|hsla|oklch|lab|lch|color)\(/i);
  assert.doesNotMatch(
    stylesheet,
    /(?:text|bg|border|ring|from|to|via)-(?:red|green|blue|yellow|amber|orange|purple|pink|emerald|teal|cyan|lime|indigo|violet|rose|sky)-/i,
  );
});
