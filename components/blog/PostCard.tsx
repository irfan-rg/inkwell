"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, PenTool, UserRoundPen } from "lucide-react";
import { formatDate, calculateReadingTime } from "@/lib/utils";
import { format } from "date-fns";

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

export function PostCard({ post, variant = "default", showAuthor = true }: PostCardProps) {
  const readingTime = post.content ? calculateReadingTime(post.content) : null;

  // COMPACT VARIANT (for sidebars/related posts)
  if (variant === "compact") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
        <Link href={`/blogs/${post.slug}`} className="flex gap-3 sm:gap-4 p-3 sm:p-4">
          {/* Smaller image */}
          {post.coverImage ? (
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-lg overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover hover:opacity-95 transition-opacity rounded-lg"
                sizes="(max-width: 640px) 80px, 96px"
              />
            </div>
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-lg bg-linear-to-br from-gold-100 to-gold-200 flex items-center justify-center">
              <PenTool className="h-8 w-8 sm:h-10 sm:w-10 text-gold-600" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            {/* Categories */}
            {post.postCategories && post.postCategories.length > 0 && (
              <div className="flex gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
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
            <h3 className="text-base sm:text-lg font-display font-semibold text-ink-black hover:text-gold-600 transition-colors duration-200 line-clamp-2 mb-1.5 sm:mb-2">
              {post.title}
            </h3>

            {/* Simpler metadata */}
            <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span className="hidden sm:inline">{formatDate(new Date(post.createdAt))}</span>
                <span className="sm:hidden">{format(new Date(post.createdAt), "MMM d")}</span>
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
          <div className="aspect-video bg-linear-to-br from-gold-100 to-gold-200 flex items-center justify-center">
            <div className="p-2 rounded-lg bg-primary/10">
                <PenTool className="h-5 w-5 text-primary -rotate-90" />
            </div>
          </div>
        )}

        {/* Content section */}
        <div className="p-4 sm:p-6">
          {/* Categories at top */}
          {post.postCategories && post.postCategories.length > 0 && (
            <div className="flex gap-1.5 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
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
          <h3 className="text-lg sm:text-xl md:text-2xl font-display font-semibold text-ink-black group-hover:text-gold-600 transition-colors duration-200 line-clamp-2 mb-2 sm:mb-3">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xs sm:text-sm font-body text-muted-foreground leading-relaxed line-clamp-3 mb-3 sm:mb-4">
              {post.excerpt}
            </p>
          )}

          {/* Metadata footer */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-xs text-muted-foreground">
            {/* Left side: Author */}
            {showAuthor && post.authorName && (
              <div className="flex items-center gap-1">
                <UserRoundPen className="h-3 w-3 sm:h-3.5 sm:w-3.5 font-bold" />
                <span className="truncate font-bold">{post.authorName}</span>
              </div>
            )}

            {/* Right side: Date + Reading time */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="hidden sm:inline">{formatDate(new Date(post.createdAt))}</span>
                <span className="sm:hidden">{format(new Date(post.createdAt), "MMM d")}</span>
              </div>
              {readingTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
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
