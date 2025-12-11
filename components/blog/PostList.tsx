"use client";

import { PostCard } from "./PostCard";
import { EmptyState } from "@/components/ui/empty-state";
import { PostListSkeleton } from "@/components/ui/post-skeleton";
import { DocumentTextIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

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
  emptyIcon?: "default" | "search";
}

export function PostList({
  posts,
  variant = "default",
  showAuthor = false,
  loading = false,
  emptyMessage = "No posts found",
  emptyDescription = "There are no published posts at the moment. Check back later!",
  emptyIcon = "default",
}: PostListProps) {
  // Loading state
  if (loading) {
    return <PostListSkeleton count={6} variant={variant} />;
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon === "search" ? MagnifyingGlassIcon : DocumentTextIcon}
        title={emptyMessage}
        description={emptyDescription}
      />
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
