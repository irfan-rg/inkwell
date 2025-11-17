"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/trpc";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { PostCard } from "@/components/blog/PostCard";
import { PostListSkeleton } from "@/components/ui/post-skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { calculateReadingTime } from "@/lib/utils";

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

  // Calculate reading time using utility function
  const readingTime = calculateReadingTime(post.content);

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
      {/* HERO SECTION - with cover image */}
      {post.coverImage ? (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
          <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden rounded-2xl">
            {/* Cover image */}
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
            
            {/* Dark overlay - stronger gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/0 to-transparent" />
            
            {/* Title overlaid at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-12 lg:p-16">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-hero font-bold text-white leading-tight tracking-normal">
                {post.title}
              </h1>
            </div>
          </div>
        </div>
      ) : (
        /* HERO SECTION - without cover image */
        <div className="bg-linear-to-b from-gold-50 to-paper-cream py-12 sm:py-16 md:py-24 text-center">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-hero font-bold leading-tight tracking-normal">
              {post.title}
            </h1>
          </div>
        </div>
      )}

      {/* BACK BUTTON */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/blogs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      {/* METADATA SECTION */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left side: Author info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getAuthorInitials(post.authorName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm sm:text-base">{post.authorName || "Anonymous"}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {format(new Date(post.createdAt), "MMM d, yyyy")}
              </p>
            </div>
          </div>

          {/* Right side: Reading time, categories, and share button */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{readingTime} min read</span>
            </div>
            
            {post.postCategories && post.postCategories.length > 0 && (
              <div className="flex gap-2">
                {post.postCategories.slice(0, 2).map((pc: { categoryId: string; category: { name: string } }) => (
                  <Badge key={pc.categoryId} variant="outline" className="text-xs">
                    {pc.category.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Share button */}
            <div className="ml-auto">
              <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-2"
              >
              <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Share</span>
              </Button>
            </div>
            
          </div>
        </div>
      </div>

      {/* ARTICLE CONTENT */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Apply prose classes for beautiful typography */}
        <div className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none
          prose-headings:font-display prose-headings:tracking-tight
          prose-p:leading-relaxed prose-p:mb-4 sm:prose-p:mb-6
          prose-a:text-gold-600 prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-4 prose-blockquote:border-gold-500 prose-blockquote:italic
          prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
          prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:text-sm
          prose-img:rounded-lg prose-img:shadow-md prose-img:w-full">
          <MarkdownRenderer content={post.content} />
        </div>
      </div>

      {/* RELATED POSTS SECTION */}
      {firstCategoryId && filteredRelatedPosts.length > 0 && (
        <div className="w-full bg-paper-cream border-t border-border py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-display font-semibold mb-6 sm:mb-8">
              Related Stories
            </h2>
            
            {relatedLoading ? (
              <PostListSkeleton count={3} />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRelatedPosts.slice(0, 3).map((relatedPost) => (
                  <PostCard
                    key={relatedPost.id}
                    post={relatedPost}
                    variant="default"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
