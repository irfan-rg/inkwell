"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, User } from "lucide-react";
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
}

export function PostCard({ post, variant = "default" }: PostCardProps) {
  const readingTime = post.content ? calculateReadingTime(post.content) : null;

  // COMPACT VARIANT (for sidebars/related posts)
  if (variant === "compact") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
        <Link href={`/blogs/${post.slug}`} className="flex gap-4 p-4">
          {/* Smaller image */}
          {post.coverImage ? (
            <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover hover:opacity-95 transition-opacity rounded-lg"
                sizes="96px"
              />
            </div>
          ) : (
            <div className="w-24 h-24 shrink-0 rounded-lg bg-linear-to-br from-gold-100 to-gold-200 flex items-center justify-center text-3xl">
              𓆰
            </div>
          )}

          <div className="flex-1 min-w-0">
            {/* Categories */}
            {post.postCategories && post.postCategories.length > 0 && (
              <div className="flex gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {post.postCategories[0].category.name}
                </Badge>
                {post.postCategories.length > 1 && (
                  <Badge variant="outline" className="text-xs">
                    +{post.postCategories.length - 1}
                  </Badge>
                )}
              </div>
            )}

            {/* Title */}
            <h3 className="text-lg font-display font-semibold text-ink-black hover:text-gold-600 transition-colors duration-200 line-clamp-2 mb-2">
              {post.title}
            </h3>

            {/* Simpler metadata */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(new Date(post.createdAt))}</span>
              </div>
              {readingTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{readingTime} min</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  // DEFAULT VARIANT LAYOUT
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group p-0">
      <Link href={`/blogs/${post.slug}`}>
        {/* Cover image section */}
        {post.coverImage ? (
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:opacity-95 transition-opacity"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="aspect-video bg-linear-to-br from-gold-100 to-gold-200 flex items-center justify-center text-6xl">
            𓆰
          </div>
        )}

        {/* Content section */}
        <div className="p-6">
          {/* Categories at top */}
          {post.postCategories && post.postCategories.length > 0 && (
            <div className="flex gap-2 mb-3 flex-wrap">
              {post.postCategories.slice(0, 2).map((pc) => (
                <Badge key={pc.category.id} variant="outline" className="text-xs">
                  {pc.category.name}
                </Badge>
              ))}
              {post.postCategories.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{post.postCategories.length - 2} more
                </Badge>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="text-2xl font-display font-semibold text-ink-black group-hover:text-gold-600 transition-colors duration-200 line-clamp-2 mb-3">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-sm font-body text-muted-foreground leading-relaxed line-clamp-3 mb-4">
              {post.excerpt}
            </p>
          )}

          {/* Metadata footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {/* Left side: Author */}
            {post.authorName && (
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                <span>{post.authorName}</span>
              </div>
            )}

            {/* Right side: Date + Reading time */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(new Date(post.createdAt))}</span>
              </div>
              {readingTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{readingTime} min</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
