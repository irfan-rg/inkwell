"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDate, calculateReadingTime } from "@/lib/utils";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    content?: string;
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
  };
  variant?: "default" | "compact";
  showAuthor?: boolean;
}

export function PostCard({ post }: PostCardProps) {
  const readingTime = post.content ? calculateReadingTime(post.content) : null;
  const category = post.postCategories?.[0]?.category;

  return (
    <div className="group h-full flex flex-col border border-border bg-background hover:border-primary transition-colors duration-300">
      <Link href={`/blogs/${post.slug}`} className="block relative aspect-3/2 overflow-hidden border-b border-border">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/20 text-muted-foreground/20 font-display text-6xl font-bold uppercase tracking-tighter">
            Ink
          </div>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono uppercase tracking-widest text-foreground font-bold">
            {category ? category.name : "Uncategorized"}
          </span>
          <span className="text-xs font-mono text-muted-foreground">
            {formatDate(new Date(post.createdAt))}
          </span>
        </div>

        <Link href={`/blogs/${post.slug}`}>
          <h3 
            className="text-2xl font-syne font-bold leading-tight mb-3 group-hover:text-foreground/60 transition-colors line-clamp-2"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            {post.title}
          </h3>
        </Link>

        {post.excerpt && (
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
            {post.excerpt}
          </p>
        )}

        <div className="pt-4 border-t border-border flex items-center justify-between mt-auto">
          <Link 
            href={`/blogs/${post.slug}`} 
            className="text-xs font-bold uppercase tracking-widest border-b-2 border-transparent group-hover:border-primary transition-all pb-0.5"
          >
            Read Story
          </Link>
          {readingTime && (
            <span className="text-xs font-mono text-muted-foreground">{readingTime} min read</span>
          )}
        </div>
      </div>
    </div>
  );
}