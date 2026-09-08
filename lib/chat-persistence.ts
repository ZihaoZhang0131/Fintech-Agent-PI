export type PersistedConversation = {
  id: string;
  updatedAt: number;
};

type PersistenceOptions<T extends PersistedConversation> = {
  put: (conversation: T) => Promise<void>;
  remove: (id: string) => Promise<void>;
  onError?: (error: Error) => void;
  onSaved?: () => void;
  debounceMs?: number;
  retryDelaysMs?: number[];
};

export type ConversationPersistence<T extends PersistedConversation> = {
  seed: (conversations: T[]) => void;
  save: (conversation: T, immediate?: boolean) => Promise<void>;
  saveNow: (conversation: T) => Promise<void>;
  delete: (id: string) => Promise<void>;
  flush: () => Promise<void>;
  dispose: () => void;
};

function asError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

export function createConversationPersistence<T extends PersistedConversation>(
  options: PersistenceOptions<T>,
): ConversationPersistence<T> {
  const debounceMs = options.debounceMs ?? 350;
  const retryDelays = options.retryDelaysMs ?? [500, 1_000, 2_000, 5_000];
  const pendingWrites = new Map<string, { value: T; serialized: string }>();
  const pendingDeletes = new Set<string>();
  const saved = new Map<string, string>();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let running: Promise<void> | undefined;
  let lastError: Error | undefined;
  let retryIndex = 0;
  let disposed = false;

  function clearTimer() {
    if (timer) clearTimeout(timer);
    timer = undefined;
  }

  function schedule(delay = debounceMs) {
    if (disposed || timer) return;
    timer = setTimeout(() => {
      timer = undefined;
      void drain();
    }, delay);
  }

  function restoreWrite(entry: { value: T; serialized: string }) {
    if (pendingDeletes.has(entry.value.id)) return;
    const newer = pendingWrites.get(entry.value.id);
    if (!newer || newer.value.updatedAt <= entry.value.updatedAt) {
      pendingWrites.set(entry.value.id, entry);
    }
  }

  async function run() {
    while (!disposed && (pendingDeletes.size > 0 || pendingWrites.size > 0)) {
      const deleteId = pendingDeletes.values().next().value as string | undefined;
      let writeEntry: { value: T; serialized: string } | undefined;
      try {
        if (deleteId) {
          pendingDeletes.delete(deleteId);
          await options.remove(deleteId);
          saved.delete(deleteId);
        } else {
          writeEntry = pendingWrites.values().next().value as
            | { value: T; serialized: string }
            | undefined;
          if (!writeEntry) break;
          pendingWrites.delete(writeEntry.value.id);
          await options.put(writeEntry.value);
          saved.set(writeEntry.value.id, writeEntry.serialized);
        }
        lastError = undefined;
        retryIndex = 0;
      } catch (error) {
        lastError = asError(error);
        if (deleteId) pendingDeletes.add(deleteId);
        else if (writeEntry) restoreWrite(writeEntry);
        options.onError?.(lastError);
        const delay = retryDelays[Math.min(retryIndex, retryDelays.length - 1)] ?? 5_000;
        retryIndex += 1;
        schedule(delay);
        return;
      }
    }
    if (!pendingDeletes.size && !pendingWrites.size) options.onSaved?.();
  }

  async function drain() {
    if (disposed) return;
    clearTimer();
    if (!running) {
      running = run().finally(() => {
        running = undefined;
        if (!disposed && (pendingDeletes.size || pendingWrites.size) && !timer) schedule();
      });
    }
    await running;
  }

  function queueWrite(conversation: T) {
    const serialized = JSON.stringify(conversation);
    if (saved.get(conversation.id) === serialized && !pendingDeletes.has(conversation.id)) return false;
    pendingDeletes.delete(conversation.id);
    pendingWrites.set(conversation.id, { value: conversation, serialized });
    return true;
  }

  return {
    seed(conversations) {
      saved.clear();
      for (const conversation of conversations) saved.set(conversation.id, JSON.stringify(conversation));
    },
    async save(conversation, immediate = false) {
      if (!queueWrite(conversation)) return;
      if (immediate) await drain();
      else schedule();
    },
    async saveNow(conversation) {
      const serialized = JSON.stringify(conversation);
      queueWrite(conversation);
      await drain();
      if (saved.get(conversation.id) !== serialized) throw lastError ?? new Error("会话尚未保存。");
    },
    async delete(id) {
      pendingWrites.delete(id);
      pendingDeletes.add(id);
      await drain();
    },
    flush: drain,
    dispose() {
      disposed = true;
      clearTimer();
      pendingWrites.clear();
      pendingDeletes.clear();
    },
  };
}
