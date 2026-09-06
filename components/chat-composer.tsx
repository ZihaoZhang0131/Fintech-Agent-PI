"use client";
import {
  useEffect,
  useRef,
  type FormHTMLAttributes,
  type ReactNode,
} from "react";
import { shouldSubmitComposerKey } from "@/lib/composer-keyboard";

export function ComposerSurface(props: FormHTMLAttributes<HTMLFormElement>) {
  return <form {...props} className="composer" />;
}

/** Shared chat surface; business state and actions stay with each conversation. */
export function ChatComposer({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
  children: ReactNode;
}) {
  const input = useRef<HTMLTextAreaElement>(null),
    composing = useRef(false);
  useEffect(() => {
    if (input.current) {
      input.current.style.height = "auto";
      input.current.style.height = `${Math.min(input.current.scrollHeight, 200)}px`;
    }
  }, [value]);
  return (
    <ComposerSurface
      onSubmit={(e) => {
        e.preventDefault();
        if (!disabled) onSubmit();
      }}
    >
      <textarea
        ref={input}
        rows={1}
        aria-label="Workflow 消息"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onCompositionStart={() => {
          composing.current = true;
        }}
        onCompositionEnd={() => {
          composing.current = false;
        }}
        onKeyDown={(e) => {
          if (
            shouldSubmitComposerKey({
              key: e.key,
              shiftKey: e.shiftKey,
              compositionActive: composing.current,
              nativeIsComposing: e.nativeEvent.isComposing,
              keyCode: e.nativeEvent.keyCode,
            })
          ) {
            e.preventDefault();
            if (!disabled) onSubmit();
          }
        }}
      />
      <div className="composer-footer">{children}</div>
    </ComposerSurface>
  );
}
