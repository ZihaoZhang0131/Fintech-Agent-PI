export type FileTreeEntry = {
  path: string;
  name: string;
  kind: "file" | "directory";
  size: number;
  modifiedAt: number;
  extension: string;
};

export type ProjectFileTree = {
  childrenByDirectory: Record<string, FileTreeEntry[]>;
  expandedPaths: string[];
  loadingPaths: string[];
  errorsByPath: Record<string, string>;
  truncatedPaths: string[];
};

export type ProjectFileTreeState = Record<string, ProjectFileTree>;

const EMPTY_PROJECT_FILE_TREE: ProjectFileTree = {
  childrenByDirectory: {},
  expandedPaths: [],
  loadingPaths: [],
  errorsByPath: {},
  truncatedPaths: [],
};

export function getProjectFileTree(
  state: ProjectFileTreeState,
  projectId: string,
): ProjectFileTree {
  return state[projectId] ?? EMPTY_PROJECT_FILE_TREE;
}

function updateProjectFileTree(
  state: ProjectFileTreeState,
  projectId: string,
  update: (tree: ProjectFileTree) => ProjectFileTree,
) {
  if (!projectId) return state;
  return { ...state, [projectId]: update(getProjectFileTree(state, projectId)) };
}

function without(items: string[], value: string) {
  return items.filter((item) => item !== value);
}

export function setDirectoryLoading(
  state: ProjectFileTreeState,
  projectId: string,
  directoryPath: string,
): ProjectFileTreeState {
  return updateProjectFileTree(state, projectId, (tree) => {
    const errorsByPath = { ...tree.errorsByPath };
    delete errorsByPath[directoryPath];
    return {
      ...tree,
      loadingPaths: tree.loadingPaths.includes(directoryPath)
        ? tree.loadingPaths
        : [...tree.loadingPaths, directoryPath],
      errorsByPath,
    };
  });
}

export function setDirectoryEntries(
  state: ProjectFileTreeState,
  projectId: string,
  directoryPath: string,
  entries: FileTreeEntry[],
  truncated = false,
): ProjectFileTreeState {
  return updateProjectFileTree(state, projectId, (tree) => {
    const errorsByPath = { ...tree.errorsByPath };
    delete errorsByPath[directoryPath];
    return {
      ...tree,
      childrenByDirectory: { ...tree.childrenByDirectory, [directoryPath]: entries },
      loadingPaths: without(tree.loadingPaths, directoryPath),
      errorsByPath,
      truncatedPaths: truncated
        ? tree.truncatedPaths.includes(directoryPath)
          ? tree.truncatedPaths
          : [...tree.truncatedPaths, directoryPath]
        : without(tree.truncatedPaths, directoryPath),
    };
  });
}

export function setDirectoryError(
  state: ProjectFileTreeState,
  projectId: string,
  directoryPath: string,
  message: string,
): ProjectFileTreeState {
  return updateProjectFileTree(state, projectId, (tree) => ({
    ...tree,
    loadingPaths: without(tree.loadingPaths, directoryPath),
    errorsByPath: { ...tree.errorsByPath, [directoryPath]: message },
  }));
}

export function toggleDirectoryExpansion(
  state: ProjectFileTreeState,
  projectId: string,
  directoryPath: string,
): ProjectFileTreeState {
  return updateProjectFileTree(state, projectId, (tree) => ({
    ...tree,
    expandedPaths: tree.expandedPaths.includes(directoryPath)
      ? without(tree.expandedPaths, directoryPath)
      : [...tree.expandedPaths, directoryPath],
  }));
}

export function getVisibleFileTreeEntries(tree: ProjectFileTree): FileTreeEntry[] {
  const visible: FileTreeEntry[] = [];
  const visited = new Set<string>();

  function append(directoryPath: string) {
    if (visited.has(directoryPath)) return;
    visited.add(directoryPath);
    for (const entry of tree.childrenByDirectory[directoryPath] ?? []) {
      visible.push(entry);
      if (entry.kind === "directory" && tree.expandedPaths.includes(entry.path)) {
        append(entry.path);
      }
    }
  }

  append("");
  return visible;
}

export function getLoadedFileTreeEntries(tree: ProjectFileTree): FileTreeEntry[] {
  const byPath = new Map<string, FileTreeEntry>();
  for (const entries of Object.values(tree.childrenByDirectory)) {
    for (const entry of entries) byPath.set(entry.path, entry);
  }
  return [...byPath.values()];
}

export function resetProjectFileTree(
  state: ProjectFileTreeState,
  projectId: string,
): ProjectFileTreeState {
  return updateProjectFileTree(state, projectId, (tree) => ({
    ...EMPTY_PROJECT_FILE_TREE,
    expandedPaths: tree.expandedPaths,
  }));
}

export function removeProjectFileTree(
  state: ProjectFileTreeState,
  projectId: string,
): ProjectFileTreeState {
  if (!(projectId in state)) return state;
  const next = { ...state };
  delete next[projectId];
  return next;
}
