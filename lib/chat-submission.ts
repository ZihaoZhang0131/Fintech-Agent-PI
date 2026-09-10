export type ChatSubmission = { path: string; body: object };

// Freeze both endpoint and payload across ambiguous network failures. A retry
// of Start must not turn into Steer just because SSE has since reported busy.
export function prepareChatSubmission(
  pending: Map<string, ChatSubmission>,
  options: { id: string; content: string; activeTurnId?: string; continueTurnId?: string; config: object; requestId: string },
) {
  const { id, content, activeTurnId, continueTurnId, config, requestId } = options;
  const key = JSON.stringify([id, continueTurnId ?? null, content]);
  let submission = pending.get(key);
  if (!submission) {
    submission = continueTurnId
      ? { path: `${id}/turns/${continueTurnId}/continue`, body: { clientRequestId: requestId } }
      : activeTurnId
        ? { path: `${id}/turns/${activeTurnId}/steer`, body: { clientInputId: requestId, expectedTurnId: activeTurnId, text: content } }
        : { path: `${id}/turns`, body: { clientRequestId: requestId, input: content, config } };
    pending.set(key, submission);
  }
  return { key, ...submission };
}
