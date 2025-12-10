import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface PostSkeletonProps {
  variant?: "default" | "compact";
}

export function PostSkeleton({ variant = "default" }: PostSkeletonProps) {
  const isCompact = variant === "compact";

  return (
    <Card className="overflow-hidden pt-0">
      {/* Cover Image Skeleton */}
      <Skeleton className={`w-full ${isCompact ? "h-40" : "h-48 md:h-56"} rounded-t-lg rounded-b-none`} />

      <CardHeader className={isCompact ? "pb-3" : "pb-4"}>
        {/* Category Badge Skeletons */}
        <div className="flex gap-2 mb-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>

        {/* Title Skeleton */}
        <div className="space-y-2">
          <Skeleton className={`${isCompact ? "h-5" : "h-6"} w-full`} />
          <Skeleton className={`${isCompact ? "h-5" : "h-6"} w-3/4`} />
        </div>
      </CardHeader>

      <CardContent className={isCompact ? "pb-3" : "pb-4"}>
        {/* Excerpt Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>

      <CardFooter className="flex gap-4 pt-0">
        {/* Metadata Skeletons */}
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </CardFooter>
    </Card>
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
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(count)].map((_, i) => (
        <PostSkeleton key={i} variant={variant} />
      ))}
    </div>
  );
}
