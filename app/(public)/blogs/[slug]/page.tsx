"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/trpc";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { PostCard } from "@/components/blog/PostCard";
import { ArrowLeft } from "lucide-react";
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

  const firstCategoryId =
    post?.postCategories && post.postCategories.length > 0
      ? post.postCategories[0].categoryId
      : null;

  const { data: relatedPosts } = api.post.list.useQuery(
    {
      published: true,
      categoryId: firstCategoryId || undefined,
      limit: 3,
    },
    { enabled: !!firstCategoryId }
  );

  const filteredRelatedPosts = relatedPosts?.filter((p) => p.id !== post?.id) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-px w-32 bg-border relative overflow-hidden">
          <div className="absolute inset-0 bg-foreground animate-slide-right" />
        </div>
      </div>
    );
  }

  if (error || !post) notFound();

  const readingTime = calculateReadingTime(post.content);
  const categoryName = post.postCategories?.[0]?.category.name || "General";

  return (
    <article className="min-h-screen bg-background">
      {/* 1. GRID HEADER (Metadata Box) */}
      <div className="border-b border-border">
        {/* Top Row: Navigation & Title */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-border">
          <div className="lg:col-span-2 border-r border-border p-6 flex items-center justify-center lg:justify-start">
            <Link 
              href="/blogs" 
              className="inline-flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-widest hover:text-foreground/60 transition-colors"
            >
              <ArrowLeft className="h-3 w-3" /> Back
            </Link>
          </div>
          <div className="lg:col-span-10 p-8 lg:p-12">
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black tracking-tighter uppercase leading-[0.9]"
            >
              {post.title}
            </h1>
          </div>
        </div>

        {/* Info Grid Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          <div className="p-4 text-center">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Author</span>
            <span className="font-display font-bold text-lg">{post.authorName}</span>
          </div>
          <div className="p-4 text-center">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Published</span>
            <span className="font-mono text-sm">{format(new Date(post.createdAt), "dd.MM.yyyy")}</span>
          </div>
          <div className="p-4 text-center">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Category</span>
            <span className="font-mono text-sm uppercase text-foreground font-bold">{categoryName}</span>
          </div>
          <div className="p-4 text-center">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Time</span>
            <span className="font-mono text-sm">{readingTime} MIN READ</span>
          </div>
        </div>
      </div>

      {/* 2. FEATURED IMAGE (Full Width) */}
      {post.coverImage && (
        <div className="w-[50vw] h-[50vh] md:h-[60vh] relative border-b border-border mx-auto">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* 3. CONTENT (Centered Column) */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="hidden lg:block lg:col-span-3 border-r border-border bg-muted/5">
          {/* Empty left rail or Table of Contents could go here */}
        </div>
        
        <div className="col-span-1 lg:col-span-6 border-r border-border">
          <div className="px-6 py-12 md:px-12 md:py-16">
            <div className="prose prose-lg dark:prose-invert max-w-none 
              prose-headings:font-display prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tight
              prose-p:font-sans prose-p:leading-relaxed prose-p:text-lg
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-2 prose-blockquote:border-primary prose-blockquote:font-display prose-blockquote:not-italic prose-blockquote:pl-6
              prose-img:rounded-none prose-img:border prose-img:border-border">
              <MarkdownRenderer content={post.content} />
            </div>
          </div>
        </div>

        <div className="hidden lg:block lg:col-span-3 bg-muted/5">
           {/* Right rail - maybe share buttons later */}
        </div>
      </div>

      {/* 4. FOOTER / RELATED */}
      {filteredRelatedPosts.length > 0 && (
        <div className="border-t border-border">
          <div className="p-8 border-b border-border bg-background text-foreground">
            <h2 className="text-3xl font-display font-bold uppercase tracking-tight">Related Content</h2>
          </div>
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            {filteredRelatedPosts.slice(0, 3).map((relatedPost) => (
              <div key={relatedPost.id} className="group">
                <PostCard post={relatedPost} />
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}