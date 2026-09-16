"use client";

import {
  Activity,
  BookOpenCheck,
  Bot,
  Braces,
  ChevronDown,
  CircleStop,
  CircleX,
  Copy,
  Cpu,
  Database,
  Download,
  File,
  FileChartColumn,
  FileText,
  Folder,
  FolderOpen,
  FolderPlus,
  Menu,
  MoreHorizontal,
  GripVertical,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRight,
  PanelRightClose,
  PanelRightOpen,
  Plug,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
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
import { CapabilityLibrary, type SkillResourcePreview } from "@/components/capability-library";
import { FileSystemTree, fileTreeIcon } from "@/components/file-system-tree";
import { activeFileNavigation, nextFileNavigation, type FileNavigation, type ProjectFileTarget } from "@/lib/markdown-links";
import { AgentPromptPage, SubAgentLibrary } from "@/components/agent-library";
import { MarkdownMessage } from "@/components/chat-markdown";
import { CodePreview } from "@/components/code-preview";
import { ModelLibrary, type ModelProviderItem } from "@/components/model-library";
import { ToolRunStack } from "@/components/tool-run-stack";
import { UserUsagePage } from "@/components/user-usage-page";
import { DatabasePage } from "@/components/database-page";
import { ComposerSurface } from "@/components/chat-composer";
import { workflowApi, type WorkflowConversation } from "@/lib/workflow-client";
import { WorkflowWorkspace } from "@/components/workflow-workspace";
import { TracePage } from "@/components/trace-page";
import type { CapabilityCatalog, CapabilityItem, CapabilityKind } from "@/lib/capability-types";
import {
  cloneProjectAgentConfig,
  createCustomSubAgent,
  createDefaultProjectAgentConfig,
  createEmptyProjectAgentConfig,
  supplementDefaultAgents,
  MAX_CUSTOM_SUB_AGENTS,
  createProjectAgentConfigFromLegacy,
  upgradeLegacyDefaultSkillSelection,
  upgradeLegacyDefaultToolSelection,
  type AgentProfile,
  type AgentRoleId,
  type CustomSubAgent,
  type ProjectAgentConfig,
} from "@/lib/agent-profiles";
import { createDefaultAgentPromptConfig, type AgentPromptConfig } from "@/lib/agent-prompts";
import { shouldSubmitComposerKey } from "@/lib/composer-keyboard";
import { createConversationPersistence, type ConversationPersistence } from "@/lib/chat-persistence";
import {
  getLoadedFileTreeEntries,
  getProjectFileTree,
  getVisibleFileTreeEntries,
  removeProjectFileTree,
  resetProjectFileTree,
  setDirectoryEntries,
  setDirectoryError,
  setDirectoryLoading,
  toggleDirectoryExpansion,
  type FileTreeEntry,
  type ProjectFileTreeState,
} from "@/lib/file-tree";
import {
  MAX_OPEN_FILE_TABS,
  activateFileTab,
  closeFileTab,
  getProjectFileTabs,
  openFileTab,
  parseProjectFileTabs,
  removeProjectFileTabs,
  type ProjectFileTabsState,
} from "@/lib/file-tabs";
import {
  applyToolDecision,
  type ToolRun,
} from "@/lib/tool-runs";
import { chatRequest, useChatThread, type ChatTurn } from "@/lib/chat-runtime-client";
import { projectChatDisplay, type ChatStopReason, type DisplayTurn } from "@/lib/chat-display";
import { prepareChatSubmission, type ChatSubmission } from "@/lib/chat-submission";
import { finishToolRuns } from "@/lib/tool-runs";
import {
  legacyUsageContributions,
  usageActivityFromDays,
  type UsageActivity,
  type UsageActivityDay,
} from "@/lib/usage-activity";

type MessageRole = "user" | "assistant";

type ChatMessage = {
  turnId?: string;
  inputStatus?: "pending" | "consumed" | "cancelled";
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;
  toolRuns?: ToolRun[];
  durationMs?: number;
  tokenUsage?: number;
  stopReason?: ChatStopReason;
  traceId?: string;
  traceStatus?: "recording" | "recorded" | "unavailable";
};

type Conversation = {
  turns?: DisplayTurn[];
  schemaVersion?: number;
  activeTurn?: ChatTurn;
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

type ProjectFile = FileTreeEntry;

type FilePreview = {
  path: string;
  name: string;
  size: number;
  modifiedAt: number;
  extension: string;
  kind: "text" | "image" | "pdf" | "kami-html" | "unsupported" | "too-large";
  mimeType: string;
  content?: string;
  previewLimitBytes?: number;
  kami?: { manifestPath: string; sha256: string; visualReviewPending: boolean };
};

type AvailableModel = {
  providerId: string;
  providerLabel: string;
  modelId: string;
  label: string;
};

type AgentStatus = "idle" | "connecting" | "streaming" | "done" | "stopped" | "error";


const STORAGE_KEY = "pi-research-agent:conversations:v2";
const LEGACY_STORAGE_KEY = "pi-research-agent:conversations:v1";
const ACTIVE_PROJECT_KEY = "pi-research-agent:active-project:v1";
const EXPANDED_PROJECTS_KEY = "pi-research-agent:expanded-projects:v1";
const ENABLED_SKILLS_KEY = "pi-research-agent:enabled-skills:v1";
const ENABLED_TOOLS_KEY = "pi-research-agent:enabled-tools:v2";
const ENABLED_MCPS_KEY = "pi-research-agent:enabled-mcps:v1";
const LEGACY_ENABLED_TOOLS_KEY = "pi-research-agent:enabled-tools:v1";
const SIDEBAR_WIDTH_KEY = "pi-research-agent:sidebar-width:v1";
const FILE_PANEL_WIDTH_KEY = "pi-research-agent:file-panel-width:v1";
const SIDEBAR_VISIBLE_KEY = "pi-research-agent:sidebar-visible:v1";
const FILE_PANEL_VISIBLE_KEY = "pi-research-agent:file-panel-visible:v1";
const FILE_TABS_KEY = "pi-research-agent:file-tabs:v1";
const SELECTED_MODEL_KEY = "pi-research-agent:selected-model:v1";
const AGENT_PROFILES_KEY = "pi-research-agent:agent-profiles:v2";
const AGENT_PROMPTS_KEY = "pi-research-agent:agent-prompts:v1";
const USAGE_LEGACY_MIGRATION_KEY = "pi-research-agent:usage-sqlite-migrated:v1";
const CHAT_LEGACY_MIGRATION_KEY = "pi-research-agent:chat-sqlite-migrated:v1";
const CHAT_BOOT_RETRY_DELAYS_MS = [0, 100, 250, 500, 1_000, 2_000];

type AppView = "workflow" | "workspace" | CapabilityKind | "model" | "agent" | "subagent" | "user" | "database" | "trace";

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

function getMessageDuration(message: ChatMessage) {
  if (message.durationMs !== undefined) return message.durationMs;
  const lastToolCompletedAt = Math.max(
    0,
    ...(message.toolRuns ?? []).map((run) => run.completedAt ?? 0),
  );
  return lastToolCompletedAt > message.createdAt
    ? lastToolCompletedAt - message.createdAt
    : undefined;
}

function formatBytes(size: number) {
  if (size < 1_024) return `${size} B`;
  if (size < 1_048_576) return `${(size / 1_024).toFixed(1)} KB`;
  return `${(size / 1_048_576).toFixed(1)} MB`;
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

function readLegacyConversations() {
  const byId = new Map<string, Conversation & { projectId?: string }>();
  for (const conversation of [
    ...parseStoredConversations(localStorage.getItem(LEGACY_STORAGE_KEY)),
    ...parseStoredConversations(localStorage.getItem(STORAGE_KEY)),
  ]) {
    const previous = byId.get(conversation.id);
    if (!previous || conversation.updatedAt >= previous.updatedAt) byId.set(conversation.id, conversation);
  }
  return [...byId.values()];
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

function parseProjectAgentConfigs(value: string | null): Record<string, ProjectAgentConfig> {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value) as Record<string, ProjectAgentConfig>;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).flatMap(([projectId, config]) => {
        if (!config || typeof config !== "object" || !config.profiles || typeof config.profiles !== "object") return [];
        const base = createEmptyProjectAgentConfig();
        if (Number.isInteger(config.starterAgentsVersion) && config.starterAgentsVersion! >= 1) base.starterAgentsVersion = config.starterAgentsVersion;
        if (Array.isArray(config.starterAgentsSkipped)) base.starterAgentsSkipped = config.starterAgentsSkipped.filter((name): name is string => typeof name === "string");
        if (Number.isInteger(config.dataAgentPythonVersion) && config.dataAgentPythonVersion! >= 1) base.dataAgentPythonVersion = config.dataAgentPythonVersion;
        for (const id of ["main"] as AgentRoleId[]) {
          const profile = config.profiles[id];
          if (!profile || typeof profile !== "object") continue;
          base.profiles[id] = {
            enabled: id === "main" ? true : profile.enabled === true,
            ...(profile.model ? { model: profile.model } : {}),
            enabledSkills: Array.isArray(profile.enabledSkills)
              ? upgradeLegacyDefaultSkillSelection(profile.enabledSkills.filter((name): name is string => typeof name === "string"))
              : [],
            enabledTools: Array.isArray(profile.enabledTools)
              ? upgradeLegacyDefaultToolSelection(profile.enabledTools.filter((name): name is string => typeof name === "string"))
              : [],
            enabledMcps: Array.isArray(profile.enabledMcps) ? profile.enabledMcps.filter((name): name is string => typeof name === "string") : [],
          };
        }
        if (Array.isArray(config.customSubAgents)) {
          base.customSubAgents = config.customSubAgents.flatMap((agent) => {
            if (!agent || typeof agent !== "object" || typeof agent.id !== "string" || typeof agent.label !== "string" || typeof agent.description !== "string") return [];
            return [{
              id: agent.id as CustomSubAgent["id"],
              label: agent.label,
              description: agent.description,
              enabled: agent.enabled === true,
              ...(agent.model ? { model: agent.model } : {}),
              enabledSkills: Array.isArray(agent.enabledSkills) ? agent.enabledSkills.filter((name): name is string => typeof name === "string") : [],
              enabledTools: Array.isArray(agent.enabledTools) ? agent.enabledTools.filter((name): name is string => typeof name === "string") : [],
              enabledMcps: Array.isArray(agent.enabledMcps) ? agent.enabledMcps.filter((name): name is string => typeof name === "string") : [],
            }];
          });
        }
        if (config.mainModel) base.mainModel = config.mainModel;
        return [[projectId, base] as const];
      }),
    );
  } catch {
    return {};
  }
}

