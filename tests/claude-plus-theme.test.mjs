import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const stylesheet = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");

const expectedThemeVariables = {
  background: "#faf9f5",
  foreground: "#3d3929",
  card: "#f5f4ef",
  "card-foreground": "#141413",
  popover: "#ffffff",
  primary: "#c96442",
  secondary: "#e9e6dc",
  muted: "#ede9de",
  "muted-foreground": "#6e6d68",
  border: "#dad9d4",
  input: "#b4b2a7",
  ring: "#c96442",
  sidebar: "#f5f4ee",
  radius: "1rem",
};

test("the interface exposes the Claude+ light theme contract", () => {
  for (const [name, value] of Object.entries(expectedThemeVariables)) {
    assert.ok(stylesheet.includes(`--${name}: ${value};`), `missing --${name}: ${value}`);
  }

  assert.match(stylesheet, /--shadow-xs:\s*0 1px 3px rgba\(0, 0, 0, 0\.05\);/);
  assert.match(stylesheet, /--font-sans:\s*var\(--font-outfit\)/);
  assert.match(stylesheet, /--font-mono:\s*var\(--font-geist-mono\)/);
});

test("Outfit and Geist Mono are loaded through the existing framework font support", () => {
  assert.match(layout, /import \{ Geist_Mono, Outfit \} from "next\/font\/google";/);
  assert.match(layout, /variable: "--font-outfit"/);
  assert.match(layout, /variable: "--font-geist-mono"/);
  assert.match(layout, /className=\{`\$\{outfit\.variable\} \$\{geistMono\.variable\}`\}/);
});

test("primary controls, cards, and focus states consume semantic theme tokens", () => {
  assert.match(stylesheet, /\.workspace-onboarding button,[\s\S]*background: var\(--primary\);/);
  assert.match(
    stylesheet,
    /\.new-project-button,\s*\.new-chat-button,\s*\.project-heading,\s*\.conversation-row,[\s\S]*background: transparent;/,
  );
  assert.match(stylesheet, /\.project-heading:hover,[\s\S]*background: var\(--sidebar-accent\);/);
  assert.match(stylesheet, /\.suggestion-card,[\s\S]*background: var\(--card\);/);
  assert.match(stylesheet, /\.composer:focus-within\s*\{[^}]*border-color: var\(--ring\);/s);
  assert.match(stylesheet, /:where\(button, input, select, textarea, a\):focus-visible/);
});

test("file previews use a white canvas with dark readable text", () => {
  assert.match(
    stylesheet,
    /\.workspace-preview-content\s*\{[^}]*background: #ffffff;[^}]*color: var\(--ink\);/s,
  );
  assert.match(
    stylesheet,
    /\.workspace-preview-content:has\(pre code\),[\s\S]*background: #ffffff;[\s\S]*color: var\(--foreground\);/,
  );
  assert.match(
    stylesheet,
    /\.workspace-preview-content\.image\s*\{[^}]*background: #ffffff;/s,
  );
  assert.match(
    stylesheet,
    /\.workspace-preview-content\.pdf\s*\{[^}]*background: #ffffff;/s,
  );
});
