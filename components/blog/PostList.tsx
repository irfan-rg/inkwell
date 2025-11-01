"use client";

import { PostCard } from "./PostCard";
import { Skeleton } from "@/components/ui/skeleton";
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
  loading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
}

export function PostList({
  posts,
  variant = "default",
  showAuthor = false,
  loading = false,
  emptyMessage = "No posts found",
  emptyDescription = "There are no published posts at the moment. Check back later!",
}: PostListProps) {
  // Loading state
  if (loading) {
    return (
      <div className={`grid gap-6 ${
        variant === "compact"
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      }`}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  // Empty state
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

  // Posts grid
  return (
    <div className={`grid gap-6 animate-in fade-in duration-500 ${
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
