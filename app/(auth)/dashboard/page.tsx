"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { PlusCircle, FileText, BookOpen, Edit, Trash2, Calendar, Clock, Archive, FolderOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>("");
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "published" | "draft" | "archived">("all");
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
    totalPosts: posts?.filter((p) => !p.archived).length || 0,
    publishedPosts: posts?.filter((p) => p.published && !p.archived).length || 0,
    draftPosts: posts?.filter((p) => !p.published && !p.archived).length || 0,
    archivedPosts: posts?.filter((p) => p.archived).length || 0,
  };

  // Filter posts based on active tab
  const filteredPosts = posts?.filter((post) => {
    if (activeTab === "all") return !post.archived;
    if (activeTab === "published") return post.published && !post.archived;
    if (activeTab === "draft") return !post.published && !post.archived;
    if (activeTab === "archived") return post.archived;
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

  // Handle toggle archive status
  const handleToggleArchive = (postId: string, currentArchived: boolean) => {
    updateMutation.mutate({
      id: postId,
      archived: !currentArchived,
    });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER SECTION */}
        <div className="border-b border-border py-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            {/* Left: Heading */}
            <h1 className="text-4xl font-display font-bold">Your Stories</h1>

            {/* Right: Action buttons */}
            <div className="flex gap-3">
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard/categories">
                  <FolderOpen className="mr-2 h-5 w-5" />
                  Categories
                </Link>
              </Button>
              <Button size="lg" asChild>
                <Link href="/dashboard/new">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  New Post
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total posts */}
          <Card className="border-2 hover:shadow-lg transition-all duration-300 group">
            <div className="p-3 px-6 py-2">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display font-bold text-primary">{stats.totalPosts}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mt-4">Total Posts</p>
            </div>
          </Card>

          {/* Published */}
          <Card className="border-2 hover:shadow-lg transition-all duration-300 group">
            <div className="p-3 px-6 py-2">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 dark:bg-green-950/50 dark:group-hover:bg-green-950/70 transition-colors">
                  <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display font-bold text-green-600 dark:text-green-400">{stats.publishedPosts}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mt-4">Published</p>
            </div>
          </Card>

          {/* Drafts */}
          <Card className="border-2 hover:shadow-lg transition-all duration-300 group">
            <div className="p-3 px-6 py-2">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-orange-100 group-hover:bg-orange-200 dark:bg-orange-950/50 dark:group-hover:bg-orange-950/70 transition-colors">
                  <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display font-bold text-orange-600 dark:text-orange-400">{stats.draftPosts}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mt-4">Drafts</p>
            </div>
          </Card>

          {/* Archived */}
          <Card className="border-2 hover:shadow-lg transition-all duration-300 group">
            <div className="p-3 px-6 py-2">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 dark:bg-gray-950/50 dark:group-hover:bg-gray-950/70 transition-colors">
                  <Archive className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display font-bold text-gray-600 dark:text-gray-400">{stats.archivedPosts}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mt-4">Archived</p>
            </div>
          </Card>
        </div>
      </div>

      {/* TABS SECTION */}
      <div className="pt-8">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-2">
                {stats.totalPosts}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="published">
              Published
              <Badge variant="secondary" className="ml-2">
                {stats.publishedPosts}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="draft">
              Drafts
              <Badge variant="secondary" className="ml-2">
                {stats.draftPosts}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="archived">
              Archived
              <Badge variant="secondary" className="ml-2">
                {stats.archivedPosts}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="py-6">
            {/* POSTS LIST */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="p-0 overflow-hidden">
                    <Skeleton className="aspect-video w-full" />
                    <div className="p-6 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No stories yet"
                description="Start writing your first story"
                action={{
                  label: "Create Post",
                  onClick: () => router.push("/dashboard/new"),
                }}
              />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="p-0 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                    {/* Thumbnail */}
                    {post.coverImage ? (
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:opacity-95 transition-opacity"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-linear-to-br from-gold-100 to-gold-200 flex items-center justify-center text-5xl">
                        𓆰
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      {/* Status badge */}
                      <Badge variant={post.published ? "default" : "secondary"} className="mb-3">
                        {post.published ? "Published" : "Draft"}
                      </Badge>

                      {/* Title */}
                      <h3 className="text-xl font-display font-semibold line-clamp-2 mb-2">
                        {post.title}
                      </h3>

                      {/* Date */}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 flex-wrap">
                        {/* Edit button */}
                        <Button size="sm" variant="outline" asChild className="flex-1">
                          <Link href={`/dashboard/edit/${post.id}`}>
                            <Edit className="mr-1 h-3.5 w-3.5" />
                            Edit
                          </Link>
                        </Button>

                        {/* Archive/Unarchive button */}
                        {!post.archived ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleArchive(post.id, post.archived)}
                            disabled={updateMutation.isPending}
                            title="Archive post"
                          >
                            <Archive className="h-3.5 w-3.5 text-orange-600" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleArchive(post.id, post.archived)}
                            disabled={updateMutation.isPending}
                            title="Unarchive post"
                          >
                            <Archive className="h-3.5 w-3.5 text-green-600" />
                          </Button>
                        )}

                        {/* Delete button */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" onClick={() => setDeletePostId(post.id)}>
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your post.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setDeletePostId(null)}>
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(post.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </div>
  );
}
