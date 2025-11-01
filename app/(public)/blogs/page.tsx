"use client";

import { api } from "@/lib/trpc";
import { PostList } from "@/components/blog/PostList";

export default function BlogsPage() {
  const { data: posts, isLoading } = api.post.list.useQuery({
    published: true,
  });

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Blog</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover articles, tutorials, and insights on various topics
        </p>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        /* Posts Grid */
        <PostList
          posts={posts || []}
          showAuthor={true}
          emptyMessage="No posts yet"
          emptyDescription="There are no published posts at the moment. Check back soon for new content!"
        />
      )}
    </div>
  );
}
