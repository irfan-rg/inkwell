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

// Fix for type issues with react-syntax-highlighter
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Highlighter = SyntaxHighlighter as any;

/**
 * MarkdownRenderer Component
 * 
 * Renders markdown content with syntax highlighting for code blocks.
 * Supports GitHub Flavored Markdown (GFM) including tables, strikethrough, etc.
 */
export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const components: Components = {
    // Custom code block rendering with syntax highlighting
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";
      const inline = !language;

      return !inline && language ? (
        <div className="relative my-4 overflow-x-auto max-w-full">
          {/* Language label */}
          {language && (
            <div className="absolute right-0 top-0 border-l border-b border-border bg-muted px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              {language}
            </div>
          )}
          <Highlighter
            style={vscDarkPlus}
            language={language}
            PreTag="div"
            className="rounded-none! bg-[#1e1e1e]! text-sm font-mono border border-border"
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </Highlighter>
        </div>
      ) : (
        <code
          className="rounded-none bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground border border-border/50 whitespace-pre-wrap break-all max-w-full"
          {...props}
        >
          {children}
        </code>
      );
    },

    // Custom heading styles
    h1: ({ children }) => (
      <h1 className="mb-4 mt-6 scroll-m-20 text-4xl font-bold tracking-tight first:mt-0 font-display uppercase">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-6 scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight first:mt-0 font-display uppercase">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-4 mt-6 scroll-m-20 text-2xl font-semibold tracking-tight font-display uppercase">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-4 mt-6 scroll-m-20 text-xl font-semibold tracking-tight font-display">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="mb-4 mt-6 scroll-m-20 text-lg font-semibold tracking-tight font-display">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="mb-4 mt-6 scroll-m-20 text-base font-semibold tracking-tight font-display uppercase text-muted-foreground">
        {children}
      </h6>
    ),

    // Custom paragraph styles
    p: ({ children }) => (
      <p className="mb-4 leading-7 not-first:mt-6 font-sans">
        {children}
      </p>
    ),

    // Custom link styles with external link indicator
    a: ({ href, children }) => {
      const isExternal = href?.startsWith('http');
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-foreground underline decoration-foreground/30 transition-colors hover:decoration-foreground decoration-2 underline-offset-4"
        >
          {children}
          {isExternal && <span className="ml-1 text-[10px] align-top">↗</span>}
        </a>
      );
    },

    // Custom image styles with lazy loading and shadows
    img: ({ src, alt }) => (
      <figure className="my-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt || ""}
          loading="lazy"
          className="rounded-none border border-border w-full"
        />
        {alt && (
          <figcaption className="mt-2 text-center text-xs font-mono uppercase tracking-widest text-muted-foreground">
            {alt}
          </figcaption>
        )}
      </figure>
    ),

    // Custom blockquote styles
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-primary pl-6 italic text-muted-foreground font-mono text-sm leading-relaxed">
        {children}
      </blockquote>
    ),

    // Custom list styles
    ul: ({ children }) => (
      <ul className="my-4 ml-6 list-disc space-y-2 [&>li]:mt-2 marker:text-foreground">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="my-4 ml-6 list-decimal space-y-2 [&>li]:mt-2 marker:font-mono marker:text-foreground">
        {children}
      </ol>
    ),

    // Custom table styles - responsive wrapper
    table: ({ children }) => (
      <div className="my-6 w-full overflow-x-auto">
        <table className="w-full border-collapse border border-border text-sm">
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
      <th className="border border-border px-4 py-2 text-left font-bold uppercase tracking-wider font-mono text-xs">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-border px-4 py-2 hover:bg-muted/50 transition-colors font-mono">
        {children}
      </td>
    ),

    // Custom horizontal rule
    hr: () => (
      <hr className="my-8 border-border" />
    ),
  };

  return (
    <div className={`prose prose-neutral dark:prose-invert max-w-none font-dm-sans ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}