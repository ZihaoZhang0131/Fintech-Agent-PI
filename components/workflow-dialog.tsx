"use client";
import { useEffect, useRef, type ReactNode } from "react";
export function WorkflowDialog({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  const root = useRef<HTMLDivElement>(null),
    close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  }, [onClose]);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    root.current?.focus();
    return () => previous?.focus();
  }, []);
  return (
    <div
      ref={root}
      className="wf-detail-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="工作流详情"
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          close.current();
        }
        if (e.key === "Tab") {
          const boundary =
            root.current?.querySelector<HTMLElement>(".wf-modal") ??
            root.current;
          const elements = Array.from(
            boundary?.querySelectorAll<HTMLElement>(
              "button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), summary, a[href]",
            ) ?? [],
          ).filter((el) => el.getClientRects().length);
          const first = elements[0],
            last = elements.at(-1);
          if (
            e.shiftKey &&
            (document.activeElement === first ||
              document.activeElement === root.current ||
              !boundary?.contains(document.activeElement))
          ) {
            e.preventDefault();
            last?.focus();
          } else if (
            !e.shiftKey &&
            (document.activeElement === last ||
              document.activeElement === root.current ||
              !boundary?.contains(document.activeElement))
          ) {
            e.preventDefault();
            first?.focus();
          }
        }
      }}
    >
      {children}
    </div>
  );
}
