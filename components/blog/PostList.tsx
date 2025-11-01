"use client";

import { PostCard } from "./PostCard";
import { FileText } from "lucide-react";

interface PostListProps {
  posts: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    coverImage?: string | null;
    published: boolean;
    createdAt: Date | string;
    authorName?: string | null;
    postCategories?: Array<{
      category: {
        id: string;
        name: string;
        slug: string;
      };
    }>;
  }>;
  variant?: "default" | "compact";
  showAuthor?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
}

export function PostList({
  posts,
  variant = "default",
  showAuthor = false,
  emptyMessage = "No posts found",
  emptyDescription = "There are no published posts at the moment. Check back later!",
}: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-2">{emptyMessage}</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${
      variant === "compact"
        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    }`}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          variant={variant}
          showAuthor={showAuthor}
        />
      ))}
    </div>
  );
}
