"use client";

import { PostForm } from "@/components/blog/PostForm";
import { api } from "@/lib/trpc";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { PostCategory } from "@/server/db/schema";

/**
 * Edit Post Page
 * 
 * Page for editing an existing blog post.
 * Fetches the post data and passes it to PostForm.
 */
export default function EditPostPage() {
  const params = useParams();
  const postId = params?.id as string;

  // Fetch post data
  const { data: post, isLoading, error } = api.post.getById.useQuery(
    { id: postId },
    { enabled: !!postId }
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>

        <Card>
          <CardContent className="space-y-6 pt-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div className="mx-auto max-w-5xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h3 className="mt-4 text-lg font-semibold">Post Not Found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {error?.message || "The post you're looking for doesn't exist or you don't have permission to edit it."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Extract category IDs from post categories
  const categoryIds = post.postCategories?.map((pc: PostCategory) => pc.categoryId) || [];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold tracking-tight uppercase">Edit Post</h1>
        <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
          Update your blog post
        </p>
      </div>

      <PostForm
        postId={post.id}
        initialData={{
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt || "",
          coverImage: post.coverImage,
          published: post.published,
          categoryIds,
        }}
      />
    </div>
  );
}
