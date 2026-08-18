export type TraceRedactionOptions = {
  workspacePath?: string;
  maxBytes?: number;
};

export function traceSha256(value: unknown): string;
export function redactTraceText(value: unknown, options?: TraceRedactionOptions): string;
export function redactTraceValue(value: unknown, options?: TraceRedactionOptions): unknown;
