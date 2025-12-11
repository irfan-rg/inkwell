"use client";

import React, { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "sonner";
import { PlusIcon, PencilSquareIcon, TrashIcon, FolderIcon, ArrowPathIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import { generateSlug } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  postCount?: number;
}

export default function CategoriesPage() {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const queryClient = useQueryClient();
  const utils = api.useUtils();

  const { data: categories, isLoading } = api.category.list.useQuery();

  const createMutation = api.category.create.useMutation({
    onMutate: async (newCategory) => {
      await queryClient.cancelQueries({ queryKey: [["category", "list"]] });
      const previousCategories = queryClient.getQueryData([["category", "list"]]);
      queryClient.setQueryData([["category", "list"]], (old: Category[] | undefined) => {
        return [...(old || []), {
          id: `temp-${Date.now()}`,
          name: newCategory.name,
          slug: generateSlug(newCategory.name),
          description: newCategory.description || null,
          postCount: 0,
        }];
      });
      return { previousCategories };
    },
    onError: (err, _new, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData([["category", "list"]], context.previousCategories);
      }
      toast.error(err.message || "Failed to create category");
    },
    onSuccess: () => {
      toast.success("Category created");
      setIsDialogOpen(false);
      setFormData({ name: "", description: "" });
    },
    onSettled: () => utils.category.list.invalidate(),
  });

  const updateMutation = api.category.update.useMutation({
    onMutate: async (updatedCategory) => {
      await queryClient.cancelQueries({ queryKey: [["category", "list"]] });
      const previousCategories = queryClient.getQueryData([["category", "list"]]);
      queryClient.setQueryData([["category", "list"]], (old: Category[] | undefined) => {
        return (old || []).map((cat: Category) =>
          cat.id === updatedCategory.id
            ? { ...cat, name: updatedCategory.name || cat.name, description: updatedCategory.description ?? cat.description }
            : cat
        );
      });
      return { previousCategories };
    },
    onError: (err, _upd, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData([["category", "list"]], context.previousCategories);
      }
      toast.error(err.message || "Failed to update category");
    },
    onSuccess: () => {
      toast.success("Category updated");
      setIsDialogOpen(false);
      setEditingCategory(null);
      setFormData({ name: "", description: "" });
    },
    onSettled: () => utils.category.list.invalidate(),
  });

  const deleteMutation = api.category.delete.useMutation({
    onMutate: async (deletedCategory) => {
      await queryClient.cancelQueries({ queryKey: [["category", "list"]] });
      const previousCategories = queryClient.getQueryData([["category", "list"]]);
      queryClient.setQueryData([["category", "list"]], (old: Category[] | undefined) => {
        return (old || []).filter((cat: Category) => cat.id !== deletedCategory.id);
      });
      return { previousCategories };
    },
    onError: (err, _del, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData([["category", "list"]], context.previousCategories);
      }
      toast.error(err.message || "Failed to delete category");
    },
    onSuccess: () => {
      toast.success("Category deleted");
      setDeleteConfirmId(null);
    },
    onSettled: () => utils.category.list.invalidate(),
  });

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (editingCategory) {
      updateMutation.mutate({
        id: editingCategory.id,
        name: formData.name,
        description: formData.description || undefined,
      });
    } else {
      createMutation.mutate({
        name: formData.name,
        description: formData.description || undefined,
      });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-[1600px] mx-auto min-h-screen pb-20">
      <div className="mb-6">
        <Button
          variant="ghost"
          asChild
          className="rounded-none hover:bg-transparent hover:text-primary pl-0 text-muted-foreground font-mono text-xs uppercase tracking-widest"
        >
          <Link href="/dashboard">
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Studio
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-border pb-8">
        <div>
          <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.8] mb-4">
            Topics
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Organize your content structure
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate} className="rounded-none h-12 px-8 bg-foreground text-background hover:bg-primary hover:text-white font-bold uppercase tracking-widest text-xs transition-colors">
              <PlusIcon className="mr-2 h-4 w-4" />
              New Topic
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-none border-2 border-foreground p-8 sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl font-bold uppercase">
                {editingCategory ? "Edit Topic" : "New Topic"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Technology..."
                  required
                  className="font-mono text-sm border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description..."
                  rows={3}
                  className="resize-none border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent min-h-20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                  className="rounded-none font-bold uppercase tracking-widest text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="rounded-none bg-foreground text-background font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-white">
                  {isSubmitting && <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />}
                  {editingCategory ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid List */}
      {isLoading ? (
        <div className="space-y-px bg-border border-t border-border">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-muted/20" />
          ))}
        </div>
      ) : !categories || categories.length === 0 ? (
        <div className="border border-dashed border-border p-16 flex flex-col items-center justify-center text-center">
          <EmptyState
            icon={FolderIcon}
            title="No topics found"
            description="Create your first category to start organizing."
            action={{
              label: "Create Topic",
              onClick: handleCreate,
            }}
          />
        </div>
      ) : (
        <div className="border-t border-border">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="group flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-border hover:bg-muted/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-display font-bold text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground border border-border px-2 py-0.5">
                    {category.postCount} {category.postCount === 1 ? 'Entry' : 'Entries'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                  <span className="bg-muted px-1.5 py-0.5 text-[10px]">/{category.slug}</span>
                  {category.description && (
                    <span className="truncate max-w-md hidden md:inline-block border-l border-border pl-4">
                      {category.description}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 md:mt-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(category)}
                  className="h-9 w-9 rounded-none hover:bg-foreground hover:text-background"
                >
                  <PencilSquareIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteConfirmId(category.id)}
                  className="h-9 w-9 rounded-none hover:bg-destructive hover:text-destructive-foreground"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <AlertDialogContent className="rounded-none border-2 border-foreground p-8 max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl font-bold uppercase">Delete Topic?</AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-xs">
              This will remove the topic from all associated entries.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="rounded-none border-foreground font-bold uppercase text-xs tracking-widest">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && deleteMutation.mutate({ id: deleteConfirmId })}
              className="rounded-none bg-destructive text-destructive-foreground font-bold uppercase text-xs tracking-widest hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
