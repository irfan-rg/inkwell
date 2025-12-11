"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { EyeIcon, CodeBracketIcon } from "@heroicons/react/24/solid";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<string>("write");

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="flex flex-col space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between border-b border-border pb-px mb-6">
          <TabsList className="bg-transparent p-0 gap-6 h-auto rounded-none">
            <TabsTrigger
              value="write"
              className="rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none px-0 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <CodeBracketIcon className="h-4 w-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none px-0 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <EyeIcon className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
          
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
            {wordCount} Words
          </div>
        </div>

        <TabsContent value="write" className="mt-0 focus-visible:outline-none">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[60vh] resize-y font-mono text-base leading-relaxed border-0 bg-transparent p-0 focus-visible:ring-0 rounded-none placeholder:text-muted-foreground/30"
            spellCheck={false}
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-0 focus-visible:outline-none">
          <div className="min-h-[60vh] prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:uppercase prose-p:font-sans">
            {value.trim() ? (
              <MarkdownRenderer content={value} />
            ) : (
              <p className="text-muted-foreground italic">Nothing to preview yet.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}