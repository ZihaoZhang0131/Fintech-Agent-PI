"use client";

import {
  Bot,
  BookOpenCheck,
  Braces,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  CircleStop,
  CircleX,
  Clock3,
  Copy,
  Cpu,
  ExternalLink,
  File,
  FileChartColumn,
  FileCode2,
  FileImage,
  FileText,
  Folder,
  FolderOpen,
  FolderPlus,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  GripHorizontal,
  GripVertical,
  PanelBottomClose,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRight,
  PanelRightClose,
  PanelRightOpen,
  PanelTopClose,
  Plus,
  RefreshCw,
  Save,
  Search,
  Send,
  Sparkles,
  Terminal,
  Trash2,
  TrendingUp,
  UserRound,
  Wrench,
  X,
} from "lucide-react";
import {
  CSSProperties,
  FormEvent,
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactMarkdown from "react-markdown";
import { CapabilityLibrary } from "@/components/capability-library";
import type { CapabilityCatalog, CapabilityKind } from "@/lib/capability-types";
import { shouldSubmitComposerKey } from "@/lib/composer-keyboard";
import {
  applyToolApproval,
  applyToolEnd,
  applyToolStart,
  type ToolApprovalEvent,
  type ToolEndEvent,
  type ToolRun,
  type ToolStartEvent,
} from "@/lib/tool-runs";

type MessageRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;
  toolRuns?: ToolRun[];
};

type Conversation = {
  id: string;
  projectId: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
  bashApprovalMode: "ask" | "auto";
  bashPermissionMode: "sandbox" | "full";
};

type LocalProject = {
  id: string;
  name: string;
  path: string;
  createdAt: number;
  updatedAt: number;
};

type ProjectFile = {
  path: string;
  name: string;
  kind: "file" | "directory";
  size: number;
  modifiedAt: number;
  extension: string;
};

type FilePreview = {
  path: string;
  name: string;
  size: number;
  modifiedAt: number;
  extension: string;
  kind: "text" | "image" | "pdf" | "unsupported" | "too-large";
  mimeType: string;
  content?: string;
  data?: string;
};

type HealthInfo = {
  status: "ok";
  provider: string;
  model: string;
  keyConfigured: boolean;
};

type AgentStatus = "idle" | "connecting" | "streaming" | "done" | "stopped" | "error";

type StreamEvent =
  | { type: "start"; requestId: string }
  | ToolStartEvent
  | ToolEndEvent
  | ToolApprovalEvent
  | { type: "delta"; text: string }
  | {
      type: "done";
      durationMs: number;
      usage?: { input: number; output: number; totalTokens: number };
    }
  | { type: "error"; message: string };

const STORAGE_KEY = "pi-research-agent:conversations:v2";
const LEGACY_STORAGE_KEY = "pi-research-agent:conversations:v1";
const ACTIVE_PROJECT_KEY = "pi-research-agent:active-project:v1";
const EXPANDED_PROJECTS_KEY = "pi-research-agent:expanded-projects:v1";
const ENABLED_SKILLS_KEY = "pi-research-agent:enabled-skills:v1";
const ENABLED_TOOLS_KEY = "pi-research-agent:enabled-tools:v2";
const LEGACY_ENABLED_TOOLS_KEY = "pi-research-agent:enabled-tools:v1";
const SIDEBAR_WIDTH_KEY = "pi-research-agent:sidebar-width:v1";
const FILE_PANEL_WIDTH_KEY = "pi-research-agent:file-panel-width:v1";
const SIDEBAR_VISIBLE_KEY = "pi-research-agent:sidebar-visible:v1";
const FILE_PANEL_VISIBLE_KEY = "pi-research-agent:file-panel-visible:v1";
const FILE_BROWSER_RATIO_KEY = "pi-research-agent:file-browser-ratio:v1";
const FILE_BROWSER_VISIBLE_KEY = "pi-research-agent:file-browser-visible:v1";
const FILE_PREVIEW_VISIBLE_KEY = "pi-research-agent:file-preview-visible:v1";

type AppView = "workspace" | CapabilityKind;

const SUGGESTIONS = [
  {
    icon: TrendingUp,
    title: "拆解一家公司",
    prompt: "请分析贵州茅台，并把完整研究报告保存到当前项目的 outputs 目录。",
  },
  {
    icon: FileChartColumn,
    title: "梳理财务逻辑",
    prompt: "为盈利质量分析搭建检查清单，并保存为 Markdown 文件。",
  },
  {
    icon: Sparkles,
    title: "搭建研究框架",
    prompt: "搭建新能源汽车产业链研究框架，并将结果保存到项目文件夹。",
  },
];

const STATUS_COPY: Record<AgentStatus, { label: string; detail: string }> = {
  idle: { label: "等待提问", detail: "Agent 已就绪" },
  connecting: { label: "正在连接", detail: "正在建立模型请求" },
  streaming: { label: "正在执行", detail: "Agent 正在处理项目任务" },
  done: { label: "本轮完成", detail: "回答与产出已保存" },
  stopped: { label: "已停止", detail: "保留已生成的内容" },
  error: { label: "调用失败", detail: "请检查本地服务或 API Key" },
};

const CODE_EXTENSIONS = new Set([
  ".c",
  ".cpp",
  ".css",
  ".go",
  ".html",
  ".java",
  ".js",
  ".jsx",
  ".mjs",
  ".py",
  ".rb",
  ".rs",
  ".sh",
  ".sql",
  ".ts",
  ".tsx",
]);

function makeId() {
  return crypto.randomUUID();
}

function timestampNow() {
  return Date.now();
}

function makeConversation(projectId: string): Conversation {
  return {
    id: makeId(),
    projectId,
    title: "新对话",
    messages: [],
    updatedAt: timestampNow(),
    bashApprovalMode: "auto",
    bashPermissionMode: "sandbox",
  };
}

function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
}

function formatDuration(durationMs?: number) {
  if (durationMs === undefined) return "";
  return durationMs < 1_000 ? `${durationMs}ms` : `${(durationMs / 1_000).toFixed(1)}s`;
}

function formatBytes(size: number) {
  if (size < 1_024) return `${size} B`;
  if (size < 1_048_576) return `${(size / 1_024).toFixed(1)} KB`;
  return `${(size / 1_048_576).toFixed(1)} MB`;
}

function makeTitle(input: string) {
  const compact = input.replace(/\s+/g, " ").trim();
  return compact.length > 18 ? `${compact.slice(0, 18)}…` : compact;
}

function parseStoredConversations(value: string | null): Array<Conversation & { projectId?: string }> {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as Array<Conversation & { projectId?: string }>;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.title === "string" &&
        Array.isArray(item.messages),
    );
  } catch {
    return [];
  }
}

function parseStoredNames(value: string | null) {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((name): name is string => typeof name === "string") : null;
  } catch {
    return null;
  }
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function storedNumber(value: string | null, fallback: number, minimum: number, maximum: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? clamp(parsed, minimum, maximum) : fallback;
}

function storedBoolean(value: string | null, fallback: boolean) {
  return value === null ? fallback : value === "true";
}

function extractSseEvents(buffer: string) {
  const blocks = buffer.split("\n\n");
  const remainder = blocks.pop() ?? "";
  const events = blocks.flatMap((block) => {
    const dataLine = block.split("\n").find((line) => line.startsWith("data:"));
    if (!dataLine) return [];
    try {
      return [JSON.parse(dataLine.slice(5).trim()) as StreamEvent];
    } catch {
      return [];
    }
  });
  return { events, remainder };
}

