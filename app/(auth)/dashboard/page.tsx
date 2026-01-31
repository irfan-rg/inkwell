"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PlusIcon, PencilIcon, TrashIcon, DocumentTextIcon, ArchiveBoxIcon, CheckCircleIcon, FolderIcon, MinusCircleIcon } from "@heroicons/react/24/solid";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface Post {
  id: string;
  title: string;
  published: boolean;
  archived: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  description?: string;
  [key: string]: unknown;
}

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"all" | "published" | "draft" | "archived">("all");
  const supabase = createClient();
  const queryClient = useQueryClient();
  const router = useRouter();

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

  const { data: posts, isLoading } = api.post.getUserPosts.useQuery();
  const utils = api.useUtils();
  
  const archiveMutation = api.post.update.useMutation({
    onMutate: async (updatedPost) => {
      await queryClient.cancelQueries({
        queryKey: [['post', 'getUserPosts'], { type: 'query' }],
      });
      const previousPosts = queryClient.getQueryData([
        ['post', 'getUserPosts'],
        { type: 'query' },
      ]);
      queryClient.setQueryData(
        [['post', 'getUserPosts'], { type: 'query' }],
        (old: Post[] | undefined) => {
          if (!old) return old;
          return old.map((post) =>
            post.id === updatedPost.id
              ? { ...post, archived: updatedPost.archived ?? post.archived }
              : post
          );
        }
      );
      return { previousPosts };
    },
    onError: (err, updatedPost, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(
          [['post', 'getUserPosts'], { type: 'query' }],
          context.previousPosts
        );
      }
      toast.error(err.message || "Failed to update post");
    },
    onSuccess: (_data, variables) => {
      toast.success(
        variables.archived ? "Post archived" : "Post restored"
      );
    },
    onSettled: () => {
      utils.post.getUserPosts.invalidate();
    },
  });
  
  const deleteMutation = api.post.delete.useMutation({
    onMutate: async (deletedPost) => {
      await queryClient.cancelQueries({
        queryKey: [['post', 'getUserPosts'], { type: 'query' }],
      });
      const previousPosts = queryClient.getQueryData([
        ['post', 'getUserPosts'],
        { type: 'query' },
      ]);
      queryClient.setQueryData(
        [['post', 'getUserPosts'], { type: 'query' }],
        (old: Post[] | undefined) => {
          if (!old) return old;
          return old.filter((post) => post.id !== deletedPost.id);
        }
      );
      return { previousPosts };
    },
    onError: (err, deletedPost, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(
          [['post', 'getUserPosts'], { type: 'query' }],
          context.previousPosts
        );
      }
      toast.error(err.message || "Failed to delete post");
    },
    onSuccess: () => {
      toast.success("Post deleted");
    },
    onSettled: () => {
      utils.post.getUserPosts.invalidate();
    },
  });

  const stats = {
    totalPosts: posts?.filter((p) => !p.archived).length || 0,
    publishedPosts: posts?.filter((p) => p.published && !p.archived).length || 0,
    draftPosts: posts?.filter((p) => !p.published && !p.archived).length || 0,
    archivedPosts: posts?.filter((p) => p.archived).length || 0,
  };

  const filteredPosts = posts?.filter((post) => {
    if (activeTab === "all") return !post.archived;
    if (activeTab === "published") return post.published && !post.archived;
    if (activeTab === "draft") return !post.published && !post.archived;
    if (activeTab === "archived") return post.archived;
    return true;
  }) || [];

  const handleDelete = (postId: string) => {
    deleteMutation.mutate({ id: postId });
  };

  const handleToggleArchive = (postId: string, currentArchived: boolean) => {
    archiveMutation.mutate({
      id: postId,
      archived: !currentArchived,
    });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-20">
      {/* 1. STUDIO HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-border pb-8">
        <div>
          <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.8] mb-4">
            Studio
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Logged in as <span className="text-foreground font-bold">{userName}</span>
          </p>
        </div>
        
        <div className="flex w-full md:w-auto gap-4">
          <Button 
            asChild 
            variant="outline"
            className="flex-1 md:flex-none rounded-none h-12 px-6 border-foreground text-foreground hover:bg-foreground hover:text-background font-bold uppercase tracking-widest text-xs transition-colors"
          >
            <Link href="/dashboard/categories">
              <FolderIcon className="mr-2 h-4 w-4" /> Topics
            </Link>
          </Button>
          
          <Button
            asChild
            className="flex-1 md:flex-none rounded-none h-12 px-8 bg-foreground text-background hover:bg-foreground/80 font-bold uppercase tracking-widest text-xs transition-colors"
          >
            <Link href="/dashboard/new">
              <PlusIcon className="mr-2 h-4 w-4" /> New Entry
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. STAT STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-y border-border mb-12">
        {[
          { label: "Total Entries", value: stats.totalPosts },
          { label: "Published", value: stats.publishedPosts },
          { label: "Drafts", value: stats.draftPosts },
          { label: "Archived", value: stats.archivedPosts },
        ].map((stat, i) => (
          <div key={i} className={`p-6 border-border ${i === 0 ? 'border-r' : ''} ${i === 1 ? 'md:border-r' : ''} ${i === 2 ? 'border-r md:border-r' : ''} ${i >= 2 ? 'border-t md:border-t-0' : ''}`}>
            <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground mb-2">
              {stat.label}
            </span>
            <span className="block text-4xl font-display font-bold">
              {stat.value.toString().padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>

      {/* 3. MANIFEST TABLE */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Manifest</h2>
          <TabsList className="bg-transparent p-0 gap-6 h-auto rounded-none border-b border-transparent">
            {["all", "published", "draft", "archived"].map((tab) => (
              <TabsTrigger 
                key={tab} 
                value={tab}
                className="rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none px-0 py-1 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          {isLoading ? (
            <div className="border border-border">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-6 border-b border-border last:border-b-0">
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-9 w-9" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="border border-dashed border-border p-16 flex flex-col items-center justify-center text-center">
              <EmptyState
                title="No entries found"
                description="Your creative journey begins with a single keystroke."
                action={{
                  label: "Create First Post",
                  onClick: () => router.push("/dashboard/new"),
                }}
              />
            </div>
          ) : (
            <div className="border-t border-border">
              {filteredPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-8 p-6 border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => router.push(`/blogs/${post.slug}`)}
                >
                  {/* Status Indicator */}
                  <div className="hidden md:flex items-center justify-center w-8">
                    {post.published ? (
                      <CheckCircleIcon className="h-5 w-5 text-primary" />
                    ) : (
                      <MinusCircleIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 mb-1">
                      <h3 
                        className="text-xl font-syne font-bold text-foreground truncate group-hover:text-primary transition-colors"
                        style={{ fontFamily: 'var(--font-syne)' }}
                      >
                        {post.title}
                      </h3>
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 border ${post.published ? 'border-primary text-primary' : 'border-muted-foreground text-muted-foreground'}`}>
                        {post.published ? "PUB" : "DFT"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                      <span>{format(new Date(post.createdAt), "MMM dd, yyyy")}</span>
                      <span>•</span>
                      <span>{format(new Date(post.updatedAt), "HH:mm")}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="ghost" 
                      asChild 
                      className="h-9 px-3 rounded-none hover:bg-foreground hover:text-background gap-2"
                    >
                      <Link href={`/dashboard/edit/${post.id}`}>
                        <DocumentTextIcon className="h-4 w-4" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Edit</span>
                      </Link>
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => handleToggleArchive(post.id, post.archived)}
                      className="h-9 px-3 rounded-none hover:bg-foreground hover:text-background gap-2"
                    >
                      <ArchiveBoxIcon className="h-4 w-4" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                        {post.archived ? "Restore" : "Archive"}
                      </span>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="h-9 px-3 rounded-none hover:bg-destructive hover:text-destructive-foreground gap-2"
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-none border-2 border-foreground p-8 max-w-sm">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-display text-2xl font-bold uppercase mb-4">Confirm Deletion</AlertDialogTitle>
                          <AlertDialogDescription className="font-mono text-xs">
                            This action is permanent and cannot be Undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-6">
                          <AlertDialogCancel className="rounded-none border-foreground font-bold uppercase text-xs tracking-widest">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(post.id)} className="rounded-none bg-destructive text-destructive-foreground font-bold uppercase text-xs tracking-widest hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}