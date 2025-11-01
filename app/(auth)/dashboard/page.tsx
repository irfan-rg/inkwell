"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/trpc";
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
import { PlusCircle, FileText, FolderOpen, BookOpen, Edit, Trash2, Calendar, Clock, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>("");
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const supabase = createClient();

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
  
  // Delete mutation
  const deleteMutation = api.post.delete.useMutation({
    onSuccess: () => {
      toast.success("Post deleted successfully");
      utils.post.getUserPosts.invalidate();
      setDeletePostId(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete post");
    },
  });

  // Calculate stats from real data
  const stats = {
    totalPosts: posts?.length || 0,
    publishedPosts: posts?.filter((p) => p.published).length || 0,
    draftPosts: posts?.filter((p) => !p.published).length || 0,
  };

  // Handle delete
  const handleDelete = (postId: string) => {
    deleteMutation.mutate({ id: postId });
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
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : !posts || posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Start creating content by clicking the button below. Your posts will appear here.
              </p>
              <Button asChild>
                <Link href="/dashboard/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First Post
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.slice(0, 5).map((post) => (
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
                          {post.updatedAt !== post.createdAt && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
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
              
              {posts.length > 5 && (
                <div className="pt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Showing 5 of {posts.length} posts
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