async function responseJson<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as (T & { message?: string }) | null;
  if (!response.ok) throw new Error(payload?.message ?? `请求失败（${response.status}）`);
  return payload as T;
}

function fileIcon(file: ProjectFile) {
  if (file.kind === "directory") return Folder;
  if (file.extension === ".pdf") return FileChartColumn;
  if ([".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif"].includes(file.extension)) {
    return FileImage;
  }
  if (CODE_EXTENSIONS.has(file.extension)) return FileCode2;
  if ([".md", ".mdx", ".txt", ".csv"].includes(file.extension)) return FileText;
  return File;
}

export default function Home() {
  const [projects, setProjects] = useState<LocalProject[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeProjectId, setActiveProjectId] = useState("");
  const [activeId, setActiveId] = useState("");
  const [expandedProjectIds, setExpandedProjectIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectError, setProjectError] = useState("");
  const [projectMenuId, setProjectMenuId] = useState("");
  const [pathProject, setPathProject] = useState<LocalProject | null>(null);
  const [removeProjectCandidate, setRemoveProjectCandidate] = useState<LocalProject | null>(null);
  const [fullPermissionConversationId, setFullPermissionConversationId] = useState("");
  const [approvalSubmittingIds, setApprovalSubmittingIds] = useState<string[]>([]);
  const [copiedProjectPath, setCopiedProjectPath] = useState(false);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<AgentStatus>("idle");
  const [health, setHealth] = useState<HealthInfo | null>(null);
  const [durationMs, setDurationMs] = useState<number | null>(null);
  const [tokenUsage, setTokenUsage] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filePanelOpen, setFilePanelOpen] = useState(false);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [selectedFilePath, setSelectedFilePath] = useState("");
  const [filePreview, setFilePreview] = useState<FilePreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState<AppView>("workspace");
  const [capabilityCatalog, setCapabilityCatalog] = useState<CapabilityCatalog>({
    skills: [],
    tools: [],
  });
  const [enabledSkills, setEnabledSkills] = useState<string[]>([]);
  const [enabledTools, setEnabledTools] = useState<string[]>([]);
  const [capabilitiesReady, setCapabilitiesReady] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(246);
  const [filePanelWidth, setFilePanelWidth] = useState(380);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [filePanelVisible, setFilePanelVisible] = useState(true);
  const [fileBrowserRatio, setFileBrowserRatio] = useState(38);
  const [fileBrowserVisible, setFileBrowserVisible] = useState(true);
  const [filePreviewVisible, setFilePreviewVisible] = useState(true);
  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const composerIsComposingRef = useRef(false);
  const workspaceFilesLayoutRef = useRef<HTMLDivElement | null>(null);

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeProjectId),
    [activeProjectId, projects],
  );
  const activeConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === activeId && conversation.projectId === activeProjectId,
      ),
    [activeId, activeProjectId, conversations],
  );
  const isBusy = status === "connecting" || status === "streaming";
  const statusCopy = STATUS_COPY[status];
  const runningTool = useMemo(
    () =>
      (activeConversation?.messages ?? [])
        .flatMap((message) => message.toolRuns ?? [])
        .filter((run) => run.status === "running")
        .at(-1),
    [activeConversation?.messages],
  );
  const previewDataUrl =
    filePreview?.data && filePreview.mimeType
      ? `data:${filePreview.mimeType};base64,${filePreview.data}`
      : "";

  const loadProjectFiles = useCallback(async (projectId: string) => {
    if (!projectId) return;
    setFilesLoading(true);
    try {
      const payload = await responseJson<{ entries: ProjectFile[] }>(
        await fetch(`/api/local/workspaces/${projectId}/files`, { cache: "no-store" }),
      );
      setFiles(payload.entries);
    } catch (error) {
      setProjectError(error instanceof Error ? error.message : "无法读取项目文件。");
      setFiles([]);
    } finally {
      setFilesLoading(false);
    }
  }, []);

  const selectFile = useCallback(async (projectId: string, file: ProjectFile) => {
    if (file.kind !== "file") return;
    setSelectedFilePath(file.path);
    setPreviewLoading(true);
    setFilePreview(null);
    try {
      const payload = await responseJson<FilePreview>(
        await fetch(
          `/api/local/workspaces/${projectId}/files/content?path=${encodeURIComponent(file.path)}`,
          { cache: "no-store" },
        ),
      );
      setFilePreview(payload);
    } catch (error) {
      setProjectError(error instanceof Error ? error.message : "无法预览文件。");
    } finally {
      setPreviewLoading(false);
    }
  }, []);

  useEffect(() => {
    async function initialize() {
      setSidebarWidth(storedNumber(localStorage.getItem(SIDEBAR_WIDTH_KEY), 246, 190, 380));
      setFilePanelWidth(storedNumber(localStorage.getItem(FILE_PANEL_WIDTH_KEY), 380, 300, 680));
      setSidebarVisible(storedBoolean(localStorage.getItem(SIDEBAR_VISIBLE_KEY), true));
      setFilePanelVisible(storedBoolean(localStorage.getItem(FILE_PANEL_VISIBLE_KEY), true));
      setFileBrowserRatio(
        storedNumber(localStorage.getItem(FILE_BROWSER_RATIO_KEY), 38, 18, 78),
      );
      setFileBrowserVisible(
        storedBoolean(localStorage.getItem(FILE_BROWSER_VISIBLE_KEY), true),
      );
      setFilePreviewVisible(
        storedBoolean(localStorage.getItem(FILE_PREVIEW_VISIBLE_KEY), true),
      );
      const stored = parseStoredConversations(
        localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY),
      );
      try {
        const payload = await responseJson<{ workspaces: LocalProject[] }>(
          await fetch("/api/local/workspaces", { cache: "no-store" }),
        );
        const available = payload.workspaces;
        const remembered = localStorage.getItem(ACTIVE_PROJECT_KEY);
        const initialProject =
          available.find((project) => project.id === remembered) ?? available[0] ?? null;
        const projectIds = new Set(available.map((project) => project.id));
        const storedExpandedProjectIds =
          parseStoredNames(localStorage.getItem(EXPANDED_PROJECTS_KEY)) ?? [];
        const availableExpandedProjectIds = storedExpandedProjectIds.filter((projectId) =>
          projectIds.has(projectId),
        );
        let normalized = stored.flatMap((conversation) => {
          const projectId =
            conversation.projectId && projectIds.has(conversation.projectId)
              ? conversation.projectId
              : initialProject?.id;
          const bashApprovalMode: Conversation["bashApprovalMode"] =
            conversation.bashApprovalMode === "ask" ? "ask" : "auto";
          const bashPermissionMode: Conversation["bashPermissionMode"] =
            conversation.bashPermissionMode === "full" ? "full" : "sandbox";
          return projectId
            ? [
                {
                  ...conversation,
                  projectId,
                  bashApprovalMode,
                  bashPermissionMode,
                },
              ]
            : [];
        });
        if (initialProject && !normalized.some((item) => item.projectId === initialProject.id)) {
          normalized = [makeConversation(initialProject.id), ...normalized];
        }
        const firstConversation = initialProject
          ? normalized.find((item) => item.projectId === initialProject.id)
          : undefined;
        setProjects(available);
        setConversations(normalized);
        setActiveProjectId(initialProject?.id ?? "");
        setActiveId(firstConversation?.id ?? "");
        setExpandedProjectIds(
          availableExpandedProjectIds.length > 0
            ? availableExpandedProjectIds
            : initialProject
              ? [initialProject.id]
              : [],
        );
        if (initialProject) {
          localStorage.setItem(ACTIVE_PROJECT_KEY, initialProject.id);
          void loadProjectFiles(initialProject.id);
        }
      } catch (error) {
        setProjectError(error instanceof Error ? error.message : "本机项目 Runtime 不可用。");
      } finally {
        setProjectLoading(false);
        setHydrated(true);
      }
    }

    void initialize();
    fetch("/api/health")
      .then((response) => responseJson<HealthInfo>(response))
      .then(setHealth)
      .catch(() => setHealth(null));
  }, [loadProjectFiles]);

  useEffect(() => {
    async function loadCapabilities() {
      try {
        const catalog = await responseJson<CapabilityCatalog>(
          await fetch("/api/capabilities", { cache: "no-store" }),
        );
        const storedSkills = parseStoredNames(localStorage.getItem(ENABLED_SKILLS_KEY));
        const storedToolValue = localStorage.getItem(ENABLED_TOOLS_KEY);
        const storedTools = parseStoredNames(
          storedToolValue ?? localStorage.getItem(LEGACY_ENABLED_TOOLS_KEY),
        );
        const knownSkills = new Set(catalog.skills.map((item) => item.name));
        const knownTools = new Set(catalog.tools.map((item) => item.name));
        setCapabilityCatalog(catalog);
        setEnabledSkills(
          storedSkills
            ? storedSkills.filter((name) => knownSkills.has(name))
            : catalog.skills.filter((item) => item.defaultEnabled).map((item) => item.name),
        );
        const initialTools = storedTools
          ? storedTools.filter((name) => knownTools.has(name))
          : catalog.tools.filter((item) => item.defaultEnabled).map((item) => item.name);
        if (storedToolValue === null && knownTools.has("bash") && !initialTools.includes("bash")) {
          initialTools.push("bash");
        }
        setEnabledTools(initialTools);
        localStorage.setItem(ENABLED_TOOLS_KEY, JSON.stringify(initialTools));
      } catch (error) {
        setProjectError(error instanceof Error ? error.message : "无法加载 Agent 能力目录。");
      } finally {
        setCapabilitiesReady(true);
      }
    }

    void loadCapabilities();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(EXPANDED_PROJECTS_KEY, JSON.stringify(expandedProjectIds));
  }, [expandedProjectIds, hydrated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeConversation?.messages, status]);

  function updateConversation(id: string, updater: (conversation: Conversation) => Conversation) {
    setConversations((current) =>
      current
        .map((conversation) => (conversation.id === id ? updater(conversation) : conversation))
        .sort((a, b) => b.updatedAt - a.updatedAt),
    );
  }

  function newConversation(projectId = activeProjectId) {
    if (!projectId) return;
    if (isBusy) abortRef.current?.abort();
    const next = makeConversation(projectId);
    setConversations((current) => [next, ...current]);
    setExpandedProjectIds((current) =>
      current.includes(projectId) ? current : [...current, projectId],
    );
    setActiveProjectId(projectId);
    localStorage.setItem(ACTIVE_PROJECT_KEY, projectId);
    if (projectId !== activeProjectId) {
      setSelectedFilePath("");
      setFilePreview(null);
      void loadProjectFiles(projectId);
    }
    setActiveId(next.id);
    setInput("");
    setStatus("idle");
    setDurationMs(null);
    setTokenUsage(null);
    setSidebarOpen(false);
    setActiveView("workspace");
    requestAnimationFrame(() => textareaRef.current?.focus());
  }

  async function addProject() {
    if (isBusy) return;
    setProjectError("");
    setProjectLoading(true);
    try {
      const payload = await responseJson<{ workspace: LocalProject }>(
        await fetch("/api/local/workspaces/select", { method: "POST" }),
      );
      const project = payload.workspace;
      setProjects((current) =>
        current.some((item) => item.id === project.id) ? current : [project, ...current],
      );
      const existing = conversations.find((item) => item.projectId === project.id);
      if (existing) {
        setExpandedProjectIds((current) =>
          current.includes(project.id) ? current : [...current, project.id],
        );
        setActiveProjectId(project.id);
        setActiveId(existing.id);
        localStorage.setItem(ACTIVE_PROJECT_KEY, project.id);
        setSelectedFilePath("");
        setFilePreview(null);
        void loadProjectFiles(project.id);
      } else {
        newConversation(project.id);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "未能选择本地文件夹。";
      if (!/User canceled|用户已取消|-128/i.test(message)) setProjectError(message);
    } finally {
      setProjectLoading(false);
    }
  }

  function selectProject(projectId: string) {
    setExpandedProjectIds((current) =>
      current.includes(projectId) ? current : [...current, projectId],
    );
    if (isBusy || projectId === activeProjectId) {
      setSidebarOpen(false);
      setActiveView("workspace");
      return;
    }
    const first = conversations.find((conversation) => conversation.projectId === projectId);
    setActiveProjectId(projectId);
    localStorage.setItem(ACTIVE_PROJECT_KEY, projectId);
    setSelectedFilePath("");
    setFilePreview(null);
    void loadProjectFiles(projectId);
    if (first) setActiveId(first.id);
    else newConversation(projectId);
    setStatus("idle");
    setSidebarOpen(false);
    setActiveView("workspace");
  }

  function toggleProjectExpansion(projectId: string) {
    setExpandedProjectIds((current) =>
      current.includes(projectId)
        ? current.filter((item) => item !== projectId)
        : [...current, projectId],
    );
  }

  async function removeProjectBinding(project: LocalProject) {
    setProjectError("");
    if (isBusy && project.id === activeProjectId) abortRef.current?.abort();

    try {
      await responseJson<{ removed: string }>(
        await fetch(`/api/local/workspaces/${project.id}`, { method: "DELETE" }),
      );

      const remainingProjects = projects.filter((item) => item.id !== project.id);
      let remainingConversations = conversations.filter(
        (conversation) => conversation.projectId !== project.id,
      );

      if (project.id === activeProjectId) {
        const nextProject = remainingProjects[0] ?? null;
        if (nextProject) {
          let nextConversation = remainingConversations.find(
            (conversation) => conversation.projectId === nextProject.id,
          );
          if (!nextConversation) {
            nextConversation = makeConversation(nextProject.id);
            remainingConversations = [nextConversation, ...remainingConversations];
          }
          setActiveProjectId(nextProject.id);
          setActiveId(nextConversation.id);
          localStorage.setItem(ACTIVE_PROJECT_KEY, nextProject.id);
          void loadProjectFiles(nextProject.id);
        } else {
          setActiveProjectId("");
          setActiveId("");
          localStorage.removeItem(ACTIVE_PROJECT_KEY);
          setFiles([]);
        }
        setSelectedFilePath("");
        setFilePreview(null);
        setStatus("idle");
      }

      setProjects(remainingProjects);
      setConversations(remainingConversations);
      setExpandedProjectIds((current) => {
        const remainingExpanded = current.filter((projectId) => projectId !== project.id);
        const nextProject = project.id === activeProjectId ? remainingProjects[0] : null;
        return nextProject && !remainingExpanded.includes(nextProject.id)
          ? [...remainingExpanded, nextProject.id]
          : remainingExpanded;
      });
      setRemoveProjectCandidate(null);
    } catch (error) {
      setProjectError(error instanceof Error ? error.message : "未能移除项目绑定。");
    }
  }

  async function copyProjectPath() {
    if (!pathProject) return;
    await navigator.clipboard.writeText(pathProject.path);
    setCopiedProjectPath(true);
    window.setTimeout(() => setCopiedProjectPath(false), 1_500);
  }

  function deleteConversation(id: string) {
    const target = conversations.find((item) => item.id === id);
    if (!target) return;
    if (isBusy && id === activeId) abortRef.current?.abort();
    setConversations((current) => {
      const remaining = current.filter((item) => item.id !== id);
      const sameProject = remaining.filter((item) => item.projectId === target.projectId);
      if (sameProject.length > 0) {
        if (id === activeId) setActiveId(sameProject[0].id);
        return remaining;
      }
      const replacement = makeConversation(target.projectId);
      if (id === activeId) setActiveId(replacement.id);
      return [replacement, ...remaining];
    });
    setStatus("idle");
  }

  function selectConversation(id: string, projectId: string) {
    if (isBusy && id !== activeId) return;
    setExpandedProjectIds((current) =>
      current.includes(projectId) ? current : [...current, projectId],
    );
    setActiveProjectId(projectId);
    setActiveId(id);
    setStatus("idle");
    setDurationMs(null);
    setTokenUsage(null);
    setSidebarOpen(false);
    setActiveView("workspace");
  }

  function toggleCapability(kind: CapabilityKind, name: string) {
    const update = (current: string[], storageKey: string) => {
      const next = current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name];
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    };
    if (kind === "skill") {
      setEnabledSkills((current) => update(current, ENABLED_SKILLS_KEY));
    } else {
      setEnabledTools((current) => update(current, ENABLED_TOOLS_KEY));
    }
  }

  function toggleBashApprovalMode() {
    if (!activeConversation || isBusy) return;
    updateConversation(activeConversation.id, (conversation) => ({
      ...conversation,
      bashApprovalMode: conversation.bashApprovalMode === "auto" ? "ask" : "auto",
      updatedAt: timestampNow(),
    }));
  }

  function toggleBashPermissionMode() {
    if (!activeConversation || isBusy) return;
    if (activeConversation.bashPermissionMode === "sandbox") {
      setFullPermissionConversationId(activeConversation.id);
      return;
    }
    updateConversation(activeConversation.id, (conversation) => ({
      ...conversation,
      bashPermissionMode: "sandbox",
      updatedAt: timestampNow(),
    }));
  }

  function confirmFullBashPermission() {
    if (!fullPermissionConversationId) return;
    updateConversation(fullPermissionConversationId, (conversation) => ({
      ...conversation,
      bashPermissionMode: "full",
      updatedAt: timestampNow(),
    }));
    setFullPermissionConversationId("");
  }

  async function decideBashCommand(
    messageId: string,
    run: ToolRun,
    decision: "approve" | "reject",
  ) {
    if (!activeProject || !run.commandId || approvalSubmittingIds.includes(run.commandId)) return;
    setApprovalSubmittingIds((current) => [...current, run.commandId!]);
    try {
      await responseJson(
        await fetch(
          `/api/local/workspaces/${activeProject.id}/commands/${run.commandId}/decision`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ decision }),
          },
        ),
      );
      if (activeConversation) {
        updateConversation(activeConversation.id, (conversation) => ({
          ...conversation,
          messages: conversation.messages.map((message) =>
            message.id === messageId
              ? {
                  ...message,
                  toolRuns: message.toolRuns?.map((item) =>
                    item.commandId === run.commandId
                      ? { ...item, status: decision === "approve" ? "running" : "rejected" }
                      : item,
                  ),
                }
              : message,
          ),
          updatedAt: timestampNow(),
        }));
      }
    } catch (error) {
      setProjectError(error instanceof Error ? error.message : "Bash 审批失败。");
    } finally {
      setApprovalSubmittingIds((current) => current.filter((id) => id !== run.commandId));
    }
  }

  function openCapabilityView(kind: CapabilityKind) {
    setActiveView(kind);
    setSidebarOpen(false);
    setFilePanelOpen(false);
  }

  function toggleSidebarVisibility() {
    setSidebarVisible((current) => {
      const next = !current;
      localStorage.setItem(SIDEBAR_VISIBLE_KEY, String(next));
      return next;
    });
  }

  function toggleFilePanelVisibility() {
    setFilePanelVisible((current) => {
      const next = !current;
      localStorage.setItem(FILE_PANEL_VISIBLE_KEY, String(next));
      return next;
    });
  }

  function toggleFileBrowserVisibility() {
    setFileBrowserVisible((current) => {
      const next = !current;
      if (!next && !filePreviewVisible) {
        setFilePreviewVisible(true);
        localStorage.setItem(FILE_PREVIEW_VISIBLE_KEY, "true");
      }
      localStorage.setItem(FILE_BROWSER_VISIBLE_KEY, String(next));
      return next;
    });
  }

  function toggleFilePreviewVisibility() {
    setFilePreviewVisible((current) => {
      const next = !current;
      if (!next && !fileBrowserVisible) {
        setFileBrowserVisible(true);
        localStorage.setItem(FILE_BROWSER_VISIBLE_KEY, "true");
      }
      localStorage.setItem(FILE_PREVIEW_VISIBLE_KEY, String(next));
      return next;
    });
  }

  function beginColumnResize(
    side: "left" | "right",
    event: ReactPointerEvent<HTMLDivElement>,
  ) {
    if (side === "right" && window.matchMedia("(max-width: 1180px)").matches) return;
    if (side === "left" && window.matchMedia("(max-width: 720px)").matches) return;
    event.preventDefault();
    let latest = side === "left" ? sidebarWidth : filePanelWidth;
    document.body.classList.add("is-resizing-column");

    const move = (pointerEvent: PointerEvent) => {
      if (side === "left") {
        const rightOccupiesGrid =
          !window.matchMedia("(max-width: 1180px)").matches && filePanelVisible;
        const maximum = Math.max(
          190,
          Math.min(380, window.innerWidth - (rightOccupiesGrid ? filePanelWidth : 0) - 520),
        );
        latest = clamp(pointerEvent.clientX, 190, maximum);
        setSidebarWidth(latest);
      } else {
        const maximum = Math.max(300, Math.min(680, window.innerWidth - (sidebarVisible ? sidebarWidth : 0) - 520));
        latest = clamp(window.innerWidth - pointerEvent.clientX, 300, maximum);
        setFilePanelWidth(latest);
      }
    };
    const finish = () => {
      document.body.classList.remove("is-resizing-column");
      localStorage.setItem(side === "left" ? SIDEBAR_WIDTH_KEY : FILE_PANEL_WIDTH_KEY, String(Math.round(latest)));
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
  }

  function beginFileRegionResize(event: ReactPointerEvent<HTMLDivElement>) {
    const container = workspaceFilesLayoutRef.current;
    if (!container) return;
    event.preventDefault();
    let latest = fileBrowserRatio;
    document.body.classList.add("is-resizing-row");
    const move = (pointerEvent: PointerEvent) => {
      const bounds = container.getBoundingClientRect();
      latest = clamp(((pointerEvent.clientY - bounds.top) / bounds.height) * 100, 18, 78);
      setFileBrowserRatio(latest);
    };
    const finish = () => {
      document.body.classList.remove("is-resizing-row");
      localStorage.setItem(FILE_BROWSER_RATIO_KEY, String(Math.round(latest)));
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
  }

  async function sendMessage(rawInput = input) {
    const content = rawInput.trim();
    if (!content || !activeConversation || !activeProject || !capabilitiesReady || isBusy) return;

    const conversationId = activeConversation.id;
    const history = activeConversation.messages;
    const userMessage: ChatMessage = {
      id: makeId(),
      role: "user",
      content,
      createdAt: timestampNow(),
    };
    const assistantId = makeId();
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      createdAt: timestampNow(),
      toolRuns: [],
    };

    updateConversation(conversationId, (conversation) => ({
      ...conversation,
      title: conversation.messages.length === 0 ? makeTitle(content) : conversation.title,
      messages: [...conversation.messages, userMessage, assistantMessage],
      updatedAt: timestampNow(),
    }));
    setInput("");
    setStatus("connecting");
    setDurationMs(null);
    setTokenUsage(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          workspaceId: activeProject.id,
          workspaceName: activeProject.name,
          enabledSkills,
          enabledTools,
          bashApprovalMode: activeConversation.bashApprovalMode,
          bashPermissionMode: activeConversation.bashPermissionMode,
          messages: history.map(({ role, content: messageContent }) => ({
            role,
            content: messageContent,
          })),
          input: content,
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? "本地 Agent 服务暂时不可用");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });
        const parsed = extractSseEvents(buffer);
        buffer = parsed.remainder;

        for (const event of parsed.events) {
          if (event.type === "start") setStatus("streaming");
          if (event.type === "tool_start") {
            setStatus("streaming");
            updateConversation(conversationId, (conversation) => ({
              ...conversation,
              messages: conversation.messages.map((message) =>
                message.id === assistantId
                  ? { ...message, toolRuns: applyToolStart(message.toolRuns, event) }
                  : message,
              ),
              updatedAt: timestampNow(),
            }));
          }
          if (event.type === "tool_end") {
            updateConversation(conversationId, (conversation) => ({
              ...conversation,
              messages: conversation.messages.map((message) =>
                message.id === assistantId
                  ? { ...message, toolRuns: applyToolEnd(message.toolRuns, event) }
                  : message,
              ),
              updatedAt: timestampNow(),
            }));
            if (event.toolName === "write_project_file") void loadProjectFiles(activeProject.id);
          }
          if (event.type === "tool_approval_required") {
            updateConversation(conversationId, (conversation) => ({
              ...conversation,
              messages: conversation.messages.map((message) =>
                message.id === assistantId
                  ? { ...message, toolRuns: applyToolApproval(message.toolRuns, event) }
                  : message,
              ),
              updatedAt: timestampNow(),
            }));
          }
          if (event.type === "delta") {
            setStatus("streaming");
            updateConversation(conversationId, (conversation) => ({
              ...conversation,
              messages: conversation.messages.map((message) =>
                message.id === assistantId
                  ? { ...message, content: message.content + event.text }
                  : message,
              ),
              updatedAt: timestampNow(),
            }));
          }
          if (event.type === "done") {
            setStatus("done");
            setDurationMs(event.durationMs);
            setTokenUsage(event.usage?.totalTokens ?? null);
            void loadProjectFiles(activeProject.id);
          }
          if (event.type === "error") throw new Error(event.message);
        }
        if (done) break;
      }
    } catch (error) {
      if (controller.signal.aborted) {
        setStatus("stopped");
      } else {
        const message = error instanceof Error ? error.message : "模型调用失败";
        setStatus("error");
        updateConversation(conversationId, (conversation) => ({
          ...conversation,
          messages: conversation.messages.map((item) =>
            item.id === assistantId && !item.content
              ? { ...item, content: `抱歉，本轮调用失败：${message}` }
              : item,
          ),
          updatedAt: timestampNow(),
        }));
      }
    } finally {
      abortRef.current = null;
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void sendMessage();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    const shouldSubmit = shouldSubmitComposerKey({
      key: event.key,
      shiftKey: event.shiftKey,
      compositionActive: composerIsComposingRef.current,
      nativeIsComposing: event.nativeEvent.isComposing,
      keyCode: event.nativeEvent.keyCode,
    });
    if (!shouldSubmit) return;

    event.preventDefault();
    void sendMessage();
  }

  async function copyPreview() {
    if (!filePreview?.content) return;
    await navigator.clipboard.writeText(filePreview.content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1_500);
  }

  return (
    <main
      className={`app-shell ${activeView !== "workspace" ? "library-mode" : ""} ${sidebarVisible ? "" : "sidebar-collapsed"} ${filePanelVisible ? "" : "file-panel-collapsed"}`}
      style={
        {
          "--sidebar-width": `${sidebarWidth}px`,
          "--file-panel-width": `${filePanelWidth}px`,
        } as CSSProperties
      }
    >
      <div
        className={`mobile-backdrop ${sidebarOpen || filePanelOpen ? "visible" : ""}`}
        onClick={() => {
          setSidebarOpen(false);
          setFilePanelOpen(false);
        }}
        aria-hidden="true"
      />

      <aside className={`sidebar ${sidebarOpen ? "mobile-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">知</div>
          <div>
            <strong>知衡</strong>
            <span>Local Agent Workspace</span>
          </div>
          <button
            className="desktop-panel-collapse sidebar-collapse"
            type="button"
            onClick={toggleSidebarVisibility}
            aria-label="隐藏左侧栏"
            title="隐藏左侧栏"
          >
            <PanelLeftClose size={15} />
          </button>
        </div>

        <button className="new-project-button" type="button" onClick={() => void addProject()}>
          <FolderPlus size={17} />
          绑定本地项目
        </button>
        <button
          className="new-chat-button"
          type="button"
          onClick={() => newConversation()}
          disabled={!activeProject}
        >
          <Plus size={17} />
          新建项目会话
        </button>

        <div className="sidebar-section-label">本地项目</div>
        <nav className="project-list" aria-label="本地项目与会话列表">
          {projects.map((project) => {
            const projectConversations = conversations.filter(
              (conversation) => conversation.projectId === project.id,
            );
            const active = project.id === activeProjectId;
            const expanded = expandedProjectIds.includes(project.id);
            return (
              <section
                className={`project-group ${active ? "active" : ""} ${expanded ? "expanded" : ""} ${projectMenuId === project.id ? "menu-open" : ""}`}
                key={project.id}
              >
                <div className="project-heading">
                  <button
                    className="project-toggle"
                    type="button"
                    aria-label={`${expanded ? "收起" : "展开"}${project.name}的会话`}
                    aria-expanded={expanded}
                    onClick={() => toggleProjectExpansion(project.id)}
                  >
                    {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                  </button>
                  <button
                    className="project-select"
                    type="button"
                    onClick={() => selectProject(project.id)}
                  >
                    <FolderOpen size={15} />
                    <span>
                      <strong>{project.name}</strong>
                    </span>
                  </button>
                </div>
                <button
                  className="project-menu-trigger"
                  type="button"
                  aria-label={`打开${project.name}项目菜单`}
                  aria-expanded={projectMenuId === project.id}
                  onClick={(event) => {
                    event.stopPropagation();
                    setProjectMenuId((current) => (current === project.id ? "" : project.id));
                  }}
                >
                  <MoreHorizontal size={16} />
                </button>
                {projectMenuId === project.id && (
                  <>
                    <button
                      className="project-menu-backdrop"
                      type="button"
                      aria-label="关闭项目菜单"
                      onClick={() => setProjectMenuId("")}
                    />
                    <div className="project-context-menu" role="menu">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setProjectMenuId("");
                          newConversation(project.id);
                        }}
                      >
                        <Plus size={14} />
                        新建项目下会话
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setCopiedProjectPath(false);
                          setPathProject(project);
                          setProjectMenuId("");
                        }}
                      >
                        <FolderOpen size={14} />
                        查看项目地址
                      </button>
                      <button
                        className="danger"
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setRemoveProjectCandidate(project);
                          setProjectMenuId("");
                        }}
                      >
                        <Trash2 size={14} />
                        移除项目
                      </button>
                    </div>
                  </>
                )}
                {expanded && (
                  <div className="conversation-list">
                    {projectConversations.map((conversation) => (
                      <div
                        className={`conversation-row ${conversation.id === activeId ? "active" : ""}`}
                        key={conversation.id}
                      >
                        <button
                          className="conversation-select"
                          type="button"
                          onClick={() => selectConversation(conversation.id, project.id)}
                        >
                          <MessageSquareText size={14} />
                          <span>
                            <strong>{conversation.title}</strong>
                            <small>
                              {conversation.messages.length > 0
                                ? `${Math.ceil(conversation.messages.length / 2)} 轮对话`
                                : "尚未开始"}
                            </small>
                          </span>
                        </button>
                        <button
                          className="delete-chat"
                          type="button"
                          aria-label={`删除${conversation.title}`}
                          onClick={() => deleteConversation(conversation.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
          {!projectLoading && projects.length === 0 && (
            <div className="project-list-empty">
              <Folder size={20} />
              <span>还没有绑定项目</span>
            </div>
          )}
        </nav>

        {projectError && <div className="sidebar-error">{projectError}</div>}
        <nav className="sidebar-capability-nav" aria-label="Agent 能力管理">
          <button
            className={activeView === "skill" ? "active" : ""}
            type="button"
            onClick={() => openCapabilityView("skill")}
          >
            <BookOpenCheck size={15} />
            <span>技能</span>
            <small>{enabledSkills.length}/{capabilityCatalog.skills.length}</small>
          </button>
          <button
            className={activeView === "tool" ? "active" : ""}
            type="button"
            onClick={() => openCapabilityView("tool")}
          >
            <Wrench size={15} />
            <span>工具</span>
            <small>{enabledTools.length}/{capabilityCatalog.tools.length}</small>
          </button>
        </nav>
      </aside>

      {sidebarVisible && (
        <div
          className="column-resizer left"
          style={{ left: `${sidebarWidth - 4}px` }}
          role="separator"
          aria-label="调整左侧栏宽度"
          aria-orientation="vertical"
          onPointerDown={(event) => beginColumnResize("left", event)}
        >
          <GripVertical size={12} />
        </div>
      )}
      {!sidebarVisible && (
        <button
          className="panel-restore left"
          type="button"
          onClick={toggleSidebarVisibility}
          aria-label="展开左侧栏"
          title="展开左侧栏"
        >
          <PanelLeftOpen size={16} />
        </button>
      )}

      {activeView === "workspace" ? (
        <>
      <section className="chat-column">
        <header className="chat-header">
          <div className="header-title-group">
            <button
              className="mobile-icon-button sidebar-trigger"
              type="button"
              aria-label="打开项目列表"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={19} />
            </button>
            <div>
              <h1>{activeConversation?.title ?? activeProject?.name ?? "本地项目工作台"}</h1>
              <span className="header-subtitle">
                <span
                  className={`status-dot ${activeProject && (isBusy || health?.keyConfigured) ? "online" : "offline"}`}
                />
                {activeProject
                  ? isBusy
                    ? runningTool
                      ? `正在调用 ${runningTool.label}`
                      : statusCopy.detail
                    : `${activeProject.name} · ${statusCopy.label}`
                  : "先绑定一个本地项目文件夹"}
              </span>
            </div>
          </div>
          <div className="model-pill">
            <Cpu size={14} />
            <span>{health?.model ?? "DeepSeek"}</span>
            <ChevronDown size={13} />
          </div>
          <button
            className="mobile-icon-button artifact-trigger"
            type="button"
            aria-label="打开项目文件面板"
            onClick={() => setFilePanelOpen(true)}
          >
            <PanelRight size={19} />
          </button>
        </header>

        <div className="chat-scroll-area">
          {!activeProject ? (
            <div className="workspace-onboarding">
              <div className="workspace-onboarding-icon">
                <FolderPlus size={26} />
              </div>
              <span>LOCAL PROJECT</span>
              <h2>把对话放进项目里</h2>
              <p>
                选择一个本地文件夹作为 Agent 的工作目录。这个项目下可以创建多个独立会话，Agent
                产出的报告和代码会保存在文件夹中，并在右侧实时预览。
              </p>
              <button type="button" onClick={() => void addProject()} disabled={projectLoading}>
                <FolderOpen size={17} />
                {projectLoading ? "正在连接本机 Runtime…" : "选择本地文件夹"}
              </button>
            </div>
          ) : activeConversation?.messages.length ? (
            <div className="message-thread">
              {activeConversation.messages.map((message) => (
                <article className={`message ${message.role}`} key={message.id}>
                  <div className="message-avatar" aria-hidden="true">
                    {message.role === "user" ? <UserRound size={17} /> : <Bot size={18} />}
                  </div>
                  <div className="message-body">
                    <div className="message-meta">
                      <strong>{message.role === "user" ? "你" : "知衡 Agent"}</strong>
                      <time>{formatTime(message.createdAt)}</time>
                    </div>
                    <div className={`message-content ${!message.content ? "is-streaming" : ""}`}>
                      {message.role === "assistant" && Boolean(message.toolRuns?.length) && (
                        <div className="tool-run-list" aria-label="Agent 工具执行记录">
                          {message.toolRuns?.map((run) => (
                            <section className={`tool-run-card ${run.status}`} key={run.toolCallId}>
                              <header>
                                <span className="tool-run-icon">
                                  {run.toolName === "bash" ? (
                                    <Terminal size={14} />
                                  ) : run.toolName === "load_skill" ? (
                                    <BookOpenCheck size={14} />
                                  ) : run.toolName === "write_project_file" ? (
                                    <Save size={14} />
                                  ) : run.status === "running" ? (
                                    <Search size={14} />
                                  ) : run.status === "success" ? (
                                    <CircleCheck size={14} />
                                  ) : (
                                    <CircleX size={14} />
                                  )}
                                </span>
                                <span className="tool-run-title">
                                  <strong>{run.label}</strong>
                                  <code>{run.toolName}</code>
                                </span>
                                <span className="tool-run-status">
                                  {run.status === "awaiting_approval"
                                    ? "等待确认"
                                    : run.status === "running"
                                    ? "调用中"
                                    : run.status === "success"
                                      ? "已完成"
                                      : run.status === "rejected"
                                        ? "已拒绝"
                                        : "失败"}
                                </span>
                              </header>
                              {run.query && (
                                <p
                                  className={`tool-run-query ${run.toolName === "bash" ? "command" : ""}`}
                                >
                                  {run.query}
                                </p>
                              )}
                              <div className="tool-run-meta">
                                {run.status === "awaiting_approval" ? (
                                  <span>
                                    {run.permissionMode === "full" ? "完整本机权限" : "项目沙箱"}
                                  </span>
                                ) : run.status === "running" ? (
                                  <span>Agent 正在处理…</span>
                                ) : (
                                  <>
                                    {run.toolName === "bash" && (
                                      <span>
                                        {run.permissionMode === "full"
                                          ? "完整本机权限"
                                          : "项目沙箱"}
                                      </span>
                                    )}
                                    {run.summary && <span>{run.summary}</span>}
                                    {run.resultCount !== undefined && (
                                      <span>{run.resultCount} 个结果</span>
                                    )}
                                    {run.durationMs !== undefined && (
                                      <span>
                                        <Clock3 size={11} /> {formatDuration(run.durationMs)}
                                      </span>
                                    )}
                                    {run.toolName === "bash" && run.exitCode !== undefined && (
                                      <span>退出码 {run.exitCode ?? "无"}</span>
                                    )}
                                    {run.timedOut && <span>已超时</span>}
                                    {run.truncated && <span>输出已截断</span>}
                                  </>
                                )}
                              </div>
                              {run.status === "awaiting_approval" && run.commandId && (
                                <div className="tool-run-approval-wrap">
                                  <code>{activeProject?.path}</code>
                                  <div className="tool-run-approval">
                                    <button
                                      type="button"
                                      className="secondary"
                                      disabled={approvalSubmittingIds.includes(run.commandId)}
                                      onClick={() =>
                                        void decideBashCommand(message.id, run, "reject")
                                      }
                                    >
                                      拒绝
                                    </button>
                                    <button
                                      type="button"
                                      disabled={approvalSubmittingIds.includes(run.commandId)}
                                      onClick={() =>
                                        void decideBashCommand(message.id, run, "approve")
                                      }
                                    >
                                      允许
                                    </button>
                                  </div>
                                </div>
                              )}
                              {run.toolName === "bash" &&
                                (run.stdout || run.stderr || run.truncated) && (
                                  <details className="tool-run-output">
                                    <summary>查看命令输出</summary>
                                    {run.stdout && <pre>{run.stdout}</pre>}
                                    {run.stderr && (
                                      <pre>
                                        <strong>STDERR</strong>{"\n"}
                                        {run.stderr}
                                      </pre>
                                    )}
                                    {run.truncated && <p>输出超过 200KB，后续内容已截断。</p>}
                                  </details>
                                )}
                              {Boolean(run.sources?.length) && (
                                <div className="tool-run-sources">
                                  {run.sources?.map((source) => (
                                    <a
                                      href={source.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      key={source.url}
                                    >
                                      <span>{source.title}</span>
                                      <ExternalLink size={11} />
                                    </a>
                                  ))}
                                </div>
                              )}
                            </section>
                          ))}
                        </div>
                      )}
                      {message.content ? <ReactMarkdown>{message.content}</ReactMarkdown> : null}
                      {!message.content && (
                        <span className="thinking-indicator">
                          <i />
                          <i />
                          <i />
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="welcome-state">
              <div className="welcome-eyebrow">
                <FolderOpen size={13} />
                {activeProject.name}
              </div>
              <h2>
                今天想完成
                <br />
                什么研究？
              </h2>
              <p>
                当前会话已绑定本地项目。Agent 可以读取项目资料，
                <br />
                并把报告、代码和数据保存到项目文件夹。
              </p>
              <div className="suggestion-grid">
                {SUGGESTIONS.map(({ icon: Icon, title, prompt }) => (
                  <button
                    className="suggestion-card"
                    type="button"
                    key={title}
                    onClick={() => void sendMessage(prompt)}
                  >
                    <Icon size={18} />
                    <strong>{title}</strong>
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="composer-wrap">
          <form className="composer" onSubmit={handleSubmit}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onCompositionStart={() => {
                composerIsComposingRef.current = true;
              }}
              onCompositionEnd={() => {
                composerIsComposingRef.current = false;
              }}
              onKeyDown={handleKeyDown}
              placeholder={activeProject ? "描述任务，Agent 会在当前项目中工作…" : "请先绑定本地项目"}
              rows={1}
              disabled={!activeConversation || !activeProject || !capabilitiesReady || isBusy}
              aria-label="投研任务"
            />
            <div className="composer-footer">
              <div className="composer-options">
                <span>Enter 发送 · Shift + Enter 换行</span>
                {activeConversation && (
                  <>
                    <button
                      type="button"
                      onClick={toggleBashApprovalMode}
                      disabled={isBusy}
                      title="切换 Bash 命令是否逐条确认"
                    >
                      {activeConversation.bashApprovalMode === "auto" ? "自动执行" : "每条确认"}
                    </button>
                    <button
                      type="button"
                      onClick={toggleBashPermissionMode}
                      disabled={isBusy}
                      title="切换 Bash 文件访问权限"
                    >
                      {activeConversation.bashPermissionMode === "full"
                        ? "完整本机权限"
                        : "项目沙箱"}
                    </button>
                  </>
                )}
              </div>
              {isBusy ? (
                <button className="send-button stop" type="button" onClick={() => abortRef.current?.abort()}>
                  <CircleStop size={18} />
                </button>
              ) : (
                <button
                  className="send-button"
                  type="submit"
                  disabled={!input.trim() || !activeProject || !capabilitiesReady}
                >
                  <Send size={17} />
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <aside className={`artifact-panel workspace-panel ${filePanelOpen ? "mobile-open" : ""}`}>
        <div className="artifact-panel-header workspace-panel-header">
          <div>
            <span>PROJECT FILES</span>
            <h2>{activeProject?.name ?? "项目文件"}</h2>
          </div>
          <div className="artifact-header-actions">
            <button
              className="desktop-panel-collapse"
              type="button"
              onClick={toggleFilePanelVisibility}
              aria-label="隐藏右侧栏"
              title="隐藏右侧栏"
            >
              <PanelRightClose size={15} />
            </button>
            <button
              className="refresh-files"
              type="button"
              onClick={() => activeProject && void loadProjectFiles(activeProject.id)}
              disabled={!activeProject || filesLoading}
              aria-label="刷新项目文件"
              title="刷新"
            >
              <RefreshCw size={14} className={filesLoading ? "spinning" : ""} />
            </button>
            {activeProject && fileBrowserVisible && (
              <button
                className="refresh-files"
                type="button"
                onClick={toggleFileBrowserVisibility}
                aria-label="隐藏文件目录"
                title="隐藏文件目录"
              >
                <PanelTopClose size={14} />
              </button>
            )}
            <button
              className="artifact-panel-close"
              type="button"
              aria-label="关闭项目文件面板"
              onClick={() => setFilePanelOpen(false)}
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {!activeProject ? (
          <div className="artifact-empty-state">
            <div>
              <FolderPlus size={24} />
            </div>
            <h3>尚未绑定项目</h3>
            <p>选择本地文件夹后，这里会显示 Agent 可访问和产出的文件。</p>
          </div>
        ) : (
          <div
            ref={workspaceFilesLayoutRef}
            className={`workspace-files-layout ${fileBrowserVisible ? "" : "browser-hidden"} ${filePreviewVisible ? "" : "preview-hidden"}`}
            style={{ "--file-browser-ratio": `${fileBrowserRatio}%` } as CSSProperties}
          >
            {fileBrowserVisible ? (
            <div className="workspace-file-browser">
              {files.length > 0 ? (
                <nav className="workspace-file-list" aria-label="项目文件列表">
                  {files.map((file) => {
                    const Icon = fileIcon(file);
                    const depth = Math.max(0, file.path.split("/").length - 1);
                    return file.kind === "directory" ? (
                      <div
                        className="workspace-file-row directory"
                        style={{ paddingLeft: `${10 + depth * 14}px` }}
                        key={file.path}
                      >
                        <Icon size={14} />
                        <span>{file.name}</span>
                      </div>
                    ) : (
                      <button
                        className={`workspace-file-row ${selectedFilePath === file.path ? "active" : ""}`}
                        style={{ paddingLeft: `${10 + depth * 14}px` }}
                        type="button"
                        onClick={() => void selectFile(activeProject.id, file)}
                        title={file.path}
                        key={file.path}
                      >
                        <Icon size={14} />
                        <span>{file.name}</span>
                        <small>{formatBytes(file.size)}</small>
                      </button>
                    );
                  })}
                </nav>
              ) : (
                <div className="workspace-files-empty">
                  <FolderOpen size={22} />
                  <strong>项目文件夹为空</strong>
                  <span>Agent 保存产出后会自动刷新</span>
                </div>
              )}
            </div>
            ) : (
              <button
                className="workspace-section-restore browser"
                type="button"
                onClick={toggleFileBrowserVisibility}
              >
                <ChevronDown size={13} /> 展开文件目录
              </button>
            )}

            {fileBrowserVisible && filePreviewVisible && (
              <div
                className="workspace-section-resizer"
                role="separator"
                aria-label="调整文件目录和预览区域高度"
                aria-orientation="horizontal"
                onPointerDown={beginFileRegionResize}
              >
                <GripHorizontal size={15} />
              </div>
            )}

            {filePreviewVisible ? (
            <section className="workspace-preview">
              <button
                className="workspace-preview-collapse"
                type="button"
                onClick={toggleFilePreviewVisibility}
                aria-label="隐藏文件预览"
                title="隐藏文件预览"
              >
                <PanelBottomClose size={13} />
              </button>
              {previewLoading ? (
                <div className="workspace-preview-empty">
                  <RefreshCw size={20} className="spinning" />
                  <span>正在读取文件…</span>
                </div>
              ) : filePreview ? (
                <>
                  <header className="workspace-preview-toolbar">
                    <div>
                      <FileText size={14} />
                      <span title={filePreview.path}>{filePreview.path}</span>
                    </div>
                    {filePreview.content && (
                      <button type="button" onClick={() => void copyPreview()}>
                        <Copy size={13} /> {copied ? "已复制" : "复制"}
                      </button>
                    )}
                  </header>
                  <div className={`workspace-preview-content ${filePreview.kind}`}>
                    {filePreview.kind === "text" && filePreview.content !== undefined &&
                      ([".md", ".mdx"].includes(filePreview.extension) ? (
                        <div className="markdown-preview">
                          <ReactMarkdown>{filePreview.content}</ReactMarkdown>
                        </div>
                      ) : CODE_EXTENSIONS.has(filePreview.extension) ? (
                        <pre>
                          <code>{filePreview.content}</code>
                        </pre>
                      ) : (
                        <pre className="plain-text-preview">{filePreview.content}</pre>
                      ))}
                    {filePreview.kind === "image" && previewDataUrl && (
                      // The data comes from the user-selected local workspace.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={previewDataUrl} alt={filePreview.name} />
                    )}
                    {filePreview.kind === "pdf" && previewDataUrl && (
                      <iframe src={previewDataUrl} title={filePreview.name} />
                    )}
                    {(filePreview.kind === "unsupported" || filePreview.kind === "too-large") && (
                      <div className="unsupported-preview">
                        <File size={28} />
                        <strong>暂不支持在线预览</strong>
                        <span>
                          {filePreview.kind === "too-large"
                            ? `文件超过 5MB（${formatBytes(filePreview.size)}）`
                            : "可以继续让 Agent 通过其他工具处理此文件"}
                        </span>
                      </div>
                    )}
                  </div>
                  <footer className="artifact-meta">
                    <span>{formatBytes(filePreview.size)}</span>
                    <span>{new Date(filePreview.modifiedAt).toLocaleString("zh-CN")}</span>
                    {durationMs !== null && <span>{(durationMs / 1_000).toFixed(1)}s</span>}
                    {tokenUsage !== null && <span>{tokenUsage} tokens</span>}
                  </footer>
                </>
              ) : (
                <div className="workspace-preview-empty">
                  <Braces size={24} />
                  <strong>选择文件进行预览</strong>
                  <span>支持 Markdown、代码、文本、图片和 PDF</span>
                </div>
              )}
            </section>
            ) : (
              <button
                className="workspace-section-restore preview"
                type="button"
                onClick={toggleFilePreviewVisibility}
              >
                <ChevronRight size={13} /> 展开文件预览
              </button>
            )}
          </div>
        )}
      </aside>
      {filePanelVisible && (
        <div
          className="column-resizer right"
          style={{ right: `${filePanelWidth - 4}px` }}
          role="separator"
          aria-label="调整右侧栏宽度"
          aria-orientation="vertical"
          onPointerDown={(event) => beginColumnResize("right", event)}
        >
          <GripVertical size={12} />
        </div>
      )}
      {!filePanelVisible && (
        <button
          className="panel-restore right"
          type="button"
          onClick={toggleFilePanelVisibility}
          aria-label="展开右侧栏"
          title="展开右侧栏"
        >
          <PanelRightOpen size={16} />
        </button>
      )}
        </>
      ) : (
        <CapabilityLibrary
          key={activeView}
          kind={activeView}
          items={activeView === "skill" ? capabilityCatalog.skills : capabilityCatalog.tools}
          enabledNames={activeView === "skill" ? enabledSkills : enabledTools}
          onToggle={(name) => toggleCapability(activeView, name)}
          onClose={() => setActiveView("workspace")}
        />
      )}
      {pathProject && (
        <div
          className="project-dialog-backdrop"
          role="presentation"
          onMouseDown={() => setPathProject(null)}
        >
          <section
            className="project-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-path-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <span>项目地址</span>
                <h2 id="project-path-title">{pathProject.name}</h2>
              </div>
              <button type="button" aria-label="关闭" onClick={() => setPathProject(null)}>
                <X size={16} />
              </button>
            </header>
            <div className="project-dialog-body">
              <code>{pathProject.path}</code>
            </div>
            <footer>
              <button className="secondary" type="button" onClick={() => setPathProject(null)}>
                关闭
              </button>
              <button type="button" onClick={() => void copyProjectPath()}>
                <Copy size={14} />
                {copiedProjectPath ? "已复制" : "复制地址"}
              </button>
            </footer>
          </section>
        </div>
      )}
      {removeProjectCandidate && (
        <div
          className="project-dialog-backdrop"
          role="presentation"
          onMouseDown={() => setRemoveProjectCandidate(null)}
        >
          <section
            className="project-dialog confirm"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="remove-project-title"
            aria-describedby="remove-project-description"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <span>移除项目</span>
                <h2 id="remove-project-title">{removeProjectCandidate.name}</h2>
              </div>
              <button
                type="button"
                aria-label="关闭"
                onClick={() => setRemoveProjectCandidate(null)}
              >
                <X size={16} />
              </button>
            </header>
            <div className="project-dialog-body">
              <p id="remove-project-description">
                只会解除这个项目与应用的绑定，不会删除本地文件夹或其中的任何内容。
              </p>
            </div>
            <footer>
              <button
                className="secondary"
                type="button"
                onClick={() => setRemoveProjectCandidate(null)}
              >
                取消
              </button>
              <button
                className="danger"
                type="button"
                onClick={() => void removeProjectBinding(removeProjectCandidate)}
              >
                移除项目
              </button>
            </footer>
          </section>
        </div>
      )}
      {fullPermissionConversationId && (
        <div
          className="project-dialog-backdrop"
          role="presentation"
          onMouseDown={() => setFullPermissionConversationId("")}
        >
          <section
            className="project-dialog confirm"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="full-bash-permission-title"
            aria-describedby="full-bash-permission-description"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <span>Bash 权限</span>
                <h2 id="full-bash-permission-title">开启完整本机权限？</h2>
              </div>
              <button
                type="button"
                aria-label="关闭"
                onClick={() => setFullPermissionConversationId("")}
              >
                <X size={16} />
              </button>
            </header>
            <div className="project-dialog-body">
              <p id="full-bash-permission-description">
                Bash 将能以当前 macOS 用户权限读取和修改项目目录之外的文件，并可访问网络。此设置只影响当前会话，请仅在任务确实需要时开启。
              </p>
            </div>
            <footer>
              <button
                className="secondary"
                type="button"
                onClick={() => setFullPermissionConversationId("")}
              >
                取消
              </button>
              <button className="danger" type="button" onClick={confirmFullBashPermission}>
                开启完整权限
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}
