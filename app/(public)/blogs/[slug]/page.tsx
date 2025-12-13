"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/trpc";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { PostCard } from "@/components/blog/PostCard";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import { calculateReadingTime } from "@/lib/utils";
import { toast } from "sonner";

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="relative w-32 h-0.5 bg-muted overflow-hidden">
          <div 
            className="absolute h-full w-full bg-foreground"
            style={{
              animation: 'slideRight 1.5s ease-in-out infinite'
            }}
          />
        </div>
        <style jsx>{`
          @keyframes slideRight {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
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
          <div className="lg:col-span-1 border-r border-border p-6 flex items-center justify-center">
            <Link 
              href="/blogs" 
              className="inline-flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-widest hover:text-foreground/60 transition-colors"
            >
              <ArrowLeftIcon className="h-3 w-3" /> Back
            </Link>
          </div>
          <div className="lg:col-span-11 p-8 lg:p-12">
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

      {/* 2. ASYMMETRIC HERO SPLIT */}
      {post.coverImage && (
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-border">
          {/* Image - 7 columns */}
          <div className="lg:col-span-7 h-[50vh] md:h-[60vh] lg:h-[80vh] relative border-r border-border">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Excerpt Panel - 5 columns */}
          <div className="lg:col-span-5 bg-foreground text-background p-8 lg:p-12 flex flex-col justify-center">
            <div className="space-y-6">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">
                {categoryName}
              </div>
              <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl font-bold leading-tight uppercase tracking-tight">
                {post.excerpt || post.content.substring(0, 200).replace(/[#*`]/g, '') + '...'}
              </blockquote>
              <div className="h-px w-16 bg-background/20" />
              
              {/* Share Buttons */}
              <div className="pt-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 mb-3 text-right">
                  Share
                </div>
                <div className="flex gap-4 justify-end">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(post.content);
                      toast.success("Content copied to clipboard!");
                    }}
                    className="group flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:opacity-60 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    
                  </button>
                  <button 
                    onClick={() => {
                      toast.success("Opening WhatsApp...");
                      setTimeout(() => {
                        const url = typeof window !== 'undefined' ? window.location.href : '';
                        const message = `${post.title}\n\n${url}`;
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
                      }, 1500);
                    }}
                    className="group flex items-center gap-2 text-xs font-mono uppercase tracking-wider hover:opacity-60 transition-opacity text-muted-foreground"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    
                  </button>
                  <button 
                    onClick={() => {
                      toast.success("Opening share menu...");
                      setTimeout(() => {
                        const url = typeof window !== 'undefined' ? window.location.href : '';
                        if (navigator.share) {
                          navigator.share({
                            title: post.title,
                            text: post.excerpt || post.content.substring(0, 200).replace(/[#*`]/g, ''),
                            url: url
                          }).then(() => {
                            toast.success("Shared successfully!");
                          }).catch((error) => {
                            if (error.name !== 'AbortError') {
                              navigator.clipboard.writeText(url);
                              toast.success("Link copied to clipboard!");
                            }
                          });
                        } else {
                          navigator.clipboard.writeText(url);
                          toast.success("Link copied to clipboard!");
                        }
                      }, 1500);
                    }}
                    className="group flex items-center gap-2 text-xs font-mono uppercase tracking-wider hover:opacity-60 transition-opacity text-muted-foreground"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    
                  </button>
                </div>
              </div>
            </div>
          </div>
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