"use client";

import { PostForm } from "@/components/blog/PostForm";

/**
 * New Post Page
 * 
 * Page for creating a new blog post.
 * Uses the PostForm component without any props for create mode.
 */
export default function NewPostPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold tracking-tight uppercase">Create New Post</h1>
        <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
          Write and publish your blog post
        </p>
      </div>

      <PostForm />
    </div>
  );
}
