"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/trpc";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { PostCard } from "@/components/blog/PostCard";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
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

  // Get the first category ID from the post
  const firstCategoryId =
    post?.postCategories && post.postCategories.length > 0
      ? post.postCategories[0].categoryId
      : null;

  // Fetch related posts from the same category
  const { data: relatedPosts, isLoading: relatedLoading } =
    api.post.list.useQuery(
      {
        published: true,
        categoryId: firstCategoryId || undefined,
        limit: 3,
      },
      {
        enabled: !!firstCategoryId, // Only fetch if we have a category
      }
    );

  // Filter out the current post from related posts
  const filteredRelatedPosts = relatedPosts?.filter((p) => p.id !== post?.id) || [];

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

  // Get author initials for avatar
  const getAuthorInitials = (name: string | null) => {
    if (!name) return "A";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Handle share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || "Check out this article!",
          url: window.location.href,
        });
      } catch {
        // Share cancelled or failed
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <article className="min-h-screen">
      {/* Cover Image Hero Section (if exists) */}
      {post.coverImage && (
        <div className="relative w-full h-[400px] md:h-[500px] bg-linear-to-br from-primary/10 to-background">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3">
            <Link href="/blogs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blogs
            </Link>
          </Button>

          {/* Categories */}
          {post.postCategories && post.postCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.postCategories.map((pc: { categoryId: string; category: { name: string } }) => (
                <Badge key={pc.categoryId} variant="secondary">
                  {pc.category.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Author & Metadata */}
          <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getAuthorInitials(post.authorName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.authorName || "Anonymous"}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{readingTime} min read</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="ml-auto"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>

          {/* Cover Image (if not shown in hero) */}
          {!post.coverImage && post.coverImage && (
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

          {/* Content with optimal reading width */}
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-pre:bg-muted">
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Footer Section */}
          <Separator className="my-12" />
          
          <div className="space-y-8">
            {/* Last Updated */}
            {post.updatedAt !== post.createdAt && (
              <div className="text-sm text-muted-foreground">
                Last updated: {format(new Date(post.updatedAt), "MMMM d, yyyy")}
              </div>
            )}

            {/* Categories Section */}
            {post.postCategories && post.postCategories.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {post.postCategories.map((pc: { categoryId: string; category: { name: string } }) => (
                    <Badge key={pc.categoryId} variant="outline">
                      {pc.category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button variant="outline" asChild>
                <Link href="/blogs">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  View all posts
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share article
              </Button>
            </div>
          </div>

          {/* Related Posts Section */}
          {firstCategoryId && filteredRelatedPosts.length > 0 && (
            <>
              <Separator className="my-12" />
              <div>
                <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
                {relatedLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="space-y-4">
                        <Skeleton className="h-48 w-full rounded-lg" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRelatedPosts.slice(0, 3).map((relatedPost) => (
                      <PostCard
                        key={relatedPost.id}
                        post={relatedPost}
                        variant="compact"
                        showAuthor={false}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
