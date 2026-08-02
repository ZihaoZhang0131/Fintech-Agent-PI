"use client";

import {
  Bot,
  BookOpenCheck,
  Braces,
  ChevronDown,
  CircleStop,
  CircleCheck,
  CircleX,
  Clock3,
  Copy,
  Cpu,
  Download,
  FileChartColumn,
  FileCode2,
  FileText,
  ExternalLink,
  Info,
  Menu,
  MessageSquareText,
  PanelRight,
  Plus,
  Search,
  Send,
  Sparkles,
  Trash2,
  TrendingUp,
  UserRound,
  X,
} from "lucide-react";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  applyToolEnd,
  applyToolStart,
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
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
};

type HealthInfo = {
  status: "ok";
  provider: string;
  model: string;
  keyConfigured: boolean;
  webSearch?: {
    provider: string;
    mode: "api-key" | "keyless";
  };
};

type AgentStatus = "idle" | "connecting" | "streaming" | "done" | "stopped" | "error";

type Artifact = {
  id: string;
  kind: "report" | "code" | "pdf";
  title: string;
  content?: string;
  url?: string;
  language?: string;
  createdAt: number;
};

type StreamEvent =
  | { type: "start"; requestId: string }
  | ToolStartEvent
  | ToolEndEvent
  | { type: "delta"; text: string }
  | { type: "done"; durationMs: number; usage?: { input: number; output: number; totalTokens: number } }
  | { type: "error"; message: string };

const STORAGE_KEY = "pi-research-agent:conversations:v1";

const SUGGESTIONS = [
  {
    icon: TrendingUp,
    title: "拆解一家公司",
    prompt: "请用核心结论、商业模式、竞争优势和主要风险四部分，分析贵州茅台。",
  },
  {
    icon: FileChartColumn,
    title: "梳理财务逻辑",
    prompt: "如果我要分析一家公司的盈利质量，应该重点看哪些财务指标？",
  },
  {
    icon: Sparkles,
    title: "搭建研究框架",
    prompt: "帮我搭建一个新能源汽车产业链的研究框架，并列出需要验证的关键问题。",
  },
];

const STATUS_COPY: Record<AgentStatus, { label: string; detail: string }> = {
  idle: { label: "等待提问", detail: "Agent 已就绪" },
  connecting: { label: "正在连接", detail: "正在建立模型请求" },
  streaming: { label: "正在生成", detail: "DeepSeek 正在回复" },
  done: { label: "本轮完成", detail: "回答已保存到本地" },
  stopped: { label: "已停止", detail: "保留已生成的内容" },
  error: { label: "调用失败", detail: "请检查本地服务或 API Key" },
};

function makeId() {
  return crypto.randomUUID();
}

function timestampNow() {
  return Date.now();
}

