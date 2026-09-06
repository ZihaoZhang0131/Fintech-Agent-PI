export type ProjectFileTarget = { path: string; line?: number };
export type ParsedLink =
  | { kind: "external"; href: string }
  | { kind: "file"; target: ProjectFileTarget }
  | { kind: "inactive" };

const inactive: ParsedLink = { kind: "inactive" };
const forbidden = /[\\\u0000-\u001f\u007f]/;

export function parseMarkdownLink(
  href: string | undefined,
  { baseDirectory }: { baseDirectory: string },
): ParsedLink {
  if (!href || forbidden.test(href) || href !== href.trim()) return inactive;
  if (/^https?:\/\//i.test(href)) {
    try {
      const url = new URL(href);
      return url.hostname ? { kind: "external", href } : inactive;
    } catch { return inactive; }
  }
  if (href.startsWith("#") || href.startsWith("//") || /^[\w+.-]+:/.test(href)) return inactive;
  const hashIndex = href.indexOf("#");
  const encodedPath = hashIndex < 0 ? href : href.slice(0, hashIndex);
  const fragment = hashIndex < 0 ? undefined : href.slice(hashIndex + 1);
  if (encodedPath.includes("?")) return inactive;
  let path: string;
  try { path = decodeURIComponent(encodedPath); } catch { return inactive; }
  if (!path || forbidden.test(path) || path.startsWith("//") || path.includes(":")) return inactive;
  const segments: string[] = [];
  const combined = path.startsWith("/") ? path : `${baseDirectory}/${path}`;
  for (const part of combined.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") {
      if (!segments.length) return inactive;
      segments.pop();
    } else segments.push(part);
  }
  if (!segments.length) return inactive;
  const line = /^L[1-9]\d*$/.test(fragment ?? "") ? Number(fragment!.slice(1)) : undefined;
  return { kind: "file", target: {
    path: segments.join("/"),
    ...(line !== undefined && Number.isSafeInteger(line) ? { line } : {}),
  } };
}

export type FileNavigation = ProjectFileTarget & { projectId: string; requestId: number };

export function nextFileNavigation(
  previous: FileNavigation | null, projectId: string, target: ProjectFileTarget,
): FileNavigation {
  return { ...target, projectId, requestId: (previous?.requestId ?? 0) + 1 };
}

export function activeFileNavigation(
  navigation: FileNavigation | null, projectId: string, path: string | null,
): FileNavigation | null {
  return navigation?.projectId === projectId && navigation.path === path ? navigation : null;
}
