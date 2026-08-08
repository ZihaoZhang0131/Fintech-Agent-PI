import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownMessageProps = {
  content: string;
};

// Keep Markdown normalization next to its renderer so the workspace entry point
// only owns conversation state and event handling.
export function MarkdownMessage({ content }: MarkdownMessageProps) {
  const normalizedContent = content.replace(
    /([。！？.!?：:])\s*(#{1,6}\s+)/g,
    "$1\n\n$2",
  );

  return (
    <div className="markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{normalizedContent}</ReactMarkdown>
    </div>
  );
}
