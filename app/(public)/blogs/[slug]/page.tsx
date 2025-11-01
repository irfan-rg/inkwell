"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/trpc";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = use(params);
  
  const { data: post, isLoading, error } = api.post.getBySlug.useQuery({
    slug: slug,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </div>
      </div>
    );
  }

  // Error or not found
  if (error || !post) {
    notFound();
  }

  // Calculate reading time (simple estimate: 200 words per minute)
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <article className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/blogs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>

        {/* Categories */}
        {post.postCategories && post.postCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.postCategories.map((pc: any) => (
              <Badge key={pc.categoryId} variant="outline">
                {pc.category.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          {post.title}
        </h1>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
          {post.authorName && (
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>{post.authorName}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(post.createdAt), "MMMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{readingTime} min read</span>
          </div>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden mb-8">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {post.excerpt}
            </p>
            <Separator className="mb-8" />
          </>
        )}

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* Footer */}
        <Separator className="my-12" />
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {post.updatedAt !== post.createdAt && (
              <p>Last updated: {format(new Date(post.updatedAt), "MMMM d, yyyy")}</p>
            )}
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/blogs">
              View all posts
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
