"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { Eye, Edit } from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * MarkdownEditor Component
 * 
 * A split-view markdown editor with write and preview tabs.
 * Shows character count, word count, and estimated reading time.
 */
export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<string>("write");

  // Calculate word count
  const calculateWordCount = (text: string): number => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  // Calculate reading time (average reading speed: 200 words/min)
  const calculateReadingTime = (wordCount: number): string => {
    if (wordCount === 0) return "0 min read";
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min read`;
  };

  const charCount = value.length;
  const wordCount = calculateWordCount(value);
  const readingTime = calculateReadingTime(wordCount);

  return (
    <div className="flex flex-col space-y-2">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="write" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Write
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="write" className="mt-4">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Write your post content in Markdown..."}
            className="min-h-[500px] resize-none font-mono text-sm"
            spellCheck={false}
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <div className="min-h-[500px] rounded-md border border-input bg-background p-4">
            {value.trim() ? (
              <MarkdownRenderer content={value} />
            ) : (
              <div className="flex h-[468px] items-center justify-center text-muted-foreground">
                <p>Nothing to preview yet. Start writing in the Write tab.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Stats Bar */}
      <div className="flex items-center justify-between rounded-md border border-border bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
        <div className="flex gap-4">
          <span>
            <strong className="font-medium text-foreground">{charCount}</strong> characters
          </span>
          <span className="hidden sm:inline">
            <strong className="font-medium text-foreground">{wordCount}</strong> words
          </span>
          <span className="hidden sm:inline">
            <strong className="font-medium text-foreground">{readingTime}</strong>
          </span>
        </div>
        
        <div className="text-xs">
          Markdown supported
        </div>
      </div>

      {/* Markdown Help Text (collapsed by default) */}
      <details className="rounded-md border border-border bg-muted/50 p-4 text-sm">
        <summary className="cursor-pointer font-medium text-foreground">
          Markdown Formatting Help
        </summary>
        <div className="mt-3 space-y-2 text-muted-foreground">
          <p><code className="rounded bg-muted px-1 py-0.5"># Heading 1</code> - Large heading</p>
          <p><code className="rounded bg-muted px-1 py-0.5">## Heading 2</code> - Medium heading</p>
          <p><code className="rounded bg-muted px-1 py-0.5">**bold text**</code> - Bold text</p>
          <p><code className="rounded bg-muted px-1 py-0.5">*italic text*</code> - Italic text</p>
          <p><code className="rounded bg-muted px-1 py-0.5">[link](url)</code> - Create a link</p>
          <p><code className="rounded bg-muted px-1 py-0.5">![alt](image-url)</code> - Embed an image</p>
          <p><code className="rounded bg-muted px-1 py-0.5">`code`</code> - Inline code</p>
          <p><code className="rounded bg-muted px-1 py-0.5">```language code block ```</code> - Code block with syntax highlighting</p>
          <p><code className="rounded bg-muted px-1 py-0.5">&gt; quote</code> - Blockquote</p>
          <p><code className="rounded bg-muted px-1 py-0.5">- item</code> - Bullet list</p>
          <p><code className="rounded bg-muted px-1 py-0.5">1. item</code> - Numbered list</p>
        </div>
      </details>
    </div>
  );
}
