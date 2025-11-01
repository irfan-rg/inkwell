"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * MarkdownRenderer Component
 * 
 * Renders markdown content with syntax highlighting for code blocks.
 * Supports GitHub Flavored Markdown (GFM) including tables, strikethrough, etc.
 */
export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const components: Components = {
    // Custom code block rendering with syntax highlighting
    code({ node, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";
      const inline = !language;

      return !inline && language ? (
        <div className="relative my-4">
          {/* Language label */}
          {language && (
            <div className="absolute right-2 top-2 rounded bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              {language}
            </div>
          )}
          <SyntaxHighlighter
            style={vscDarkPlus as any}
            language={language}
            PreTag="div"
            className="rounded-lg bg-[#1e1e1e]! text-sm"
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground"
          {...props}
        >
          {children}
        </code>
      );
    },

    // Custom heading styles
    h1: ({ children }) => (
      <h1 className="mb-4 mt-6 scroll-m-20 text-4xl font-bold tracking-tight first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-6 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-4 mt-6 scroll-m-20 text-2xl font-semibold tracking-tight">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-4 mt-6 scroll-m-20 text-xl font-semibold tracking-tight">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="mb-4 mt-6 scroll-m-20 text-lg font-semibold tracking-tight">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="mb-4 mt-6 scroll-m-20 text-base font-semibold tracking-tight">
        {children}
      </h6>
    ),

    // Custom paragraph styles
    p: ({ children }) => (
      <p className="mb-4 leading-7 not-first:mt-6">
        {children}
      </p>
    ),

    // Custom link styles
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
      >
        {children}
      </a>
    ),

    // Custom blockquote styles
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-4 border-primary pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),

    // Custom list styles
    ul: ({ children }) => (
      <ul className="my-4 ml-6 list-disc space-y-2 [&>li]:mt-2">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="my-4 ml-6 list-decimal space-y-2 [&>li]:mt-2">
        {children}
      </ol>
    ),

    // Custom table styles
    table: ({ children }) => (
      <div className="my-6 w-full overflow-y-auto">
        <table className="w-full border-collapse border border-border">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-muted">
        {children}
      </thead>
    ),
    th: ({ children }) => (
      <th className="border border-border px-4 py-2 text-left font-semibold">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-border px-4 py-2">
        {children}
      </td>
    ),

    // Custom horizontal rule
    hr: () => (
      <hr className="my-8 border-border" />
    ),

    // Custom image styles
    img: ({ src, alt }) => (
      <img
        src={src}
        alt={alt || ""}
        className="my-6 rounded-lg border border-border"
        loading="lazy"
      />
    ),
  };

  return (
    <div className={`prose prose-neutral dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
