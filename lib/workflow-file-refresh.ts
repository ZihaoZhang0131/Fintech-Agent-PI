// Snapshots also arrive through polling: only changed runs invalidate project files.
export function createWorkflowFileRefresh(
  refresh: () => void,
  clock = {
    now: () => Date.now(),
    schedule: (callback: () => void, delay: number) => setTimeout(callback, delay),
    cancel: (timer: ReturnType<typeof setTimeout>) => clearTimeout(timer),
  },
) {
  let signature: string | undefined;
  let lastRefresh = -Infinity;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let disposed = false;
  function flush() {
    timer = undefined;
    if (disposed) return;
    lastRefresh = clock.now();
    refresh();
  }
  return {
    observe(runs: ReadonlyArray<{ id: string; seq: number }>) {
      if (disposed) return;
      const next = JSON.stringify(runs.map(({ id, seq }) => [id, seq]));
      if (next === signature) return;
      signature = next;
      if (timer !== undefined) return;
      const delay = Math.max(0, 2000 - (clock.now() - lastRefresh));
      if (delay === 0) flush();
      else timer = clock.schedule(flush, delay);
    },
    dispose() {
      disposed = true;
      if (timer !== undefined) clock.cancel(timer);
    },
  };
}