function normalizeAgentPrompt(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= 12_000
    ? value.trim()
    : fallback;
}

function parseGlobalAgentPrompts(value: string | null): AgentPromptConfig {
  const defaults = createDefaultAgentPromptConfig();
  if (!value) return defaults;
  try {
    const parsed = JSON.parse(value) as Partial<Record<AgentRoleId, unknown>>;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return defaults;
    return Object.fromEntries(
      (Object.keys(defaults) as AgentRoleId[]).map((id) => [
        id,
        normalizeAgentPrompt(parsed[id], defaults[id]),
      ]),
    ) as AgentPromptConfig;
  } catch {
    return defaults;
  }
}

function migrateLegacyProjectAgentPrompts(value: string | null, preferredProjectId: string | undefined): AgentPromptConfig {
  const defaults = createDefaultAgentPromptConfig();
  if (!value) return defaults;
  try {
    const parsed = JSON.parse(value) as Record<string, { profiles?: Partial<Record<AgentRoleId, { systemPrompt?: unknown }>> }>;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return defaults;
    const project = preferredProjectId && parsed[preferredProjectId]
      ? parsed[preferredProjectId]
      : Object.values(parsed).find((candidate) => candidate && typeof candidate === "object");
    if (!project?.profiles || typeof project.profiles !== "object") return defaults;
    return Object.fromEntries(
      (Object.keys(defaults) as AgentRoleId[]).map((id) => [
        id,
        normalizeAgentPrompt(project.profiles?.[id]?.systemPrompt, defaults[id]),
      ]),
    ) as AgentPromptConfig;
  } catch {
    return defaults;
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


async function responseJson<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as (T & { message?: string }) | null;
  if (!response.ok) throw new Error(payload?.message ?? `请求失败（${response.status}）`);
  return payload as T;
}

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

async function fileToBase64(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}

function skillFolderPath(file: File) {
  return (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
}

function normalizeSkillFolderFiles(files: File[]) {
  const paths = files.map(skillFolderPath);
  const firstSegments = paths.map((path) => path.split("/").filter(Boolean)[0]);
  const commonRoot = firstSegments.length > 0 && firstSegments.every((segment) => segment === firstSegments[0])
    ? firstSegments[0]
    : "";
  return files.map((file, index) => ({
    path: commonRoot ? paths[index].slice(commonRoot.length + 1) : paths[index],
    file,
  }));
}

function previewCacheKey(projectId: string, path: string) {
  return `${projectId}\u0000${path}`;
}

function fileNameFromPath(path: string) {
  return path.split("/").pop() || path;
}

function fileTabId(projectId: string, path: string | null) {
  const tab = path === null ? "directory" : encodeURIComponent(path);
  return `workspace-file-tab-${encodeURIComponent(projectId)}-${tab}`;
}

type PreviewCacheEntry =
  | { status: "loading" }
  | { status: "ready"; preview: FilePreview }
  | { status: "error"; message: string };

export default function Home() {
  const [projects, setProjects] = useState<LocalProject[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeProjectId, setActiveProjectId] = useState("");
  const [activeId, setActiveId] = useState("");
  const [expandedProjectIds, setExpandedProjectIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectError, setProjectError] = useState("");
  const [chatSaveError, setChatSaveError] = useState("");
  const [projectMenuId, setProjectMenuId] = useState("");
  const [pathProject, setPathProject] = useState<LocalProject | null>(null);
  const [removeProjectCandidate, setRemoveProjectCandidate] = useState<LocalProject | null>(null);
  const [fullPermissionConversationId, setFullPermissionConversationId] = useState("");
  const [approvalSubmittingIds, setApprovalSubmittingIds] = useState<string[]>([]);
  const [expandedToolMessageIds, setExpandedToolMessageIds] = useState<string[]>([]);
  const [copiedProjectPath, setCopiedProjectPath] = useState(false);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<AgentStatus>("idle");
  const [modelProviders, setModelProviders] = useState<ModelProviderItem[]>([]);
  const [availableModels, setAvailableModels] = useState<AvailableModel[]>([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [modelsError, setModelsError] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("");
  const [durationMs, setDurationMs] = useState<number | null>(null);
  const [tokenUsage, setTokenUsage] = useState<number | null>(null);
  const [usageActivity, setUsageActivity] = useState<UsageActivity>({
    token: new Map(),
    tool: new Map(),
    skill: new Map(),
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filePanelOpen, setFilePanelOpen] = useState(false);
  const [fileNavigation, setFileNavigation] = useState<FileNavigation | null>(null);
  // A navigation request belongs to one project, including when switching back.
  if (fileNavigation && fileNavigation.projectId !== activeProjectId) setFileNavigation(null);
  const [fileTreesByProject, setFileTreesByProject] = useState<ProjectFileTreeState>({});
  const [fileTabsByProject, setFileTabsByProject] = useState<ProjectFileTabsState>({});
  const [previewCache, setPreviewCache] = useState<Record<string, PreviewCacheEntry>>({});
  const [copiedPreviewPath, setCopiedPreviewPath] = useState("");
  const [appMode, setAppMode] = useState<"workspace" | "workflow">("workspace");
  const [workflowConversations,setWorkflowConversations]=useState<WorkflowConversation[]>([]);
  const [workflowActiveIds,setWorkflowActiveIds]=useState<Record<string,string>>({});
  const workflowProjectRef=useRef("");
  useEffect(()=>{let disposed=false;async function refresh(){try{const d=await workflowApi<{conversations:WorkflowConversation[]}>("/conversations");if(!disposed)setWorkflowConversations(d.conversations);}catch{/* runtime connection is shown in the workspace */}}void refresh();const timer=setInterval(()=>void refresh(),4000);window.addEventListener("workflow-conversations-changed",refresh);return()=>{disposed=true;clearInterval(timer);window.removeEventListener("workflow-conversations-changed",refresh);};},[]);
  const [activeView, setActiveView] = useState<AppView>("workspace");
  const [traceFocusId, setTraceFocusId] = useState("");
  const [capabilityCatalog, setCapabilityCatalog] = useState<CapabilityCatalog>({
    skills: [],
    tools: [],
    mcps: [],
    agents: [],
  });
  const [enabledSkills, setEnabledSkills] = useState<string[]>([]);
  const [enabledTools, setEnabledTools] = useState<string[]>([]);
  const [enabledMcps, setEnabledMcps] = useState<string[]>([]);
  const [agentConfigsByProject, setAgentConfigsByProject] = useState<Record<string, ProjectAgentConfig>>({});
  const [agentPrompts, setAgentPrompts] = useState<AgentPromptConfig>(createDefaultAgentPromptConfig);
  const [capabilityRefreshVersion, setCapabilityRefreshVersion] = useState(0);
  const [capabilitiesReady, setCapabilitiesReady] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(246);
  const [filePanelWidth, setFilePanelWidth] = useState(380);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [filePanelVisible, setFilePanelVisible] = useState(true);
  const [kamiPreviewMode, setKamiPreviewMode] = useState<"preview" | "source">("preview");
  const [chatSubmitting, setChatSubmitting] = useState(false);
  const [chatStopping, setChatStopping] = useState(false);
  const [chatActionError, setChatActionError] = useState("");
  const sendLockRef = useRef(false);
  const chatRequestIds = useRef(new Map<string, ChatSubmission>());
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const composerIsComposingRef = useRef(false);
  const directoryRequestRef = useRef<Record<string, number>>({});
  const previewRequestRef = useRef<Record<string, number>>({});
  const fileTreesByProjectRef = useRef<ProjectFileTreeState>({});
  const chatPersistenceReadyRef = useRef(false);
  const chatPersistenceRef = useRef<ConversationPersistence<Conversation> | null>(null);
  if (!chatPersistenceRef.current) {
    chatPersistenceRef.current = createConversationPersistence<Conversation>({
      put: async (conversation) => {
        await responseJson(
          await fetch(`/api/local/chat/conversations/${encodeURIComponent(conversation.id)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(conversation.schemaVersion === 2 ? { metadataOnly: true, bashApprovalMode: conversation.bashApprovalMode, bashPermissionMode: conversation.bashPermissionMode } : conversation),
            cache: "no-store",
          }),
        );
      },
      remove: async (id) => {
        await responseJson(
          await fetch(`/api/local/chat/conversations/${encodeURIComponent(id)}`, {
            method: "DELETE",
            cache: "no-store",
          }),
        );
      },
      onError: (error) => setChatSaveError(`会话未保存，正在重试：${error.message}`),
      onSaved: () => setChatSaveError(""),
    });
  }

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
  const selectedModel = useMemo(
    () => availableModels.find((model) => `${model.providerId}:${model.modelId}` === selectedModelId),
    [availableModels, selectedModelId],
  );
  const activeAgentConfig = useMemo(
    () => agentConfigsByProject[activeProjectId] ?? createEmptyProjectAgentConfig(),
    [activeProjectId, agentConfigsByProject],
  );
  const isBusy = activeConversation?.activeTurn?.status === "running" || activeConversation?.activeTurn?.status === "queued";
  const acceptChatSnapshot = useCallback((conversation: Conversation) => {
    setConversations(current => current.map(c => c.id === conversation.id ? conversation : c));
    const t = conversation.activeTurn;
    setStatus(t?.status === "running" || t?.status === "queued" ? "streaming" : t?.status === "interrupted" ? "stopped" : t?.status === "failed" ? "error" : "done");
    setDurationMs(t?.durationMs ?? null); setTokenUsage(t?.totalTokens ?? null);
    if (t?.status !== "running" && t?.status !== "queued") setChatStopping(false);
  }, []);
  const chatConnection = useChatThread<Conversation>(activeId || undefined, hydrated && activeConversation?.schemaVersion === 2, acceptChatSnapshot);
  const activeAssistantMessageId = isBusy ? activeConversation?.messages.findLast(m => m.role === "assistant" && m.turnId === activeConversation.activeTurn?.id)?.id : undefined;
  const activeFileTabs = getProjectFileTabs(fileTabsByProject, activeProjectId);
  const activeFileTree = getProjectFileTree(fileTreesByProject, activeProjectId);
  const files = useMemo(() => getVisibleFileTreeEntries(activeFileTree), [activeFileTree]);
  const loadedFiles = useMemo(() => getLoadedFileTreeEntries(activeFileTree), [activeFileTree]);
  const rootFilesLoaded = Object.hasOwn(activeFileTree.childrenByDirectory, "");
  const filesLoading = activeFileTree.loadingPaths.length > 0;
  const activeFilePath = activeFileTabs.activePath;
  const previewNavigation = activeFileNavigation(fileNavigation, activeProjectId, activeFilePath);
  const activePreviewEntry =
    activeProjectId && activeFilePath
      ? previewCache[previewCacheKey(activeProjectId, activeFilePath)]
      : undefined;
  const filePreview = activePreviewEntry?.status === "ready" ? activePreviewEntry.preview : null;
  const previewAssetUrl =
    activeProjectId && activeFilePath
      ? `/api/local/workspaces/${activeProjectId}/files/asset?path=${encodeURIComponent(activeFilePath)}`
      : "";
  const downloadAssetUrl = previewAssetUrl ? `${previewAssetUrl}&download=1` : "";

  const loadProjectDirectory = useCallback(async (projectId: string, directoryPath = "") => {
    if (!projectId) return;
    const key = `${projectId}\u0000${directoryPath}`;
    const requestId = (directoryRequestRef.current[key] ?? 0) + 1;
    directoryRequestRef.current[key] = requestId;
    setFileTreesByProject((current) =>
      setDirectoryLoading(current, projectId, directoryPath),
    );
    try {
      const query = directoryPath ? `?path=${encodeURIComponent(directoryPath)}` : "";
      const payload = await responseJson<{
        directory: string;
        entries: ProjectFile[];
        truncated: boolean;
      }>(
        await fetch(`/api/local/workspaces/${projectId}/files${query}`, { cache: "no-store" }),
      );
      if (directoryRequestRef.current[key] !== requestId) return;
      setFileTreesByProject((current) =>
        setDirectoryEntries(
          current,
          projectId,
          directoryPath,
          payload.entries,
          payload.truncated,
        ),
      );
    } catch (error) {
      if (directoryRequestRef.current[key] !== requestId) return;
      setFileTreesByProject((current) =>
        setDirectoryError(
          current,
          projectId,
          directoryPath,
          error instanceof Error ? error.message : "无法读取目录。",
        ),
      );
    }
  }, []);

  const loadFilePreview = useCallback(async (projectId: string, path: string) => {
    const key = previewCacheKey(projectId, path);
    const requestId = (previewRequestRef.current[key] ?? 0) + 1;
    previewRequestRef.current[key] = requestId;
    setPreviewCache((current) => ({ ...current, [key]: { status: "loading" } }));
    try {
      const payload = await responseJson<FilePreview>(
        await fetch(
          `/api/local/workspaces/${projectId}/files/content?path=${encodeURIComponent(path)}`,
          { cache: "no-store" },
        ),
      );
      if (previewRequestRef.current[key] !== requestId) return;
      setPreviewCache((current) => ({
        ...current,
        [key]: { status: "ready", preview: payload },
      }));
    } catch (error) {
      if (previewRequestRef.current[key] !== requestId) return;
      setPreviewCache((current) => ({
        ...current,
        [key]: {
          status: "error",
          message: error instanceof Error ? error.message : "无法预览文件。",
        },
      }));
    }
  }, []);

  const refreshProjectFiles = useCallback(
    (projectId: string) => {
      if (!projectId) return;
      const projectPrefix = `${projectId}\u0000`;
      const expandedPaths = getProjectFileTree(
        fileTreesByProjectRef.current,
        projectId,
      ).expandedPaths;
      for (const key of Object.keys(directoryRequestRef.current)) {
        if (key.startsWith(projectPrefix)) directoryRequestRef.current[key] += 1;
      }
      for (const key of Object.keys(previewRequestRef.current)) {
        if (key.startsWith(projectPrefix)) {
          previewRequestRef.current[key] += 1;
        }
      }
      setPreviewCache((current) =>
        Object.fromEntries(
          Object.entries(current).filter(([key]) => !key.startsWith(projectPrefix)),
        ),
      );
      setFileTreesByProject((current) => resetProjectFileTree(current, projectId));
      void (async () => {
        await loadProjectDirectory(projectId);
        await Promise.all(
          expandedPaths.map((directoryPath) =>
            loadProjectDirectory(projectId, directoryPath),
          ),
        );
      })();
    },
    [loadProjectDirectory],
  );

  const loadUsageActivity = useCallback(async () => {
    const to = Date.now();
    const from = to - 364 * 24 * 60 * 60 * 1_000;
    try {
      const payload = await responseJson<{ days: UsageActivityDay[] }>(
        await fetch(`/api/local/usage/activity?from=${from}&to=${to}`, { cache: "no-store" }),
      );
      setUsageActivity(usageActivityFromDays(payload.days));
    } catch {
      // Keep the last successful value while the local Runtime is unavailable.
    }
  }, []);

  const chatRefreshKey = activeConversation?.schemaVersion === 2 ? JSON.stringify([
    activeConversation.id, activeConversation.activeTurn?.id, activeConversation.activeTurn?.status,
    activeConversation.messages.flatMap(m => m.toolRuns ?? []).filter(r => r.toolName === "write_project_file" || r.toolName === "generate_document").map(r => [r.toolCallId, r.status]),
  ]) : "";
  useEffect(() => {
    if (!chatRefreshKey || !activeProjectId) return;
    // Refresh also after reconnect/switch, where completed events may already
    // be represented by the first durable snapshot.
    const timer = setTimeout(() => { refreshProjectFiles(activeProjectId); void loadUsageActivity(); }, 150);
    return () => clearTimeout(timer);
  }, [chatRefreshKey, activeProjectId, refreshProjectFiles, loadUsageActivity]);

  const loadModelCatalog = useCallback(async () => {
    setModelsLoading(true);
    setModelsError("");
    try {
      const payload = await responseJson<{
        providers: ModelProviderItem[];
        models: AvailableModel[];
      }>(await fetch("/api/models", { cache: "no-store" }));
      setModelProviders(payload.providers);
      setAvailableModels(payload.models);
      const storedModelId = localStorage.getItem(SELECTED_MODEL_KEY) ?? "";
      const legacyDeepSeek = payload.models.find(
        (model) => model.providerId === "deepseek" && model.modelId === storedModelId,
      );
      const chosen = payload.models.find(
        (model) => `${model.providerId}:${model.modelId}` === storedModelId,
      ) ?? legacyDeepSeek ?? payload.models[0];
      const nextId = chosen ? `${chosen.providerId}:${chosen.modelId}` : "";
      setSelectedModelId(nextId);
      if (nextId) localStorage.setItem(SELECTED_MODEL_KEY, nextId);
      else localStorage.removeItem(SELECTED_MODEL_KEY);
    } catch (error) {
      setModelProviders([]);
      setAvailableModels([]);
      setSelectedModelId("");
      setModelsError(error instanceof Error ? error.message : "无法读取本机模型配置。");
    } finally {
      setModelsLoading(false);
    }
  }, []);

  useEffect(() => {
    let disposed = false;

    async function initialize() {
      if (localStorage.getItem("pi-research-agent:mode:v1") === "workflow") {setActiveView("workflow");setAppMode("workflow");}
      workflowProjectRef.current=localStorage.getItem("workflow:last-project")??"";
      try {setWorkflowActiveIds(JSON.parse(localStorage.getItem("workflow:active-conversations")??"{}"));} catch { /* empty selection */ }
      setSidebarWidth(storedNumber(localStorage.getItem(SIDEBAR_WIDTH_KEY), 246, 190, 380));
      setFilePanelWidth(storedNumber(localStorage.getItem(FILE_PANEL_WIDTH_KEY), 380, 300, 680));
      setSidebarVisible(storedBoolean(localStorage.getItem(SIDEBAR_VISIBLE_KEY), true));
      setFilePanelVisible(storedBoolean(localStorage.getItem(FILE_PANEL_VISIBLE_KEY), true));
      const stored = readLegacyConversations();
      for (let attempt = 0; !disposed; attempt += 1) {
        const delay = CHAT_BOOT_RETRY_DELAYS_MS[Math.min(attempt, CHAT_BOOT_RETRY_DELAYS_MS.length - 1)];
        if (delay) await wait(delay);
        if (disposed) return;
        try {
          const [workspacePayload, initialChatPayload] = await Promise.all([
            responseJson<{ workspaces: LocalProject[] }>(
              await fetch("/api/local/workspaces", { cache: "no-store" }),
            ),
            responseJson<{ conversations: Conversation[]; migrationRequired: boolean }>(
              await fetch("/api/local/chat/conversations", { cache: "no-store" }),
            ),
          ]);
          const available = workspacePayload.workspaces;
          const remembered = localStorage.getItem(ACTIVE_PROJECT_KEY);
          const initialProject =
            available.find((project) => project.id === remembered) ?? available[0] ?? null;
          const projectIds = new Set(available.map((project) => project.id));
          const normalize = (
            source: Array<Conversation & { projectId?: string }>,
            allowProjectFallback: boolean,
            finishInterruptedRuns: boolean,
          ): Conversation[] => source.flatMap((conversation) => {
            const projectId = conversation.projectId && projectIds.has(conversation.projectId)
              ? conversation.projectId
              : allowProjectFallback
                ? initialProject?.id
                : undefined;
            if (!projectId) return [];
            return [{
              ...conversation,
              messages: finishInterruptedRuns && conversation.schemaVersion !== 2
                ? conversation.messages.map((message) => ({
                    ...message,
                    toolRuns: message.toolRuns && finishToolRuns(message.toolRuns, "执行已中断"),
                  }))
                : conversation.messages,
              projectId,
              bashApprovalMode: conversation.bashApprovalMode === "ask" ? "ask" : "auto",
              bashPermissionMode: conversation.bashPermissionMode === "full" ? "full" : "sandbox",
            }];
          });
          const legacyConversations = normalize(stored, true, false);
          let persistedConversations = initialChatPayload.conversations;
          const originMigrationRequired = localStorage.getItem(CHAT_LEGACY_MIGRATION_KEY) !== "done";
          if (initialChatPayload.migrationRequired || (originMigrationRequired && legacyConversations.length > 0)) {
            const migrated = await responseJson<{ conversations: Conversation[]; imported: number }>(
              await fetch("/api/local/chat/conversations/import", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversations: legacyConversations }),
                cache: "no-store",
              }),
            );
            persistedConversations = migrated.conversations;
            localStorage.setItem(CHAT_LEGACY_MIGRATION_KEY, "done");
          }
          const canonicalConversations = normalize(persistedConversations, false, false);
          let normalized = normalize(persistedConversations, false, true);
          let defaultConversation: Conversation | undefined;
          if (initialProject && !normalized.some((item) => item.projectId === initialProject.id)) {
            defaultConversation = makeConversation(initialProject.id);
            normalized = [defaultConversation, ...normalized];
          }
          const storedExpandedProjectIds =
            parseStoredNames(localStorage.getItem(EXPANDED_PROJECTS_KEY)) ?? [];
          const availableExpandedProjectIds = storedExpandedProjectIds.filter((projectId) =>
            projectIds.has(projectId),
          );
          const storedFileTabs = parseProjectFileTabs(localStorage.getItem(FILE_TABS_KEY));
          const availableFileTabs = Object.fromEntries(
            Object.entries(storedFileTabs).filter(([projectId]) => projectIds.has(projectId)),
          );
          const storedAgentConfigValue = localStorage.getItem(AGENT_PROFILES_KEY);
          const storedAgentConfigs = parseProjectAgentConfigs(storedAgentConfigValue);
          const storedAgentPromptValue = localStorage.getItem(AGENT_PROMPTS_KEY);
          const storedAgentPrompts = storedAgentPromptValue === null
            ? migrateLegacyProjectAgentPrompts(storedAgentConfigValue, initialProject?.id)
            : parseGlobalAgentPrompts(storedAgentPromptValue);
          const legacyAgentConfig = createProjectAgentConfigFromLegacy({
            enabledSkills: parseStoredNames(localStorage.getItem(ENABLED_SKILLS_KEY)) ?? undefined,
            enabledTools: parseStoredNames(localStorage.getItem(ENABLED_TOOLS_KEY) ?? localStorage.getItem(LEGACY_ENABLED_TOOLS_KEY)) ?? undefined,
            enabledMcps: parseStoredNames(localStorage.getItem(ENABLED_MCPS_KEY)) ?? undefined,
          });
          const availableAgentConfigs = Object.fromEntries(
            available.map((project) => [project.id, supplementDefaultAgents(storedAgentConfigs[project.id] ?? cloneProjectAgentConfig(legacyAgentConfig))]),
          );
          const firstConversation = normalized.find(item=>item.id===localStorage.getItem("chat:last-conversation")) ?? (initialProject
            ? normalized.find((item) => item.projectId === initialProject.id)
            : undefined);
          if (disposed) return;
          chatPersistenceRef.current?.seed(canonicalConversations);
          chatPersistenceReadyRef.current = true;
          setProjects(available);
          setAgentConfigsByProject(availableAgentConfigs);
          setAgentPrompts(storedAgentPrompts);
          setConversations(normalized);
          for (const conversation of normalized) void chatPersistenceRef.current?.save(conversation, conversation === defaultConversation);
          const workflowProject=localStorage.getItem("pi-research-agent:mode:v1")==="workflow" && projectIds.has(workflowProjectRef.current) ? workflowProjectRef.current : "";
          setActiveProjectId(workflowProject || firstConversation?.projectId || initialProject?.id || "");
          setActiveId(firstConversation?.id ?? "");
          setFileTabsByProject(availableFileTabs);
          setExpandedProjectIds(
            availableExpandedProjectIds.length > 0
              ? availableExpandedProjectIds
              : initialProject
                ? [initialProject.id]
                : [],
          );
          if (initialProject) localStorage.setItem(ACTIVE_PROJECT_KEY, initialProject.id);
          if (localStorage.getItem(USAGE_LEGACY_MIGRATION_KEY) !== "done") {
            const contributions = legacyUsageContributions(stored);
            for (let index = 0; index < contributions.length || index === 0; index += 10_000) {
              await responseJson(
                await fetch("/api/local/usage/import", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ contributions: contributions.slice(index, index + 10_000) }),
                }),
              );
              if (contributions.length === 0) break;
            }
            localStorage.setItem(USAGE_LEGACY_MIGRATION_KEY, "done");
          }
          await loadUsageActivity();
          if (disposed) return;
          setProjectError("");
          setProjectLoading(false);
          setHydrated(true);
          void loadModelCatalog();
          return;
        } catch (error) {
          if (disposed) return;
          const message = error instanceof Error ? error.message : "本机项目 Runtime 不可用。";
          setProjectError(`正在重试本机 Runtime：${message}（历史不会被覆盖）`);
        }
      }
    }

    void initialize();
    void loadModelCatalog();
    return () => {
      disposed = true;
    };
  }, [loadModelCatalog, loadUsageActivity]);

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
        const storedMcps = parseStoredNames(localStorage.getItem(ENABLED_MCPS_KEY));
        const knownSkills = new Set(catalog.skills.map((item) => item.name));
        const knownTools = new Set(catalog.tools.map((item) => item.name));
        const knownMcps = new Set(catalog.mcps.map((item) => item.name));
        setCapabilityCatalog(catalog);
        setEnabledSkills(
          storedSkills
            ? storedSkills.filter((name) => knownSkills.has(name))
            : catalog.skills.filter((item) => item.defaultEnabled).map((item) => item.name),
        );
        const initialTools = storedTools
          ? upgradeLegacyDefaultToolSelection(storedTools).filter((name) => knownTools.has(name))
          : catalog.tools.filter((item) => item.defaultEnabled).map((item) => item.name);
        if (storedToolValue === null && knownTools.has("bash") && !initialTools.includes("bash")) {
          initialTools.push("bash");
        }
        setEnabledTools(initialTools);
        localStorage.setItem(ENABLED_TOOLS_KEY, JSON.stringify(initialTools));
        const initialMcps = storedMcps
          ? storedMcps.filter((name) => knownMcps.has(name))
          : catalog.mcps
              .filter((item) => item.defaultEnabled && item.status === "connected")
              .map((item) => item.name);
        setEnabledMcps(initialMcps);
        localStorage.setItem(ENABLED_MCPS_KEY, JSON.stringify(initialMcps));
      } catch (error) {
        setProjectError(error instanceof Error ? error.message : "无法加载 Agent 能力目录。");
      } finally {
        setCapabilitiesReady(true);
      }
    }

    void loadCapabilities();
  }, [capabilityRefreshVersion]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(AGENT_PROFILES_KEY, JSON.stringify(agentConfigsByProject));
  }, [agentConfigsByProject, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(AGENT_PROMPTS_KEY, JSON.stringify(agentPrompts));
  }, [agentPrompts, hydrated]);

  useEffect(() => {
    if (!activeProjectId || !agentConfigsByProject[activeProjectId]) return;
    const main = agentConfigsByProject[activeProjectId].profiles.main;
    setEnabledSkills(main.enabledSkills);
    setEnabledTools(main.enabledTools);
    setEnabledMcps(main.enabledMcps);
    const mainModel = agentConfigsByProject[activeProjectId].mainModel;
    if (mainModel) setSelectedModelId(`${mainModel.providerId}:${mainModel.modelId}`);
  }, [activeProjectId, agentConfigsByProject]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(EXPANDED_PROJECTS_KEY, JSON.stringify(expandedProjectIds));
  }, [expandedProjectIds, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(FILE_TABS_KEY, JSON.stringify(fileTabsByProject));
  }, [fileTabsByProject, hydrated]);

  useEffect(() => {
    fileTreesByProjectRef.current = fileTreesByProject;
  }, [fileTreesByProject]);

  useEffect(() => {
    if (!hydrated) return;
    if (!activeProjectId) {
      return;
    }
    const tree = getProjectFileTree(fileTreesByProject, activeProjectId);
    if (
      !Object.hasOwn(tree.childrenByDirectory, "") &&
      !tree.loadingPaths.includes("") &&
      !tree.errorsByPath[""]
    ) {
      void loadProjectDirectory(activeProjectId);
    }
  }, [activeProjectId, fileTreesByProject, hydrated, loadProjectDirectory]);

  useEffect(() => {
    if (!hydrated || !activeProjectId || !activeFilePath || activePreviewEntry) return;
    void loadFilePreview(activeProjectId, activeFilePath);
  }, [activeFilePath, activePreviewEntry, activeProjectId, hydrated, loadFilePreview]);

  useEffect(() => {
    setKamiPreviewMode("preview");
  }, [activeProjectId, activeFilePath]);

  useEffect(() => {
    if (!activeProjectId) return;
    requestAnimationFrame(() => {
      document
        .getElementById(fileTabId(activeProjectId, activeFilePath))
        ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    });
  }, [activeFilePath, activeProjectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeConversation?.messages, status]);

  function updateConversation(
    id: string,
    updater: (conversation: Conversation) => Conversation,
    immediate = false,
  ) {
    setConversations((current) =>
      current.map((conversation) => {
        if (conversation.id !== id) return conversation;
        const updated = updater(conversation);
        if (chatPersistenceReadyRef.current) void chatPersistenceRef.current?.save(updated, immediate);
        return updated;
      }).sort((a, b) => b.updatedAt - a.updatedAt),
    );
  }

  function stopActiveRun() {
    const turn = activeConversation?.activeTurn;
    if (!turn || chatStopping) return;
    setChatStopping(true);
    void chatRequest(`${turn.threadId}/turns/${turn.id}/interrupt`, {})
      .catch(e => { setChatActionError(e.message); setChatStopping(false); });
  }

  useEffect(()=>{if(hydrated&&activeId)localStorage.setItem("chat:last-conversation",activeId);},[activeId,hydrated]);

  function chooseWorkflow(id:string,projectId=activeProjectId) {
    workflowProjectRef.current=projectId;
    localStorage.setItem("workflow:last-project",projectId);
    setActiveProjectId(projectId);
    setWorkflowActiveIds(previous=>{const next={...previous,[projectId]:id};localStorage.setItem("workflow:active-conversations",JSON.stringify(next));return next;});
    setExpandedProjectIds(previous=>previous.includes(projectId)?previous:[...previous,projectId]);
    setActiveView("workflow");setSidebarOpen(false);
  }
  function changeMode(mode:"workspace"|"workflow") {
    if(mode === "workspace") {
      const conversation=conversations.find(c=>c.id===activeId);
      if(conversation)setActiveProjectId(conversation.projectId);
    } else if(projects.some(p=>p.id===workflowProjectRef.current)) {
      setActiveProjectId(workflowProjectRef.current);
    }
    setAppMode(mode);
    setActiveView(mode);
    localStorage.setItem("pi-research-agent:mode:v1",mode);
  }
  function newConversation(projectId = activeProjectId) {
    if(appMode==="workflow"){chooseWorkflow("",projectId);return;}
    if (!projectId) return;
    const next = makeConversation(projectId);
    setConversations((current) => [next, ...current]);
    if (chatPersistenceReadyRef.current) void chatPersistenceRef.current?.save(next, true);
    setExpandedProjectIds((current) =>
      current.includes(projectId) ? current : [...current, projectId],
    );
    setActiveProjectId(projectId);
    localStorage.setItem(ACTIVE_PROJECT_KEY, projectId);
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
      setAgentConfigsByProject((current) =>
        current[project.id]
          ? current
          : { ...current, [project.id]: createDefaultProjectAgentConfig() },
      );
      const existing = conversations.find((item) => item.projectId === project.id);
      if (existing) {
        setExpandedProjectIds((current) =>
          current.includes(project.id) ? current : [...current, project.id],
        );
        setActiveProjectId(project.id);
        setActiveId(existing.id);
        localStorage.setItem(ACTIVE_PROJECT_KEY, project.id);
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

  function toggleProjectExpansion(projectId: string) {
    setExpandedProjectIds((current) =>
      current.includes(projectId)
        ? current.filter((item) => item !== projectId)
        : [...current, projectId],
    );
  }

  async function removeProjectBinding(project: LocalProject) {
    setProjectError("");
    if (isBusy && project.id === activeProjectId) stopActiveRun();

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
        } else {
          setActiveProjectId("");
          setActiveId("");
          localStorage.removeItem(ACTIVE_PROJECT_KEY);
        }
        setStatus("idle");
      }

      setProjects(remainingProjects);
      setAgentConfigsByProject((current) => {
        const next = { ...current };
        delete next[project.id];
        return next;
      });
      setConversations(remainingConversations);
      for (const conversation of conversations) {
        if (conversation.projectId === project.id) void chatPersistenceRef.current?.delete(conversation.id);
      }
      const projectPrefix = `${project.id}\u0000`;
      for (const key of Object.keys(directoryRequestRef.current)) {
        if (key.startsWith(projectPrefix)) directoryRequestRef.current[key] += 1;
      }
      setFileTreesByProject((current) => removeProjectFileTree(current, project.id));
      setFileTabsByProject((current) => removeProjectFileTabs(current, project.id));
      for (const key of Object.keys(previewRequestRef.current)) {
        if (key.startsWith(projectPrefix)) {
          previewRequestRef.current[key] += 1;
        }
      }
      setPreviewCache((current) =>
        Object.fromEntries(
          Object.entries(current).filter(([key]) => !key.startsWith(projectPrefix)),
        ),
      );
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
    if (isBusy && id === activeId) stopActiveRun();
    if (chatPersistenceReadyRef.current) void chatPersistenceRef.current?.delete(id);
    setConversations((current) => {
      const remaining = current.filter((item) => item.id !== id);
      const sameProject = remaining.filter((item) => item.projectId === target.projectId);
      if (sameProject.length > 0) {
        if (id === activeId) setActiveId(sameProject[0].id);
        return remaining;
      }
      const replacement = makeConversation(target.projectId);
      if (id === activeId) setActiveId(replacement.id);
      if (chatPersistenceReadyRef.current) void chatPersistenceRef.current?.save(replacement, true);
      return [replacement, ...remaining];
    });
    setStatus("idle");
  }

  function selectConversation(id: string, projectId: string, mode = appMode) {
    if(mode==="workflow"){chooseWorkflow(id,projectId);return;}
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

  function openTrace(traceId: string) {
    setTraceFocusId(traceId);
    setActiveView("trace");
    setSidebarOpen(false);
  }

  function openTraceConversation(conversationId: string) {
    const workflow = workflowConversations.find(c=>c.id===conversationId || c.runIds.includes(conversationId));
    if(workflow){changeMode("workflow");chooseWorkflow(workflow.id,workflow.workspaceId);return;}
    const conversation = conversations.find((item) => item.id === conversationId);
    if (!conversation) {
      setProjectError("这条 Trace 对应的本地对话已经不存在。");
      return;
    }
    if (isBusy && conversation.id === activeId) {
      setActiveView("workspace");
      return;
    }
    changeMode("workspace");
    selectConversation(conversation.id, conversation.projectId,"workspace");
  }

  function toolRunsAreExpanded(messageId: string) {
    const activeMessageId = activeAssistantMessageId;
    return (isBusy && activeMessageId === messageId) || expandedToolMessageIds.includes(messageId);
  }

  function toggleToolRuns(messageId: string) {
    const activeMessageId = activeAssistantMessageId;
    if (isBusy && activeMessageId === messageId) return;
    setExpandedToolMessageIds((current) =>
      current.includes(messageId)
        ? current.filter((id) => id !== messageId)
        : [...current, messageId],
    );
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
      setEnabledSkills((current) => {
        const next = update(current, ENABLED_SKILLS_KEY);
        updateAgentProfile("main", { ...activeAgentConfig.profiles.main, enabledSkills: next });
        return next;
      });
    } else if (kind === "tool") {
      setEnabledTools((current) => {
        const next = update(current, ENABLED_TOOLS_KEY);
        updateAgentProfile("main", { ...activeAgentConfig.profiles.main, enabledTools: next });
        return next;
      });
    } else {
      setEnabledMcps((current) => {
        const next = update(current, ENABLED_MCPS_KEY);
        updateAgentProfile("main", { ...activeAgentConfig.profiles.main, enabledMcps: next });
        return next;
      });
    }
  }

  function migrateSkillSelection(previousName: string | null, nextName: string | null, enableInActiveProject = false) {
    setEnabledSkills((current) => {
      const retained = previousName ? current.filter((name) => name !== previousName) : [...current];
      const shouldEnable = enableInActiveProject || Boolean(previousName && current.includes(previousName));
      const next = nextName && shouldEnable && !retained.includes(nextName) ? [...retained, nextName] : retained;
      localStorage.setItem(ENABLED_SKILLS_KEY, JSON.stringify(next));
      return next;
    });
    setAgentConfigsByProject((current) => Object.fromEntries(
      Object.entries(current).map(([projectId, config]) => {
        const profiles = Object.fromEntries(
          Object.entries(config.profiles).map(([roleId, profile]) => {
            const currentNames = profile.enabledSkills;
            const retained = previousName ? currentNames.filter((name) => name !== previousName) : [...currentNames];
            const shouldEnable =
              (previousName !== null && currentNames.includes(previousName)) ||
              (enableInActiveProject && projectId === activeProjectId && roleId === "main");
            const enabledSkills = nextName && shouldEnable && !retained.includes(nextName)
              ? [...retained, nextName]
              : retained;
            return [roleId, { ...profile, enabledSkills }];
          }),
        ) as ProjectAgentConfig["profiles"];
        return [projectId, { ...config, profiles }];
      }),
    ));
  }

  async function importSkillFolder(source: { kind: "folder"; files: File[] } | { kind: "zip"; file: File }) {
    const payload = source.kind === "zip"
      ? { kind: "zip", data: await fileToBase64(source.file) }
      : {
          kind: "folder",
          files: await Promise.all(normalizeSkillFolderFiles(source.files).map(async ({ path, file }) => ({ path, data: await fileToBase64(file) }))),
        };
    const skill = await responseJson<{ name: string }>(
      await fetch("/api/local/skills/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    );
    migrateSkillSelection(null, skill.name, true);
    setCapabilityRefreshVersion((current) => current + 1);
  }

  async function updateSkill(item: CapabilityItem, value: { name: string; description: string; instructions: string }) {
    const skill = await responseJson<{ name: string }>(
      await fetch(`/api/local/skills/${encodeURIComponent(item.id ?? `bundled:${item.name}`)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      }),
    );
    migrateSkillSelection(item.name, skill.name);
    setCapabilityRefreshVersion((current) => current + 1);
  }

  async function deleteSkill(item: CapabilityItem) {
    await responseJson<{ removed: string }>(
      await fetch(`/api/local/skills/${encodeURIComponent(item.id ?? `bundled:${item.name}`)}`, { method: "DELETE" }),
    );
    migrateSkillSelection(item.name, null);
    setCapabilityRefreshVersion((current) => current + 1);
  }

  async function readSkillResource(item: CapabilityItem, filePath: string): Promise<SkillResourcePreview> {
    return responseJson<SkillResourcePreview>(
      await fetch(`/api/local/skills/${encodeURIComponent(item.id ?? `bundled:${item.name}`)}/files/content?path=${encodeURIComponent(filePath)}`),
    );
  }

  async function writeSkillResource(item: CapabilityItem, filePath: string, file: File) {
    await responseJson(
      await fetch(`/api/local/skills/${encodeURIComponent(item.id ?? `bundled:${item.name}`)}/files`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: filePath, data: await fileToBase64(file) }),
      }),
    );
    setCapabilityRefreshVersion((current) => current + 1);
  }

  async function deleteSkillResource(item: CapabilityItem, filePath: string) {
    await responseJson(
      await fetch(`/api/local/skills/${encodeURIComponent(item.id ?? `bundled:${item.name}`)}/files?path=${encodeURIComponent(filePath)}`, { method: "DELETE" }),
    );
    setCapabilityRefreshVersion((current) => current + 1);
  }

  async function exportSkill(item: CapabilityItem) {
    const response = await fetch(`/api/local/skills/${encodeURIComponent(item.id ?? `bundled:${item.name}`)}/export`);
    if (!response.ok) {
      const payload = await response.json().catch(() => null) as { message?: string } | null;
      throw new Error(payload?.message ?? "导出 Skill 失败。");
    }
    const objectUrl = URL.createObjectURL(await response.blob());
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = `${item.name}.zip`;
    anchor.click();
    URL.revokeObjectURL(objectUrl);
  }

  function updateAgentProfile(id: AgentRoleId, profile: AgentProfile) {
    if (!activeProjectId || isBusy) return;
    setAgentConfigsByProject((current) => {
      const config = current[activeProjectId] ?? createEmptyProjectAgentConfig();
      return { ...current, [activeProjectId]: { ...config, profiles: { ...config.profiles, [id]: profile } } };
    });
  }

  function updateAgentPrompt(prompt: string) {
    if (isBusy) return;
    setAgentPrompts((current) => ({ ...current, main: prompt }));
  }

  function updateCustomSubAgent(agent: CustomSubAgent) {
    if (!activeProjectId || isBusy) return;
    setAgentConfigsByProject((current) => {
      const config = current[activeProjectId] ?? createEmptyProjectAgentConfig();
      return {
        ...current,
        [activeProjectId]: {
          ...config,
          customSubAgents: config.customSubAgents.map((item) => item.id === agent.id ? agent : item),
        },
      };
    });
  }

  function createCustomSubAgentForProject() {
    if (activeAgentConfig.customSubAgents.length >= MAX_CUSTOM_SUB_AGENTS) return activeAgentConfig.customSubAgents[0];
    const agent = createCustomSubAgent({
      id: `custom-${makeId()}`,
      label: "新子 Agent",
      description: "请填写此子 Agent 的专业职责和预期产出。",
    });
    if (!activeProjectId || isBusy) return agent;
    setAgentConfigsByProject((current) => {
      const config = current[activeProjectId] ?? createEmptyProjectAgentConfig();
      return { ...current, [activeProjectId]: { ...config, customSubAgents: [...config.customSubAgents, agent] } };
    });
    return agent;
  }

  function deleteCustomSubAgent(id: CustomSubAgent["id"]) {
    if (!activeProjectId || isBusy) return;
    setAgentConfigsByProject((current) => {
      const config = current[activeProjectId] ?? createEmptyProjectAgentConfig();
      return { ...current, [activeProjectId]: { ...config, customSubAgents: config.customSubAgents.filter((agent) => agent.id !== id) } };
    });
  }

  function toggleBashApprovalMode() {
    if (!activeConversation || isBusy) return;
    updateConversation(activeConversation.id, (conversation) => ({
      ...conversation,
      bashApprovalMode: conversation.bashApprovalMode === "auto" ? "ask" : "auto",
      updatedAt: timestampNow(),
    }), true);
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
    }), true);
  }

  function selectModel(modelId: string) {
    if (!availableModels.some((model) => `${model.providerId}:${model.modelId}` === modelId) || isBusy) return;
    setSelectedModelId(modelId);
    localStorage.setItem(SELECTED_MODEL_KEY, modelId);
    const model = availableModels.find((item) => `${item.providerId}:${item.modelId}` === modelId);
    if (model && activeProjectId) {
      setAgentConfigsByProject((current) => {
        const config = current[activeProjectId] ?? createEmptyProjectAgentConfig();
        return {
          ...current,
          [activeProjectId]: {
            ...config,
            mainModel: { providerId: model.providerId, modelId: model.modelId },
          },
        };
      });
    }
  }

  async function saveAndTestModelProvider(
    providerId: string,
    payload: { apiKey?: string; enabledModelIds: string[]; modelId: string },
  ) {
    setModelsError("");
    await responseJson(
      await fetch(`/api/local/models/${providerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: payload.apiKey, enabledModelIds: payload.enabledModelIds }),
      }),
    );
    try {
      await responseJson(
        await fetch(`/api/models/${providerId}/test`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ modelId: payload.modelId }),
        }),
      );
    } finally {
      await loadModelCatalog();
    }
  }

  async function deleteModelProvider(providerId: string) {
    setModelsError("");
    await responseJson(await fetch(`/api/local/models/${providerId}`, { method: "DELETE" }));
    await loadModelCatalog();
  }

  function confirmFullBashPermission() {
    if (!fullPermissionConversationId) return;
    updateConversation(fullPermissionConversationId, (conversation) => ({
      ...conversation,
      bashPermissionMode: "full",
      updatedAt: timestampNow(),
    }), true);
    setFullPermissionConversationId("");
  }

  async function decideBashCommand(
    messageId: string,
    run: ToolRun,
    decision: "approve" | "reject",
  ) {
    const commandId = run.commandId;
    if (!commandId || approvalSubmittingIds.includes(commandId) || !activeProject) return;
    setApprovalSubmittingIds((current) => [...current, commandId]);
    try {
      await responseJson(
        await fetch(
          `/api/local/workspaces/${activeProject.id}/commands/${commandId}/decision`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ decision }),
          },
        ),
      );
      updateConversation(activeConversation?.id ?? "", (conversation) => ({
        ...conversation,
        messages: conversation.messages.map((message) =>
          message.id === messageId
            ? {
                ...message,
                toolRuns: applyToolDecision(message.toolRuns, commandId, decision),
              }
            : message,
        ),
        updatedAt: timestampNow(),
      }), true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "工具审批失败。";
      setProjectError(message);
    } finally {
      setApprovalSubmittingIds((current) => current.filter((id) => id !== commandId));
    }
  }

  function openCapabilityView(kind: CapabilityKind) {
    setActiveView(kind);
    setSidebarOpen(false);
    setFilePanelOpen(false);
  }

  function openModelView() {
    setActiveView("model");
    setSidebarOpen(false);
    setFilePanelOpen(false);
    void loadModelCatalog();
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

  function selectProjectFile(file: ProjectFile) {
    if (!activeProject || file.kind !== "file") return;
    openProjectFile({ path: file.path });
  }

  function openProjectFile(file: ProjectFileTarget, projectId = activeProjectId) {
    if (!activeProject || projectId !== activeProject.id) return;
    setFileNavigation((previous) => nextFileNavigation(previous, projectId, file));
    setFilePanelVisible(true);
    if (window.matchMedia("(max-width: 1180px)").matches) setFilePanelOpen(true);
    const replacedPath =
      !activeFileTabs.openPaths.includes(file.path) &&
      activeFileTabs.openPaths.length >= MAX_OPEN_FILE_TABS
        ? activeFileTabs.openPaths[MAX_OPEN_FILE_TABS - 1]
        : undefined;
    if (replacedPath) {
      const replacedKey = previewCacheKey(activeProject.id, replacedPath);
      previewRequestRef.current[replacedKey] =
        (previewRequestRef.current[replacedKey] ?? 0) + 1;
      setPreviewCache((current) => {
        if (!(replacedKey in current)) return current;
        const next = { ...current };
        delete next[replacedKey];
        return next;
      });
    }
    setFileTabsByProject((current) => openFileTab(current, activeProject.id, file.path));
  }

  useEffect(() => {
    if (activeView !== "workflow" || !previewNavigation) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById("workspace-file-tabpanel")?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [activeView, previewNavigation]);

  function toggleProjectDirectory(file: ProjectFile) {
    if (!activeProject || file.kind !== "directory") return;
    const isExpanded = activeFileTree.expandedPaths.includes(file.path);
    const isLoaded = Object.hasOwn(activeFileTree.childrenByDirectory, file.path);
    setFileTreesByProject((current) =>
      toggleDirectoryExpansion(current, activeProject.id, file.path),
    );
    if (!isExpanded && !isLoaded && !activeFileTree.loadingPaths.includes(file.path)) {
      void loadProjectDirectory(activeProject.id, file.path);
    }
  }

  function activateProjectFile(path: string | null) {
    if (!activeProject) return;
    setFileNavigation(null);
    setFileTabsByProject((current) => activateFileTab(current, activeProject.id, path));
  }

  function closeProjectFile(path: string) {
    if (!activeProject) return;
    setFileNavigation((current) => current?.projectId === activeProject.id && current.path === path ? null : current);
    const key = previewCacheKey(activeProject.id, path);
    previewRequestRef.current[key] = (previewRequestRef.current[key] ?? 0) + 1;
    setPreviewCache((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
    setFileTabsByProject((current) => closeFileTab(current, activeProject.id, path));
  }

  function handleFileTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    currentPath: string | null,
  ) {
    if (!activeProject || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }
    event.preventDefault();
    const paths: Array<string | null> = [null, ...activeFileTabs.openPaths];
    const currentIndex = paths.indexOf(currentPath);
    let nextIndex = currentIndex;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = paths.length - 1;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + paths.length) % paths.length;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % paths.length;
    const nextPath = paths[nextIndex] ?? null;
    activateProjectFile(nextPath);
    requestAnimationFrame(() => document.getElementById(fileTabId(activeProject.id, nextPath))?.focus());
  }

  async function sendMessage(rawInput = input, continueTurnId?: string) {
    const content = rawInput.trim();
    if ((!content && !continueTurnId) || !activeConversation || !activeProject || !capabilitiesReady || !selectedModel || sendLockRef.current) return;
    const conversation = activeConversation, id = conversation.id, active = conversation.activeTurn;
    const config = { model: { providerId: selectedModel.providerId, modelId: selectedModel.modelId }, enabledSkills, enabledTools, enabledMcps,
      agentConfig: { ...activeAgentConfig, mainModel: { providerId: selectedModel.providerId, modelId: selectedModel.modelId } },
      agentPrompts, bashApprovalMode: conversation.bashApprovalMode, bashPermissionMode: conversation.bashPermissionMode };
    const submission = prepareChatSubmission(chatRequestIds.current, { id, content, continueTurnId, activeTurnId: isBusy ? active?.id : undefined, config, requestId: makeId() });
    sendLockRef.current = true; setChatSubmitting(true); setChatActionError("");
    try {
      if (conversation.schemaVersion !== 2) await chatPersistenceRef.current?.saveNow(conversation);
      const accepted = await chatRequest<{ turn?: ChatTurn }>(submission.path, submission.body);
      // Acceptance is already durable. A failed display refresh must not make
      // the acknowledged input look unsent or encourage a second execution.
      setConversations(current => current.map(c => c.id === id ? { ...c, schemaVersion: 2, ...(accepted.turn ? { activeTurn: accepted.turn } : {}) } : c));
      if (!continueTurnId) setInput(current => current.trim() === content ? "" : current);
      chatRequestIds.current.delete(submission.key);
      const snapshot = await chatRequest<{ conversation: Conversation }>(id).catch(() => undefined);
      if (snapshot) setConversations(current => current.map(c => c.id === id ? snapshot.conversation : c));
    } catch (e) {
      if (e && typeof e === "object" && "status" in e && [400, 404, 409].includes(Number(e.status))) chatRequestIds.current.delete(submission.key);
      setChatActionError(e instanceof Error ? e.message : "聊天提交失败，输入已保留。");
    }
    finally { sendLockRef.current = false; setChatSubmitting(false); }
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
    if (!filePreview?.content || !activeFilePath) return;
    await navigator.clipboard.writeText(filePreview.content);
    setCopiedPreviewPath(activeFilePath);
    window.setTimeout(() => setCopiedPreviewPath(""), 1_500);
  }

  const modeSwitch=<nav className="mode-switch" aria-label="工作模式"><button className={appMode==="workspace"?"active":""} onClick={()=>changeMode("workspace")}>聊天</button><button className={appMode==="workflow"?"active":""} onClick={()=>changeMode("workflow")}>Workflow</button></nav>;
  return (
    <main
      className={`app-shell ${activeView !== "workspace" && activeView !== "workflow" ? "library-mode" : ""} ${sidebarVisible ? "" : "sidebar-collapsed"} ${filePanelVisible ? "" : "file-panel-collapsed"}`}
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
          <div className="brand-mark">尺</div>
          <div>
            <strong>尺度投资</strong>
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

        <div className="sidebar-divider" aria-hidden="true" />
        <nav className="project-list" aria-label="项目与会话列表">
          {projects.map((project) => {
            const projectConversations = (appMode === "workflow" ? workflowConversations.map(c=>({...c,projectId:c.workspaceId})) : conversations).filter(
              (conversation) => conversation.projectId === project.id,
            );
            const active = project.id === activeProjectId;
            const expanded = expandedProjectIds.includes(project.id);
            return (
              <section
                className={`project-group ${active ? "active" : ""} ${expanded ? "expanded" : ""} ${projectMenuId === project.id ? "menu-open" : ""}`}
                key={project.id}
              >
                <button
                  className="project-heading"
                  type="button"
                  aria-label={`${expanded ? "收起" : "展开"}${project.name}的会话`}
                  aria-expanded={expanded}
                  onClick={() => toggleProjectExpansion(project.id)}
                >
                  <FolderOpen size={15} />
                  <span>
                    <strong>{project.name}</strong>
                  </span>
                </button>
                <button
                  className="project-new-conversation-trigger"
                  type="button"
                  aria-label={`在${project.name}中新建会话`}
                  title="新建会话"
                  onClick={(event) => {
                    event.stopPropagation();
                    newConversation(project.id);
                  }}
                >
                  <Plus size={16} />
                </button>
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
                        className={`conversation-row ${conversation.id === (appMode === "workflow" ? workflowActiveIds[project.id] : activeId) ? "active" : ""}`}
                        key={conversation.id}
                      >
                        <button
                          className="conversation-select"
                          type="button"
                          onClick={() => selectConversation(conversation.id, project.id)}
                        >
                          <span>
                            <strong>{conversation.title}</strong>
                          </span>
                        </button>
                        {appMode === "workspace" && <button
                          className="delete-chat"
                          type="button"
                          aria-label={`删除${conversation.title}`}
                          onClick={() => deleteConversation(conversation.id)}
                        >
                          <Trash2 size={14} />
                        </button>}
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
        {chatSaveError && <div className="sidebar-error">{chatSaveError}</div>}
        <nav className="sidebar-capability-nav" aria-label="Agent 能力管理">
          <button
            className={activeView === "agent" ? "active" : ""}
            type="button"
            onClick={() => setActiveView("agent")}
          >
            <Bot size={15} />
            <span>Agent</span>
          </button>
          <button
            className={activeView === "subagent" ? "active" : ""}
            type="button"
            onClick={() => setActiveView("subagent")}
          >
            <Bot size={15} />
            <span>SubAgent</span>
          </button>
          <button
            className={activeView === "skill" ? "active" : ""}
            type="button"
            onClick={() => openCapabilityView("skill")}
          >
            <BookOpenCheck size={15} />
            <span>技能</span>
          </button>
          <button
            className={activeView === "tool" ? "active" : ""}
            type="button"
            onClick={() => openCapabilityView("tool")}
          >
            <Wrench size={15} />
            <span>工具</span>
          </button>
          <button
            className={activeView === "mcp" ? "active" : ""}
            type="button"
            onClick={() => openCapabilityView("mcp")}
          >
            <Plug size={15} />
            <span>MCP</span>
          </button>
          <button
            className={activeView === "trace" ? "active" : ""}
            type="button"
            onClick={() => {
              setTraceFocusId("");
              setActiveView("trace");
            }}
          >
            <Activity size={15} />
            <span>Trace</span>
          </button>
          <button
            className={activeView === "database" ? "active" : ""}
            type="button"
            onClick={() => setActiveView("database")}
          >
            <Database size={15} />
            <span>数据库</span>
          </button>
          <button
            className={activeView === "model" ? "active" : ""}
            type="button"
            onClick={openModelView}
          >
            <Cpu size={15} />
            <span>模型</span>
          </button>
          <button
            className={activeView === "user" ? "active" : ""}
            type="button"
            onClick={() => setActiveView("user")}
          >
            <UserRound size={15} />
            <span>用户</span>
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

      {activeView === "workspace" || activeView === "workflow" ? (
        <>
      {activeView === "workflow" ? (
        <WorkflowWorkspace key={activeProjectId} conversationId={workflowActiveIds[activeProjectId]??""} onConversationChange={id=>chooseWorkflow(id)} modeSwitch={modeSwitch} onSidebar={()=>setSidebarOpen(true)} workspaceId={activeProjectId} config={activeAgentConfig}
          model={selectedModel} models={availableModels} onConfigure={() => setActiveView("subagent")} onTrace={openTrace}
          onOpenFiles={() => setFilePanelOpen(true)} onOpenFile={openProjectFile} onFilesChanged={refreshProjectFiles} />
      ) : (
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
            </div>
          </div>
          {modeSwitch}
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
              {projectChatDisplay(activeConversation.messages, activeConversation.activeTurn, activeConversation.turns).map((row) => {
                const { message } = row;
                const isUnfinishedAssistantMessage =
                  message.role === "assistant" && row.indicator;

                return (
                  <article className={`message ${message.role}`} key={message.id}>
                    <div className="message-body">
                      <div className={`message-content ${isUnfinishedAssistantMessage ? "is-streaming" : ""}`}>
                        {row.header && message.role === "assistant" && message.traceStatus && (
                          message.traceId ? (
                            <button className="message-trace-link" type="button" onClick={() => openTrace(message.traceId!)}>
                              <Activity size={12} />
                              查看 Trace
                            </button>
                          ) : (
                            <span className="message-trace-unavailable">Trace 未记录</span>
                          )
                        )}
                        {row.header && message.role === "assistant" && Boolean(row.toolRuns.length) && (
                          <ToolRunStack
                            runs={row.toolRuns}
                            durationMs={row.durationMs ?? getMessageDuration(message)}
                            startedAt={row.startedAt}
                            isRunning={row.running}
                            messageId={message.id}
                            projectPath={activeProject?.path}
                            approvalSubmittingIds={approvalSubmittingIds}
                            expanded={row.running || toolRunsAreExpanded(message.id)}
                            onToggle={() => toggleToolRuns(message.id)}
                            onSubAgentExpand={() => setExpandedToolMessageIds((current) =>
                              current.includes(message.id) ? current : [...current, message.id])}
                            onDecision={(messageId, run, decision) =>
                              void decideBashCommand(row.owners.get(run.toolCallId) ?? messageId, run, decision)
                            }
                          />
                        )}
                        {message.inputStatus === "pending" && <small>待处理</small>}
                        {message.inputStatus === "cancelled" && <small>未处理，已停止</small>}
                        {row.parts.map(part => part.content ? <MarkdownMessage key={part.id} content={part.content} projectNavigation={{ baseDirectory: "", onOpenFile: (target) => openProjectFile(target, activeProjectId) }} /> : null)}
                        {row.truncated && <small role="status">回答已达模型输出长度上限，内容可能不完整。</small>}
                        {row.emptyFinal && <small role="status">任务已完成，但模型未返回可展示的最终回答。</small>}
                        {isUnfinishedAssistantMessage && (
                          <span className="thinking-indicator" role="status" aria-label="Agent 正在回复">
                            <i />
                            <i />
                            <i />
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="welcome-state">
              <h2>
                今天想完成
                <br />
                什么研究？
              </h2>
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
          {(chatActionError || chatConnection.error || chatConnection.phase || chatStopping || activeConversation?.activeTurn?.reason) && <small role="status">{chatActionError || chatConnection.error || (chatStopping ? "正在停止…" : chatConnection.phase) || activeConversation?.activeTurn?.reason}</small>}
          {!isBusy && ["interrupted", "failed"].includes(activeConversation?.activeTurn?.status ?? "") && <button type="button" className="composer-control" disabled={chatSubmitting} onClick={() => void sendMessage("", activeConversation?.activeTurn?.id)}>继续</button>}
          <ComposerSurface onSubmit={handleSubmit}>
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
              rows={1}
              disabled={!activeConversation || !activeProject || !capabilitiesReady || chatStopping}
              aria-label="投研任务"
            />
            <div className="composer-footer">
              <div className="composer-options" aria-label="Agent 运行设置">
                <label className="composer-control model-control" title="选择本轮使用的模型">
                  <Cpu size={12} />
                  <span>模型</span>
                  <select
                    aria-label="模型选择"
                    value={selectedModelId}
                    onChange={(event) => selectModel(event.target.value)}
                    disabled={!availableModels.length || isBusy}
                  >
                    {!availableModels.length && <option value="">暂无可用模型</option>}
                    {modelProviders
                      .filter((provider) => provider.verified)
                      .map((provider) => (
                        <optgroup label={provider.label} key={provider.id}>
                          {availableModels
                            .filter((model) => model.providerId === provider.id)
                            .map((model) => (
                              <option value={`${model.providerId}:${model.modelId}`} key={`${model.providerId}:${model.modelId}`}>
                                {model.label}
                              </option>
                            ))}
                        </optgroup>
                      ))}
                  </select>
                  <ChevronDown size={11} />
                </label>
                {activeConversation && (
                  <>
                    <button
                      className="composer-control"
                      type="button"
                      onClick={toggleBashApprovalMode}
                      disabled={isBusy}
                      title="切换 Bash、Python 与 Skill 脚本是否逐条确认"
                    >
                      <span>本地执行</span>
                      <strong>
                        {activeConversation.bashApprovalMode === "auto" ? "自动执行" : "每条确认"}
                      </strong>
                    </button>
                    <button
                      className="composer-control"
                      type="button"
                      onClick={toggleBashPermissionMode}
                      disabled={isBusy}
                      title="切换 Bash 文件访问权限"
                    >
                      <span>Agent</span>
                      <strong>
                        {activeConversation.bashPermissionMode === "full"
                          ? "完整本机权限"
                          : "项目沙箱"}
                      </strong>
                    </button>
                  </>
                )}
              </div>
              {isBusy && <button className="send-button stop" type="button" aria-label="停止" disabled={chatStopping} onClick={stopActiveRun}><CircleStop size={18} /></button>}
              <button className="send-button" type="submit" aria-label={isBusy ? "发送补充" : "发送"} title={isBusy ? "发送补充，下次推理时处理" : "发送"} disabled={!input.trim() || !activeProject || !capabilitiesReady || !selectedModel || chatSubmitting || chatStopping}><Send size={17} /></button>
            </div>
          </ComposerSurface>
        </div>
      </section>
      )}

      <aside className={`artifact-panel workspace-panel ${filePanelOpen ? "mobile-open" : ""}`}>
        <div className="workspace-tabs-bar">
          <div
            className="workspace-tabs-list"
            role="tablist"
            aria-label="项目文件标签页"
            style={
              {
                "--workspace-tab-count": activeProject
                  ? activeFileTabs.openPaths.length + 1
                  : 1,
              } as CSSProperties
            }
          >
            {activeProject ? (
              <button
                id={fileTabId(activeProject.id, null)}
                className={`workspace-directory-tab ${activeFilePath === null ? "active" : ""}`}
                type="button"
                role="tab"
                aria-selected={activeFilePath === null}
                aria-controls="workspace-file-tabpanel"
                tabIndex={activeFilePath === null ? 0 : -1}
                title={`文件目录 · ${activeProject.name}`}
                onClick={() => activateProjectFile(null)}
                onKeyDown={(event) => handleFileTabKeyDown(event, null)}
              >
                <FolderOpen size={14} />
                <span>{activeProject.name}</span>
              </button>
            ) : (
              <div className="workspace-tabs-placeholder">
                <FolderOpen size={14} />
                <span>项目文件</span>
              </div>
            )}

            <div className="workspace-file-tabs-scroll">
              {activeProject &&
                activeFileTabs.openPaths.map((path) => {
                  const file = loadedFiles.find(
                    (entry) => entry.kind === "file" && entry.path === path,
                  );
                  const Icon = file ? fileTreeIcon(file) : FileText;
                  const active = activeFilePath === path;
                  return (
                    <div className={`workspace-file-tab ${active ? "active" : ""}`} key={path}>
                      <button
                        id={fileTabId(activeProject.id, path)}
                        className="workspace-file-tab-select"
                        type="button"
                        role="tab"
                        aria-selected={active}
                        aria-controls="workspace-file-tabpanel"
                        tabIndex={active ? 0 : -1}
                        title={path}
                        onClick={() => activateProjectFile(path)}
                        onKeyDown={(event) => handleFileTabKeyDown(event, path)}
                      >
                        <Icon size={13} />
                        <span>{file?.name ?? fileNameFromPath(path)}</span>
                      </button>
                      <button
                        className="workspace-file-tab-close"
                        type="button"
                        aria-label={`关闭 ${path}`}
                        title="关闭标签"
                        onClick={() => closeProjectFile(path)}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  );
                })}
            </div>
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
              onClick={() => activeProject && refreshProjectFiles(activeProject.id)}
              disabled={!activeProject || filesLoading}
              aria-label="刷新项目文件"
              title="刷新"
            >
              <RefreshCw size={14} className={filesLoading ? "spinning" : ""} />
            </button>
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
        ) : activeFilePath === null ? (
          <section
            id="workspace-file-tabpanel"
            tabIndex={-1}
            className="workspace-tab-content workspace-file-browser"
            role="tabpanel"
            aria-labelledby={fileTabId(activeProject.id, null)}
          >
              {!rootFilesLoaded && activeFileTree.loadingPaths.includes("") ? (
                <div className="workspace-files-empty">
                  <RefreshCw size={20} className="spinning" />
                  <span>正在读取项目文件…</span>
                </div>
              ) : activeFileTree.errorsByPath[""] && !rootFilesLoaded ? (
                <div className="workspace-files-empty workspace-files-error">
                  <CircleX size={20} />
                  <strong>无法读取项目文件</strong>
                  <span>{activeFileTree.errorsByPath[""]}</span>
                  <button type="button" onClick={() => void loadProjectDirectory(activeProject.id)}>
                    重新加载
                  </button>
                </div>
              ) : files.length > 0 ? (
                <FileSystemTree
                  ariaLabel="项目文件列表"
                  entries={files}
                  tree={activeFileTree}
                  onDirectoryToggle={toggleProjectDirectory}
                  onDirectoryRetry={(file) => void loadProjectDirectory(activeProject.id, file.path)}
                  onFileSelect={selectProjectFile}
                />
              ) : rootFilesLoaded ? (
                <div className="workspace-files-empty">
                  <FolderOpen size={22} />
                  <strong>项目文件夹为空</strong>
                  <span>Agent 保存产出后会自动刷新</span>
                </div>
              ) : (
                <div className="workspace-files-empty">
                  <RefreshCw size={20} className="spinning" />
                  <span>正在读取项目文件…</span>
                </div>
              )}
          </section>
        ) : (
          <section
            id="workspace-file-tabpanel"
            tabIndex={-1}
            className="workspace-tab-content workspace-preview"
            role="tabpanel"
            aria-labelledby={fileTabId(activeProject.id, activeFilePath)}
          >
              {activePreviewEntry?.status === "loading" ? (
                <div className="workspace-preview-empty">
                  <RefreshCw size={20} className="spinning" />
                  <span>正在读取文件…</span>
                </div>
              ) : activePreviewEntry?.status === "error" ? (
                <div className="workspace-preview-empty workspace-preview-error">
                  <CircleX size={22} />
                  <strong>无法预览文件</strong>
                  <span>{activePreviewEntry.message}</span>
                  <button
                    type="button"
                    onClick={() => void loadFilePreview(activeProject.id, activeFilePath)}
                  >
                    重新加载
                  </button>
                </div>
              ) : filePreview ? (
                <>
                  <header className="workspace-preview-toolbar">
                    <div className="workspace-preview-title">
                      <FileText size={14} />
                      <span title={filePreview.path}>{filePreview.path}</span>
                    </div>
                    <div className="workspace-preview-actions">
                      {filePreview.kind === "kami-html" && (
                        <button
                          type="button"
                          aria-label={kamiPreviewMode === "preview" ? "查看 Kami 源码" : "预览 Kami 产物"}
                          title={kamiPreviewMode === "preview" ? "源码" : "预览"}
                          onClick={() => setKamiPreviewMode(current => current === "preview" ? "source" : "preview")}
                        >
                          {kamiPreviewMode === "preview" ? "源码" : "预览"}
                        </button>
                      )}
                      {filePreview.content && (
                        <button
                          type="button"
                          aria-label={copiedPreviewPath === activeFilePath ? "已复制文件" : "复制文件"}
                          title={copiedPreviewPath === activeFilePath ? "已复制" : "复制"}
                          onClick={() => void copyPreview()}
                        >
                          <Copy size={13} />
                        </button>
                      )}
                      <a
                        href={downloadAssetUrl}
                        download={filePreview.name}
                        aria-label="下载文件"
                        title="下载文件"
                      >
                        <Download size={13} />
                      </a>
                    </div>
                  </header>
                  <div className={`workspace-preview-content ${filePreview.kind}`}>
                    {filePreview.kind === "text" && filePreview.content !== undefined &&
                      ([".md", ".mdx"].includes(filePreview.extension) && !previewNavigation?.line ? (
                        <div className="markdown-preview">
                          <MarkdownMessage content={filePreview.content} projectNavigation={{ baseDirectory: activeFilePath.split("/").slice(0, -1).join("/"), onOpenFile: (target) => openProjectFile(target, activeProjectId) }} />
                        </div>
                      ) : (
                        <CodePreview
                          content={filePreview.content}
                          extension={filePreview.extension}
                          name={filePreview.name}
                          targetLine={previewNavigation?.line}
                          navigationRequestId={previewNavigation?.requestId}
                        />
                      ))}
                    {filePreview.kind === "image" && previewAssetUrl && (
                      // The data comes from the user-selected local workspace.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={previewAssetUrl} alt={filePreview.name} />
                    )}
                    {filePreview.kind === "pdf" && previewAssetUrl && (
                      <iframe src={previewAssetUrl} title={filePreview.name} />
                    )}
                    {filePreview.kind === "kami-html" && filePreview.content !== undefined && (
                      kamiPreviewMode === "preview" ? (
                        <iframe
                          srcDoc={filePreview.content}
                          title={`${filePreview.name} Kami 预览`}
                          sandbox="allow-scripts"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <CodePreview content={filePreview.content} extension=".html" name={filePreview.name} />
                      )
                    )}
                    {(filePreview.kind === "unsupported" || filePreview.kind === "too-large") && (
                      <div className="unsupported-preview">
                        <File size={28} />
                        <strong>暂不支持在线预览</strong>
                        <span>
                          {filePreview.kind === "too-large"
                            ? `文件超过预览限制（${formatBytes(filePreview.size)}，上限 ${formatBytes(filePreview.previewLimitBytes ?? 0)}）`
                            : "该文件可下载后使用对应应用打开"}
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
                  <strong>正在准备预览</strong>
                  <span>{activeFilePath}</span>
                </div>
              )}
          </section>
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
      ) : <section className="management-workspace"><header className="chat-header"><button className="management-back" onClick={()=>setActiveView(appMode)}>返回对话</button>{modeSwitch}</header>{activeView === "agent" ? (
        <AgentPromptPage
          value={agentPrompts.main}
          onChange={updateAgentPrompt}
        />
      ) : activeView === "subagent" ? (
        <SubAgentLibrary
          catalog={capabilityCatalog}
          config={activeAgentConfig}
          models={availableModels}
          onCustomUpdate={updateCustomSubAgent}
          onCreateCustom={createCustomSubAgentForProject}
          onSupplementDefaults={() => setAgentConfigsByProject(current => ({ ...current, [activeProjectId]: supplementDefaultAgents(current[activeProjectId] ?? createEmptyProjectAgentConfig(), true) }))}
          onDeleteCustom={deleteCustomSubAgent}
        />
      ) : activeView === "model" ? (
        <ModelLibrary
          providers={modelProviders}
          loading={modelsLoading}
          error={modelsError}
          onSaveAndTest={saveAndTestModelProvider}
          onDelete={deleteModelProvider}
          onClose={() => setActiveView(appMode)}
        />
      ) : activeView === "user" ? (
        <UserUsagePage activity={usageActivity} />
      ) : activeView === "trace" ? (
        <TracePage
          key={`${activeProjectId}:${traceFocusId}`}
          workspaceId={activeProjectId}
          focusTraceId={traceFocusId}
          onOpenConversation={openTraceConversation}
        />
      ) : activeView === "database" ? (
        <DatabasePage />
      ) : (
        <CapabilityLibrary
          key={activeView}
          kind={activeView}
          items={
            activeView === "skill"
              ? capabilityCatalog.skills
              : activeView === "tool"
                ? capabilityCatalog.tools
                : capabilityCatalog.mcps
          }
          enabledNames={
            activeView === "skill"
              ? enabledSkills
              : activeView === "tool"
                ? enabledTools
                : enabledMcps
          }
          onToggle={(name) => toggleCapability(activeView, name)}
          onRefresh={() => setCapabilityRefreshVersion((current) => current + 1)}
          onSkillImport={activeView === "skill" ? importSkillFolder : undefined}
          onSkillUpdate={activeView === "skill" ? updateSkill : undefined}
          onSkillDelete={activeView === "skill" ? deleteSkill : undefined}
          onSkillReadResource={activeView === "skill" ? readSkillResource : undefined}
          onSkillWriteResource={activeView === "skill" ? writeSkillResource : undefined}
          onSkillDeleteResource={activeView === "skill" ? deleteSkillResource : undefined}
          onSkillExport={activeView === "skill" ? exportSkill : undefined}
          onClose={() => setActiveView(appMode)}
        />
      )}</section>}
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
