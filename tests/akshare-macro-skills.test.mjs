import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const sharedSkillRoot = path.join(projectRoot, ".agents/skills/akshare-http-data");

const skillCases = [
  ["akshare-china-macro", 80],
  ["akshare-us-macro", 44],
  ["akshare-euro-macro", 14],
  ["akshare-institutions-macro", 10],
];

function functionNames(source) {
  return [...source.matchAll(/^### (macro_[a-z0-9_]+)$/gm)].map((match) => match[1]);
}

test("macro Skills contain exactly the verified interfaces and their independent AKTools resources", async () => {
  for (const [name, expectedCount] of skillCases) {
    const root = path.join(projectRoot, `.agents/skills/${name}`);
    const instructions = await readFile(path.join(root, "SKILL.md"), "utf8");
    const index = await readFile(path.join(root, "references/index.md"), "utf8");
    const referenceFiles = (await readdir(path.join(root, "references"))).filter((file) => file.startsWith("topic-"));
    const cards = await Promise.all(referenceFiles.map((file) => readFile(path.join(root, "references", file), "utf8")));
    const names = functionNames(cards.join("\n"));

    assert.match(instructions, /aktools_status\.py/);
    assert.match(instructions, /aktools_get\.py/);
    assert.equal(names.length, expectedCount);
    assert.equal(new Set(names).size, expectedCount);
    assert.equal([...index.matchAll(/\| `macro_[a-z0-9_]+` \|/g)].length, expectedCount);
    assert.deepEqual(
      await readFile(path.join(root, "scripts/aktools_status.py"), "utf8"),
      await readFile(path.join(sharedSkillRoot, "scripts/aktools_status.py"), "utf8"),
    );
    assert.deepEqual(
      await readFile(path.join(root, "scripts/aktools_get.py"), "utf8"),
      await readFile(path.join(sharedSkillRoot, "scripts/aktools_get.py"), "utf8"),
    );
  }
});

test("China macro Skill omits failed and slow interfaces from its default callable index", async () => {
  const root = path.join(projectRoot, ".agents/skills/akshare-china-macro");
  const index = await readFile(path.join(root, "references/index.md"), "utf8");
  const cards = await Promise.all(
    (await readdir(path.join(root, "references")))
      .filter((file) => file.startsWith("topic-"))
      .map((file) => readFile(path.join(root, "references", file), "utf8")),
  );
  const source = `${index}\n${cards.join("\n")}`;
  for (const name of [
    "macro_china_rmb",
    "macro_china_swap_rate",
    "macro_china_bond_public",
    "macro_china_bsi_index",
    "macro_china_insurance",
  ]) {
    assert.doesNotMatch(source, new RegExp(`^### ${name}$`, "m"));
    assert.equal(index.includes(`| \`${name}\` |`), false);
  }
});
