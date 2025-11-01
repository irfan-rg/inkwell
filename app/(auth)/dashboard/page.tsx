"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PlusCircle, FileText, FolderOpen, BookOpen, Edit, Trash2, Calendar, Clock, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import { calculateReadingTime } from "@/lib/utils";

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>("");
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "published" | "draft">("all");
  const supabase = createClient();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Get user info
  useEffect(() => {
    const getUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.name) {
        setUserName(user.user_metadata.name);
      } else if (user?.email) {
        setUserName(user.email.split('@')[0]);
      }
    };
    getUserInfo();
  }, [supabase]);

  // Fetch user's posts
  const { data: posts, isLoading } = api.post.getUserPosts.useQuery();
  const utils = api.useUtils();
  
  // Update mutation for toggling publish status
  const updateMutation = api.post.update.useMutation({
    onMutate: async (updatedPost) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: [['post', 'getUserPosts'], { type: 'query' }],
      });
      
      // Snapshot previous value
      const previousPosts = queryClient.getQueryData([
        ['post', 'getUserPosts'],
        { type: 'query' },
      ]);
      
      // Optimistically update the post
      queryClient.setQueryData(
        [['post', 'getUserPosts'], { type: 'query' }],
        (old: any) => {
          if (!old) return old;
          return old.map((post: any) =>
            post.id === updatedPost.id
              ? { ...post, published: updatedPost.published }
              : post
          );
        }
      );
      
      return { previousPosts };
    },
    onError: (err, updatedPost, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData(
          [['post', 'getUserPosts'], { type: 'query' }],
          context.previousPosts
        );
      }
      toast.error(err.message || "Failed to update post");
    },
    onSuccess: (data, variables) => {
      toast.success(
        variables.published ? "Post published successfully" : "Post unpublished successfully"
      );
    },
    onSettled: () => {
      utils.post.getUserPosts.invalidate();
    },
  });
  
  // Delete mutation with optimistic updates
  const deleteMutation = api.post.delete.useMutation({
    onMutate: async (deletedPost) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: [['post', 'getUserPosts'], { type: 'query' }],
      });
      
      // Snapshot previous value
      const previousPosts = queryClient.getQueryData([
        ['post', 'getUserPosts'],
        { type: 'query' },
      ]);
      
      // Optimistically update - remove the post immediately
      queryClient.setQueryData(
        [['post', 'getUserPosts'], { type: 'query' }],
        (old: any) => {
          if (!old) return old;
          return old.filter((post: any) => post.id !== deletedPost.id);
        }
      );
      
      return { previousPosts };
    },
    onError: (err, deletedPost, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData(
          [['post', 'getUserPosts'], { type: 'query' }],
          context.previousPosts
        );
      }
      toast.error(err.message || "Failed to delete post");
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      setDeletePostId(null);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      utils.post.getUserPosts.invalidate();
    },
  });

  // Calculate stats from real data
  const stats = {
    totalPosts: posts?.length || 0,
    publishedPosts: posts?.filter((p) => p.published).length || 0,
    draftPosts: posts?.filter((p) => !p.published).length || 0,
  };

  // Filter posts based on active tab
  const filteredPosts = posts?.filter((post) => {
    if (activeTab === "all") return true;
    if (activeTab === "published") return post.published;
    if (activeTab === "draft") return !post.published;
    return true;
  }) || [];

  // Handle delete
  const handleDelete = (postId: string) => {
    deleteMutation.mutate({ id: postId });
  };

  // Handle toggle publish status
  const handleTogglePublish = (postId: string, currentStatus: boolean) => {
    updateMutation.mutate({
      id: postId,
      published: !currentStatus,
    });
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back{userName ? `, ${userName}` : ''}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your blog
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button asChild size="lg">
          <Link href="/dashboard/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create New Post
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/dashboard/categories">
            <FolderOpen className="mr-2 h-5 w-5" />
            Manage Categories
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/blogs">
            <BookOpen className="mr-2 h-5 w-5" />
            View Blog
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedPosts}</div>
            <p className="text-xs text-muted-foreground">
              Live on your blog
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draftPosts}</div>
            <p className="text-xs text-muted-foreground">
              Work in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              All your blog posts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-lg border p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <div className="flex gap-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !posts || posts.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No posts yet"
              description="Start creating content by clicking the button below. Your posts will appear here."
              action={{
                label: "Create Your First Post",
                onClick: () => router.push("/dashboard/new"),
              }}
            />
          ) : (
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all" className="relative">
                  All Posts
                  <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-xs">
                    {stats.totalPosts}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="published" className="relative">
                  Published
                  <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-xs">
                    {stats.publishedPosts}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="draft" className="relative">
                  Drafts
                  <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-xs">
                    {stats.draftPosts}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                {filteredPosts.length === 0 ? (
                  <EmptyState
                    icon={FileText}
                    title={`No ${activeTab === "all" ? "" : activeTab} posts`}
                    description={
                      activeTab === "published"
                        ? "You haven't published any posts yet. Publish a draft to see it here."
                        : activeTab === "draft"
                        ? "You don't have any drafts. Create a new post to get started."
                        : "Start creating content by clicking the button below."
                    }
                    action={{
                      label: "Create New Post",
                      onClick: () => router.push("/dashboard/new"),
                    }}
                  />
                ) : (
                  <div className="space-y-4">
                    {filteredPosts.slice(0, 5).map((post) => (
                <div
                  key={post.id}
                  className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  {/* Post Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <h3 className="font-semibold leading-none">{post.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(post.createdAt), "MMM d, yyyy")}
                          </span>
                          {post.content && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {calculateReadingTime(post.content)} min read
                            </span>
                          )}
                          {post.updatedAt !== post.createdAt && (
                            <span className="flex items-center gap-1 text-muted-foreground/70">
                              Updated {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge variant={post.published ? "default" : "secondary"}>
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Categories */}
                    {post.postCategories && post.postCategories.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.postCategories.map((pc: any) => (
                          <Badge key={pc.categoryId} variant="outline" className="text-xs">
                            {pc.category.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {post.published && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blogs/${post.slug}`} target="_blank">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant={post.published ? "ghost" : "default"}
                      size="sm"
                      onClick={() => handleTogglePublish(post.id, post.published)}
                      disabled={updateMutation.isPending}
                    >
                      {post.published ? "Unpublish" : "Publish"}
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/edit/${post.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setDeletePostId(post.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete &quot;{post.title}&quot;. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setDeletePostId(null)}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(post.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={deleteMutation.isPending}
                          >
                            {deleteMutation.isPending && deletePostId === post.id ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    </div>
                  </div>
                ))}
                {filteredPosts.length > 5 && (
                  <div className="pt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Showing 5 of {filteredPosts.length} posts
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </CardContent>
  </Card>
</div>
  );
}
