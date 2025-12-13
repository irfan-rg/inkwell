import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface PostSkeletonProps {
  variant?: "default" | "compact";
  className?: string;
  borderless?: boolean;
}

export function PostSkeleton({ className, borderless }: PostSkeletonProps) {
  return (
    <article
      className={cn(
        borderless
          ? "group bg-background"
          : "group border border-border bg-background transition-colors hover:border-primary",
        className
      )}
    >
      {/* Cover Image Skeleton */}
      <div className="aspect-video border-b border-border bg-muted/20 animate-pulse" />
      
      <div className="p-6 space-y-4">
        {/* Category */}
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20" />
        </div>
        
        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-7 w-3/4" />
        </div>
        
        {/* Excerpt */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        
        {/* Metadata */}
        <div className="flex gap-4 pt-2 border-t border-foreground/10">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </article>
  );
}

export function PostListSkeleton({ 
  count = 6, 
  variant = "default" 
}: { 
  count?: number; 
  variant?: "default" | "compact" 
}) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <PostSkeleton key={i} variant={variant} />
      ))}
    </>
  );
}