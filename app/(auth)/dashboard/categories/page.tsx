"use client";

import { useState } from "react";
import { api } from "@/lib/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Folder, Loader2 } from "lucide-react";
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

  // Fetch categories
  const { data: categories, isLoading, refetch } = api.category.list.useQuery();

  // Mutations
  const createMutation = api.category.create.useMutation({
    onMutate: async (newCategory) => {
      await queryClient.cancelQueries({ queryKey: [["category", "list"]] });
      const previousCategories = queryClient.getQueryData([["category", "list"]]);
      
      // Optimistically add the new category
      queryClient.setQueryData([["category", "list"]], (old: any) => {
        const optimisticCategory = {
          id: `temp-${Date.now()}`,
          name: newCategory.name,
          slug: generateSlug(newCategory.name),
          description: newCategory.description,
          postCount: 0,
        };
        return [...(old || []), optimisticCategory];
      });
      
      return { previousCategories };
    },
    onError: (err, newCategory, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData([["category", "list"]], context.previousCategories);
      }
      toast.error(err.message || "Failed to create category");
    },
    onSuccess: () => {
      toast.success("Category created successfully");
      setIsDialogOpen(false);
      setFormData({ name: "", description: "" });
    },
    onSettled: () => {
      utils.category.list.invalidate();
    },
  });

  const updateMutation = api.category.update.useMutation({
    onMutate: async (updatedCategory) => {
      await queryClient.cancelQueries({ queryKey: [["category", "list"]] });
      const previousCategories = queryClient.getQueryData([["category", "list"]]);
      
      // Optimistically update the category
      queryClient.setQueryData([["category", "list"]], (old: any) => {
        return (old || []).map((cat: Category) =>
          cat.id === updatedCategory.id
            ? { ...cat, name: updatedCategory.name, description: updatedCategory.description }
            : cat
        );
      });
      
      return { previousCategories };
    },
    onError: (err, updatedCategory, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData([["category", "list"]], context.previousCategories);
      }
      toast.error(err.message || "Failed to update category");
    },
    onSuccess: () => {
      toast.success("Category updated successfully");
      setIsDialogOpen(false);
      setEditingCategory(null);
      setFormData({ name: "", description: "" });
    },
    onSettled: () => {
      utils.category.list.invalidate();
    },
  });

  const deleteMutation = api.category.delete.useMutation({
    onMutate: async (deletedCategory) => {
      await queryClient.cancelQueries({ queryKey: [["category", "list"]] });
      const previousCategories = queryClient.getQueryData([["category", "list"]]);
      
      // Optimistically remove the category
      queryClient.setQueryData([["category", "list"]], (old: any) => {
        return (old || []).filter((cat: Category) => cat.id !== deletedCategory.id);
      });
      
      return { previousCategories };
    },
    onError: (err, deletedCategory, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData([["category", "list"]], context.previousCategories);
      }
      toast.error(err.message || "Failed to delete category");
    },
    onSuccess: () => {
      toast.success("Category deleted successfully");
      setDeleteConfirmId(null);
    },
    onSettled: () => {
      utils.category.list.invalidate();
    },
  });

  // Handle opening dialog for create
  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
    setIsDialogOpen(true);
  };

  // Handle opening dialog for edit
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setIsDialogOpen(true);
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (editingCategory) {
      // Update existing category
      updateMutation.mutate({
        id: editingCategory.id,
        name: formData.name,
        description: formData.description || undefined,
      });
    } else {
      // Create new category
      createMutation.mutate({
        name: formData.name,
        description: formData.description || undefined,
      });
    }
  };

  // Handle delete
  const handleDelete = (id: string) => {
    deleteMutation.mutate({ id });
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const slugPreview = formData.name ? generateSlug(formData.name) : "";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Manage Categories</h1>
          <p className="text-muted-foreground">
            Create and manage categories for organizing your posts
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Create New Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Technology, Travel, Food"
                  required
                />
                {slugPreview && (
                  <p className="text-xs text-muted-foreground">
                    Slug: <code className="bg-muted px-1 py-0.5 rounded">{slugPreview}</code>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description of this category"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingCategory ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : !categories || categories.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              icon={Folder}
              title="No categories yet"
              description="Create your first category to start organizing your posts"
              action={{
                label: "Create Category",
                onClick: handleCreate,
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Folder className="h-5 w-5 text-primary" />
                      {category.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {category.slug}
                      </Badge>
                      {category.postCount !== undefined && (
                        <Badge variant="outline" className="text-xs">
                          {category.postCount} {category.postCount === 1 ? 'post' : 'posts'}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteConfirmId(category.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {category.description && (
                <CardContent>
                  <CardDescription className="line-clamp-2">
                    {category.description}
                  </CardDescription>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the category from all posts. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
