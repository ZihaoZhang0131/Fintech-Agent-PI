export type ProjectFileTabs = {
  openPaths: string[];
  activePath: string | null;
};

export type ProjectFileTabsState = Record<string, ProjectFileTabs>;

export const MAX_OPEN_FILE_TABS = 4;

export const EMPTY_PROJECT_FILE_TABS: ProjectFileTabs = {
  openPaths: [],
  activePath: null,
};

export function getProjectFileTabs(
  state: ProjectFileTabsState,
  projectId: string,
): ProjectFileTabs {
  return state[projectId] ?? EMPTY_PROJECT_FILE_TABS;
}

function updateProjectTabs(
  state: ProjectFileTabsState,
  projectId: string,
  tabs: ProjectFileTabs,
): ProjectFileTabsState {
  if (!projectId) return state;
  return { ...state, [projectId]: tabs };
}

export function openFileTab(
  state: ProjectFileTabsState,
  projectId: string,
  path: string,
): ProjectFileTabsState {
  if (!projectId || !path) return state;
  const current = getProjectFileTabs(state, projectId);
  const currentPaths = current.openPaths.slice(0, MAX_OPEN_FILE_TABS);
  const openPaths = currentPaths.includes(path)
    ? currentPaths
    : currentPaths.length < MAX_OPEN_FILE_TABS
      ? [...currentPaths, path]
      : [...currentPaths.slice(0, MAX_OPEN_FILE_TABS - 1), path];
  return updateProjectTabs(state, projectId, {
    openPaths,
    activePath: path,
  });
}

export function activateFileTab(
  state: ProjectFileTabsState,
  projectId: string,
  path: string | null,
): ProjectFileTabsState {
  const current = getProjectFileTabs(state, projectId);
  if (path !== null && !current.openPaths.includes(path)) return state;
  if (current.activePath === path) return state;
  return updateProjectTabs(state, projectId, { ...current, activePath: path });
}

export function closeFileTab(
  state: ProjectFileTabsState,
  projectId: string,
  path: string,
): ProjectFileTabsState {
  const current = getProjectFileTabs(state, projectId);
  const closingIndex = current.openPaths.indexOf(path);
  if (closingIndex === -1) return state;

  const openPaths = current.openPaths.filter((item) => item !== path);
  const activePath =
    current.activePath === path
      ? current.openPaths[closingIndex + 1] ?? current.openPaths[closingIndex - 1] ?? null
      : current.activePath;

  return updateProjectTabs(state, projectId, { openPaths, activePath });
}

export function reconcileFileTabs(
  state: ProjectFileTabsState,
  projectId: string,
  availablePaths: Iterable<string>,
): ProjectFileTabsState {
  const current = getProjectFileTabs(state, projectId);
  const available = new Set(availablePaths);
  const openPaths = current.openPaths.filter((path) => available.has(path));
  const activePath =
    current.activePath && openPaths.includes(current.activePath)
      ? current.activePath
      : openPaths[0] ?? null;

  if (
    activePath === current.activePath &&
    openPaths.length === current.openPaths.length &&
    openPaths.every((path, index) => path === current.openPaths[index])
  ) {
    return state;
  }

  return updateProjectTabs(state, projectId, { openPaths, activePath });
}

export function removeProjectFileTabs(
  state: ProjectFileTabsState,
  projectId: string,
): ProjectFileTabsState {
  if (!(projectId in state)) return state;
  const next = { ...state };
  delete next[projectId];
  return next;
}

export function parseProjectFileTabs(value: string | null): ProjectFileTabsState {
  if (!value) return {};

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

    const result: ProjectFileTabsState = {};
    for (const [projectId, candidate] of Object.entries(parsed)) {
      if (!projectId || !candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
        continue;
      }

      const raw = candidate as { openPaths?: unknown; activePath?: unknown };
      if (!Array.isArray(raw.openPaths)) continue;
      const openPaths = [
        ...new Set(
          raw.openPaths.filter(
            (path): path is string => typeof path === "string" && path.length > 0,
          ),
        ),
      ].slice(0, MAX_OPEN_FILE_TABS);
      const activePath =
        typeof raw.activePath === "string" && openPaths.includes(raw.activePath)
          ? raw.activePath
          : null;
      result[projectId] = { openPaths, activePath };
    }
    return result;
  } catch {
    return {};
  }
}
