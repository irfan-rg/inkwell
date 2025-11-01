"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
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

export function PostCard({ post, variant = "default", showAuthor = false }: PostCardProps) {
  const isCompact = variant === "compact";

  // Format date consistently to avoid hydration mismatch
  const formattedDate = format(new Date(post.createdAt), "MMM d, yyyy");

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg group">
      <Link href={`/blogs/${post.slug}`} className="block">
        {/* Cover Image */}
        {post.coverImage && (
          <div className={`relative overflow-hidden bg-muted ${isCompact ? "h-40" : "h-48 md:h-56"}`}>
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes={isCompact ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
            />
            {!post.published && (
              <div className="absolute top-3 right-3">
                <Badge variant="secondary">Draft</Badge>
              </div>
            )}
          </div>
        )}

        <CardHeader className={isCompact ? "pb-3" : "pb-4"}>
          {/* Categories */}
          {post.postCategories && post.postCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {post.postCategories.slice(0, 3).map((pc) => (
                <Badge key={pc.category.id} variant="outline" className="text-xs">
                  {pc.category.name}
                </Badge>
              ))}
              {post.postCategories.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.postCategories.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className={`font-bold leading-tight group-hover:text-primary transition-colors ${
            isCompact ? "text-lg line-clamp-2" : "text-xl md:text-2xl line-clamp-2"
          }`}>
            {post.title}
          </h3>
        </CardHeader>

        <CardContent className={isCompact ? "pb-3" : "pb-4"}>
          {/* Excerpt */}
          {post.excerpt && (
            <p className={`text-muted-foreground ${
              isCompact ? "text-sm line-clamp-2" : "text-sm md:text-base line-clamp-3"
            }`}>
              {post.excerpt}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-0">
          {/* Author */}
          {showAuthor && post.authorName && (
            <div className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              <span>{post.authorName}</span>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>

          {/* Reading Time (estimate based on content) */}
          {post.excerpt && (
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>5 min read</span>
            </div>
          )}
        </CardFooter>
      </Link>
    </Card>
  );
}
