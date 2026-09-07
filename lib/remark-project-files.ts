import type { Root, PhrasingContent } from "mdast";

// Artifacts are raw project-relative paths, not URLs. Encode once when creating links.
export function validProjectArtifact(path: string): boolean {
  return !!path && !/[\\\u0000-\u001f\u007f:]/.test(path) &&
    path.split("/").every(part => !!part && part !== "." && part !== "..");
}

export function projectArtifactHref(path: string): string {
  return `/${path.split("/").map(encodeURIComponent).join("/")}`;
}

const pathCharacter = /[\p{L}\p{N}\p{M}_./\\%+~#?:\-]/u;
function boundary(text: string, index: number): boolean {
  return index < 0 || index >= text.length || !pathCharacter.test(text[index]);
}

export function remarkProjectFiles({ paths = [] }: { paths?: readonly string[] } = {}) {
  const known = new Set(paths.filter(validProjectArtifact));
  const pattern = [...known].sort((a, b) => b.length - a.length)
    .map(path => path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const matcher = pattern ? new RegExp(pattern, "gu") : null;
  const link = (path: string, code = false): PhrasingContent => ({
    type: "link", url: projectArtifactHref(path),
    children: [{ type: code ? "inlineCode" : "text", value: path }],
  });
  function split(text: string): PhrasingContent[] {
    if (!matcher) return [{ type: "text", value: text }];
    matcher.lastIndex = 0;
    const parts: PhrasingContent[] = [];
    let end = 0;
    for (const match of text.matchAll(matcher)) {
      const start = match.index!, path = match[0];
      if (!boundary(text, start - 1) || !boundary(text, start + path.length)) continue;
      if (start > end) parts.push({ type: "text", value: text.slice(end, start) });
      parts.push(link(path));
      end = start + path.length;
    }
    if (end < text.length) parts.push({ type: "text", value: text.slice(end) });
    return parts;
  }
  // Structural traversal keeps this plugin independent of an additional runtime package.
  type Node = { type: string; value?: string; children?: Node[] };
  function visit(parent: Node) {
    if (!parent.children || ["link", "linkReference", "image", "imageReference", "code", "html", "definition"].includes(parent.type)) return;
    parent.children = parent.children.flatMap<Node>(child => {
      if (child.type === "text") return split(child.value ?? "");
      if (child.type === "inlineCode" && known.has(child.value ?? "")) return [link(child.value!, true)];
      visit(child);
      return [child];
    });
  }
  return (tree: Root) => { if (known.size) visit(tree); };
}
