import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FileCode, FileText, FileImage, File } from "lucide-react";
import { parseMarkdownLink, type ProjectFileTarget } from "@/lib/markdown-links";

export type ProjectNavigation = {
  baseDirectory: string;
  onOpenFile: (target: ProjectFileTarget) => void;
};

type MarkdownMessageProps = {
  content: string;
  projectNavigation?: ProjectNavigation;
};

// Keep Markdown normalization next to its renderer so the workspace entry point
// only owns conversation state and event handling.
export function MarkdownMessage({ content, projectNavigation }: MarkdownMessageProps) {
  const normalizedContent = content.replace(
    /([。！？.!?：:])\s*(#{1,6}\s+)/g,
    "$1\n\n$2",
  );

  return (
    <div className={`markdown-body${projectNavigation ? " project-markdown" : ""}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={projectNavigation ? {
        a: ({ href, children }) => {
          const link = parseMarkdownLink(href, projectNavigation);
          if (link.kind === "external") return <a href={link.href} target="_blank" rel="noopener noreferrer">{children}</a>;
          if (link.kind === "inactive") return <span>{children}</span>;
          const { path, line } = link.target;
          const extension = path.split(".").at(-1)?.toLowerCase();
          const Icon = /^(tsx?|jsx?|mjs|mts|py|go|rs|sh|css|html|json|sql|yaml|yml)$/.test(extension ?? "")
            ? FileCode : /^(png|jpe?g|gif|webp|svg)$/.test(extension ?? "")
              ? FileImage : /^(mdx?|txt|pdf|csv)$/.test(extension ?? "") ? FileText : File;
          return <a href={href} className="project-file-link" title={`${path}${line ? `:${line}` : ""}`}
            onClick={(event) => { event.preventDefault(); projectNavigation.onOpenFile(link.target); }}>
            <Icon size={13} aria-hidden="true" />{children}
          </a>;
        },
      } : undefined}>{normalizedContent}</ReactMarkdown>
    </div>
  );
}
