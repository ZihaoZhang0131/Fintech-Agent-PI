import { createHash } from "node:crypto";

const SAFE_TOKEN_METRIC_KEYS = new Set([
  "inputtokens",
  "outputtokens",
  "totaltokens",
  "reasoningtokens",
  "cachedtokens",
  "prompttokens",
  "completiontokens",
]);
const SECRET_PATTERNS = [
  /\bBearer\s+[A-Za-z0-9._~+/=-]{8,}/gi,
  /\b(?:sk|pk|rk)-[A-Za-z0-9_-]{12,}/gi,
  /\b(?:api[-_]?key|token|secret|password)\s*[:=]\s*["']?[^\s"',;]{6,}/gi,
];
const MAX_DEPTH = 8;
const MAX_ARRAY_ITEMS = 100;
const MAX_OBJECT_KEYS = 100;

function isSecretKey(key) {
  const normalized = String(key).replace(/[-_\s]/g, "").toLowerCase();
  if (SAFE_TOKEN_METRIC_KEYS.has(normalized)) return false;
  return normalized === "authorization"
    || normalized === "token"
    || normalized === "cookie"
    || normalized === "password"
    || normalized === "passwd"
    || normalized === "secret"
    || normalized.includes("apikey")
    || normalized.includes("accesstoken")
    || normalized.includes("refreshtoken")
    || normalized.includes("authtoken")
    || normalized.includes("sessiontoken")
    || normalized.includes("idtoken")
    || normalized.includes("privatekey")
    || normalized.includes("clientsecret");
}

export function traceSha256(value) {
  return createHash("sha256").update(String(value)).digest("hex");
}

function replaceSecrets(value, workspacePath) {
  let text = value;
  if (workspacePath) text = text.split(workspacePath).join("<workspace>");
  for (const pattern of SECRET_PATTERNS) text = text.replace(pattern, "[REDACTED]");
  return text;
}

export function redactTraceText(value, options = {}) {
  const text = replaceSecrets(String(value ?? ""), options.workspacePath);
  const maxBytes = Number(options.maxBytes) || 100_000;
  const bytes = Buffer.byteLength(text, "utf8");
  if (bytes <= maxBytes) return text;
  const preview = Buffer.from(text, "utf8").subarray(0, maxBytes).toString("utf8");
  return `${preview}\n\n[TRACE_TRUNCATED bytes=${bytes} sha256=${traceSha256(text)}]`;
}

function redactNode(value, options, depth, seen) {
  if (value === null || value === undefined || typeof value === "number" || typeof value === "boolean") {
    return value ?? null;
  }
  if (typeof value === "bigint") return value.toString();
  if (typeof value === "string") return replaceSecrets(value, options.workspacePath);
  if (typeof value === "function" || typeof value === "symbol") return `[${typeof value}]`;
  if (Buffer.isBuffer(value)) {
    return { omitted: true, kind: "buffer", bytes: value.length, sha256: traceSha256(value.toString("base64")) };
  }
  if (depth >= MAX_DEPTH) return { omitted: true, reason: "max_depth" };
  if (typeof value !== "object") return replaceSecrets(String(value), options.workspacePath);
  if (seen.has(value)) return { omitted: true, reason: "circular" };
  seen.add(value);
  try {
    if (Array.isArray(value)) {
      const items = value.slice(0, MAX_ARRAY_ITEMS).map((item) => redactNode(item, options, depth + 1, seen));
      if (value.length > items.length) items.push({ omitted: true, reason: "array_limit", count: value.length - items.length });
      return items;
    }
    const result = {};
    const entries = Object.entries(value);
    for (const [key, child] of entries.slice(0, MAX_OBJECT_KEYS)) {
      result[key] = isSecretKey(key) ? "[REDACTED]" : redactNode(child, options, depth + 1, seen);
    }
    if (entries.length > MAX_OBJECT_KEYS) {
      result.__traceOmittedKeys = entries.length - MAX_OBJECT_KEYS;
    }
    return result;
  } finally {
    seen.delete(value);
  }
}

export function redactTraceValue(value, options = {}) {
  const redacted = redactNode(value, options, 0, new WeakSet());
  const maxBytes = Number(options.maxBytes) || 32 * 1024;
  let serialized;
  try {
    serialized = JSON.stringify(redacted);
  } catch {
    return { omitted: true, reason: "serialization_failed" };
  }
  const bytes = Buffer.byteLength(serialized, "utf8");
  if (bytes <= maxBytes) return redacted;
  return {
    omitted: true,
    reason: "size_limit",
    bytes,
    sha256: traceSha256(serialized),
    preview: redactTraceText(serialized, { ...options, maxBytes: Math.min(2_000, maxBytes) }),
  };
}
