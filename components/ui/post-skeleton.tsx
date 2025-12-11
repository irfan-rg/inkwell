import { Skeleton } from "@/components/ui/skeleton";

interface PostSkeletonProps {
  variant?: "default" | "compact";
}

export function PostSkeleton({ variant = "default" }: PostSkeletonProps) {
  return (
    <article className="group border-2 border-foreground bg-background transition-all hover:border-foreground/60">
      {/* Cover Image Skeleton */}
      <div className="aspect-video border-b-2 border-foreground bg-muted/20 animate-pulse" />
      
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