function makeConversation(): Conversation {
  return {
    id: makeId(),
    title: "新对话",
    messages: [],
    updatedAt: timestampNow(),
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

function makeTitle(input: string) {
  const compact = input.replace(/\s+/g, " ").trim();
  return compact.length > 18 ? `${compact.slice(0, 18)}…` : compact;
}

function makeArtifactTitle(content: string, index: number) {
  const heading = content.match(/^#{1,3}\s+(.+)$/m)?.[1]?.trim();
  const firstLine = content
    .split("\n")
    .map((line) => line.replace(/^[-#*>\d.\s]+/, "").trim())
    .find(Boolean);
  const title = heading ?? firstLine ?? `研究结果 ${index + 1}`;
  return title.length > 22 ? `${title.slice(0, 22)}…` : title;
}

function extractArtifacts(messages: ChatMessage[]): Artifact[] {
  return messages.flatMap((message, messageIndex) => {
    if (message.role !== "assistant" || !message.content.trim()) return [];

    const artifacts: Artifact[] = [
      {
        id: `${message.id}:report`,
        kind: "report",
        title: makeArtifactTitle(message.content, messageIndex),
        content: message.content,
        createdAt: message.createdAt,
      },
    ];

    const codePattern = /```([\w.+-]*)\n([\s\S]*?)```/g;
    let codeMatch: RegExpExecArray | null;
    let codeIndex = 0;
    while ((codeMatch = codePattern.exec(message.content)) !== null) {
      const language = codeMatch[1] || "text";
      artifacts.push({
        id: `${message.id}:code:${codeIndex}`,
        kind: "code",
        title: `${language.toUpperCase()} 代码 ${codeIndex + 1}`,
        content: codeMatch[2].trimEnd(),
        language,
        createdAt: message.createdAt,
      });
      codeIndex += 1;
    }

    const pdfPattern = /\[([^\]]+)\]\(((?:https?:\/\/|\/)[^\s)]+\.pdf(?:\?[^\s)]*)?)\)/gi;
    let pdfMatch: RegExpExecArray | null;
    let pdfIndex = 0;
    while ((pdfMatch = pdfPattern.exec(message.content)) !== null) {
      artifacts.push({
        id: `${message.id}:pdf:${pdfIndex}`,
        kind: "pdf",
        title: pdfMatch[1] || `PDF ${pdfIndex + 1}`,
        url: pdfMatch[2],
        createdAt: message.createdAt,
      });
      pdfIndex += 1;
    }

    return artifacts;
  });
}

function artifactExtension(artifact: Artifact) {
  if (artifact.kind === "report") return "md";
  if (artifact.language === "typescript" || artifact.language === "ts") return "ts";
  if (artifact.language === "javascript" || artifact.language === "js") return "js";
  if (artifact.language === "python" || artifact.language === "py") return "py";
  return "txt";
}

function parseStoredConversations(value: string | null): Conversation[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as Conversation[];
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

function extractSseEvents(buffer: string) {
  const blocks = buffer.split("\n\n");
  const remainder = blocks.pop() ?? "";
  const events = blocks.flatMap((block) => {
    const dataLine = block
      .split("\n")
      .find((line) => line.startsWith("data:"));
    if (!dataLine) return [];
    try {
      return [JSON.parse(dataLine.slice(5).trim()) as StreamEvent];
    } catch {
      return [];
    }
  });
  return { events, remainder };
}

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<AgentStatus>("idle");
  const [health, setHealth] = useState<HealthInfo | null>(null);
  const [durationMs, setDurationMs] = useState<number | null>(null);
  const [tokenUsage, setTokenUsage] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [artifactPanelOpen, setArtifactPanelOpen] = useState(false);
  const [selectedArtifactId, setSelectedArtifactId] = useState("");
  const [copiedArtifactId, setCopiedArtifactId] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === activeId) ?? conversations[0],
    [activeId, conversations],
  );

  const isBusy = status === "connecting" || status === "streaming";
  const statusCopy = STATUS_COPY[status];
  const artifacts = useMemo(
    () => extractArtifacts(activeConversation?.messages ?? []),
    [activeConversation?.messages],
  );
  const selectedArtifact =
    artifacts.find((artifact) => artifact.id === selectedArtifactId) ?? artifacts.at(-1);
  const runningTool = useMemo(
    () =>
      (activeConversation?.messages ?? [])
        .flatMap((message) => message.toolRuns ?? [])
        .filter((run) => run.status === "running")
        .at(-1),
    [activeConversation?.messages],
  );

  useEffect(() => {
    const stored = parseStoredConversations(localStorage.getItem(STORAGE_KEY));
    const initial = stored.length > 0 ? stored : [makeConversation()];
    // Browser storage is intentionally restored only after the client mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConversations(initial);
    setActiveId(initial[0].id);
    setHydrated(true);

    fetch("/api/health")
      .then(async (response) => {
        if (!response.ok) throw new Error("health check failed");
        return (await response.json()) as HealthInfo;
      })
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations, hydrated]);

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

  function newConversation() {
    if (isBusy) abortRef.current?.abort();
    const next = makeConversation();
    setConversations((current) => [next, ...current]);
    setActiveId(next.id);
    setInput("");
    setStatus("idle");
    setDurationMs(null);
    setTokenUsage(null);
    setSelectedArtifactId("");
    setSidebarOpen(false);
    requestAnimationFrame(() => textareaRef.current?.focus());
  }

  function deleteConversation(id: string) {
    if (isBusy && id === activeId) abortRef.current?.abort();
    setConversations((current) => {
      const remaining = current.filter((item) => item.id !== id);
      const next = remaining.length > 0 ? remaining : [makeConversation()];
      if (id === activeId) setActiveId(next[0].id);
      return next;
    });
    setStatus("idle");
    setSelectedArtifactId("");
  }

  function selectConversation(id: string) {
    if (isBusy && id !== activeId) return;
    setActiveId(id);
    setStatus("idle");
    setDurationMs(null);
    setTokenUsage(null);
    setSelectedArtifactId("");
    setSidebarOpen(false);
  }

  async function sendMessage(rawInput = input) {
    const content = rawInput.trim();
    if (!content || !activeConversation || isBusy) return;

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
    setSelectedArtifactId(`${assistantId}:report`);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
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
          if (event.type === "start") {
            setStatus("streaming");
          }

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
          }

          if (event.type === "error") {
            throw new Error(event.message);
          }
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
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  function stopGeneration() {
    abortRef.current?.abort();
  }

  async function copyArtifact(artifact: Artifact) {
    if (!artifact.content) return;
    await navigator.clipboard.writeText(artifact.content);
    setCopiedArtifactId(artifact.id);
    window.setTimeout(() => setCopiedArtifactId(""), 1_500);
  }

  function downloadArtifact(artifact: Artifact) {
    if (artifact.kind === "pdf" && artifact.url) {
      window.open(artifact.url, "_blank", "noopener,noreferrer");
      return;
    }
    if (!artifact.content) return;
    const blob = new Blob([artifact.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${artifact.title.replace(/[\\/:*?"<>|]/g, "-")}.${artifactExtension(artifact)}`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="app-shell">
      <div
        className={`mobile-backdrop ${sidebarOpen || artifactPanelOpen ? "visible" : ""}`}
        onClick={() => {
          setSidebarOpen(false);
          setArtifactPanelOpen(false);
        }}
        aria-hidden="true"
      />

      <aside className={`sidebar ${sidebarOpen ? "mobile-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">知</div>
          <div>
            <strong>知衡</strong>
            <span>Research Agent</span>
          </div>
        </div>

        <button className="new-chat-button" type="button" onClick={newConversation}>
          <Plus size={17} strokeWidth={2} />
          新建研究对话
        </button>

        <div className="sidebar-section-label">本地会话</div>
        <nav className="conversation-list" aria-label="对话列表">
          {conversations.map((conversation) => (
            <div
              className={`conversation-row ${conversation.id === activeConversation?.id ? "active" : ""}`}
              key={conversation.id}
            >
              <button
                className="conversation-select"
                type="button"
                onClick={() => selectConversation(conversation.id)}
              >
                <MessageSquareText size={15} />
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
        </nav>

        <div className="sidebar-footnote">
          <Info size={14} />
          <span>对话仅保存在当前浏览器</span>
        </div>
      </aside>

      <section className="chat-column">
        <header className="chat-header">
          <div className="header-title-group">
            <button
              className="mobile-icon-button sidebar-trigger"
              type="button"
              aria-label="打开会话列表"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={19} />
            </button>
            <div>
              <h1>{activeConversation?.title ?? "投研对话"}</h1>
              <span className="header-subtitle">
                <span
                  className={`status-dot ${isBusy || health?.keyConfigured ? "online" : "offline"}`}
                />
                {isBusy
                  ? runningTool
                    ? `正在调用 ${runningTool.label}`
                    : statusCopy.detail
                  : health?.keyConfigured
                    ? statusCopy.label
                    : "正在连接本地服务"}
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
            aria-label="打开产出物面板"
            onClick={() => setArtifactPanelOpen(true)}
          >
            <PanelRight size={19} />
          </button>
        </header>

        <div className="chat-scroll-area">
          {activeConversation?.messages.length ? (
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
                                  {run.toolName === "load_skill" ? (
                                    <BookOpenCheck size={14} />
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
                                  {run.status === "running"
                                    ? "调用中"
                                    : run.status === "success"
                                      ? "已完成"
                                      : "失败"}
                                </span>
                              </header>
                              {run.query && <p className="tool-run-query">{run.query}</p>}
                              <div className="tool-run-meta">
                                {run.status === "running" ? (
                                  <span>正在获取网络信息…</span>
                                ) : (
                                  <>
                                    {run.summary && <span>{run.summary}</span>}
                                    {run.resultCount !== undefined && (
                                      <span>{run.resultCount} 个结果</span>
                                    )}
                                    {run.durationMs !== undefined && (
                                      <span>
                                        <Clock3 size={11} /> {formatDuration(run.durationMs)}
                                      </span>
                                    )}
                                  </>
                                )}
                              </div>
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
                <span />
                PI AGENT WORKSPACE
              </div>
              <h2>
                今天想研究
                <br />
                什么问题？
              </h2>
              <p>
                从一家公司、一条产业链或一个财务问题开始。
                <br />
                我会给出结构化分析，并明确仍需验证的信息。
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
              onKeyDown={handleKeyDown}
              placeholder="输入你的投研问题…"
              rows={1}
              disabled={!activeConversation || isBusy}
              aria-label="投研问题"
            />
            <div className="composer-footer">
              <span>Enter 发送 · Shift + Enter 换行</span>
              {isBusy ? (
                <button
                  className="send-button stop"
                  type="button"
                  onClick={stopGeneration}
                  aria-label="停止生成"
                >
                  <CircleStop size={18} />
                </button>
              ) : (
                <button
                  className="send-button"
                  type="submit"
                  disabled={!input.trim()}
                  aria-label="发送问题"
                >
                  <Send size={17} />
                </button>
              )}
            </div>
          </form>
          <p className="disclaimer">AI 生成内容仅供研究参考，不构成任何投资建议。</p>
        </div>
      </section>

      <aside className={`artifact-panel ${artifactPanelOpen ? "mobile-open" : ""}`}>
        <div className="artifact-panel-header">
          <div>
            <span>AGENT OUTPUT</span>
            <h2>产出物</h2>
          </div>
          <div className="artifact-header-actions">
            <span className={`compact-run-status ${status}`}>
              <i />
              {statusCopy.label}
            </span>
            <button
              className="artifact-panel-close"
              type="button"
              aria-label="关闭产出物面板"
              onClick={() => setArtifactPanelOpen(false)}
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {artifacts.length > 0 ? (
          <>
            <div className="artifact-list-wrap">
              <div className="artifact-list-label">
                <span>本次对话</span>
                <b>{artifacts.length} 个产出</b>
              </div>
              <nav className="artifact-list" aria-label="Agent 产出物列表">
                {artifacts.map((artifact) => (
                  <button
                    className={`artifact-list-item ${selectedArtifact?.id === artifact.id ? "active" : ""}`}
                    type="button"
                    key={artifact.id}
                    onClick={() => setSelectedArtifactId(artifact.id)}
                  >
                    <span className={`artifact-type-icon ${artifact.kind}`}>
                      {artifact.kind === "report" ? (
                        <FileText size={15} />
                      ) : artifact.kind === "code" ? (
                        <FileCode2 size={15} />
                      ) : (
                        <FileChartColumn size={15} />
                      )}
                    </span>
                    <span>
                      <strong>{artifact.title}</strong>
                      <small>
                        {artifact.kind === "report"
                          ? "研究结论"
                          : artifact.kind === "code"
                            ? artifact.language
                            : "PDF 文档"}
                      </small>
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {selectedArtifact && (
              <section className="artifact-viewer">
                <header className="artifact-viewer-toolbar">
                  <div>
                    {selectedArtifact.kind === "code" ? (
                      <Braces size={14} />
                    ) : (
                      <FileText size={14} />
                    )}
                    <span>{selectedArtifact.title}</span>
                  </div>
                  <div>
                    {selectedArtifact.kind !== "pdf" && (
                      <button
                        type="button"
                        onClick={() => void copyArtifact(selectedArtifact)}
                        aria-label="复制产出物"
                        title="复制"
                      >
                        <Copy size={14} />
                        <span>{copiedArtifactId === selectedArtifact.id ? "已复制" : "复制"}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => downloadArtifact(selectedArtifact)}
                      aria-label={selectedArtifact.kind === "pdf" ? "打开 PDF" : "下载产出物"}
                      title={selectedArtifact.kind === "pdf" ? "打开 PDF" : "下载"}
                    >
                      <Download size={14} />
                      <span>{selectedArtifact.kind === "pdf" ? "打开" : "下载"}</span>
                    </button>
                  </div>
                </header>

                <div className={`artifact-content ${selectedArtifact.kind}`}>
                  {selectedArtifact.kind === "report" && selectedArtifact.content && (
                    <ReactMarkdown>{selectedArtifact.content}</ReactMarkdown>
                  )}
                  {selectedArtifact.kind === "code" && (
                    <pre>
                      <code>{selectedArtifact.content}</code>
                    </pre>
                  )}
                  {selectedArtifact.kind === "pdf" && selectedArtifact.url && (
                    <iframe src={selectedArtifact.url} title={selectedArtifact.title} />
                  )}
                </div>

                <footer className="artifact-meta">
                  <span>{formatTime(selectedArtifact.createdAt)} 生成</span>
                  {durationMs !== null && <span>{(durationMs / 1000).toFixed(1)}s</span>}
                  {tokenUsage !== null && <span>{tokenUsage} tokens</span>}
                </footer>
              </section>
            )}
          </>
        ) : (
          <div className="artifact-empty-state">
            <div>
              <FileText size={24} />
            </div>
            <h3>等待 Agent 产出</h3>
            <p>研究结论、代码块和 PDF 文档会集中显示在这里，方便单独阅读和导出。</p>
            <div className="artifact-empty-types">
              <span>
                <FileText size={13} /> 报告
              </span>
              <span>
                <FileCode2 size={13} /> 代码
              </span>
              <span>
                <FileChartColumn size={13} /> PDF
              </span>
            </div>
          </div>
        )}
      </aside>
    </main>
  );
}
