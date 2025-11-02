"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/blog/ImageUpload";
import { MarkdownEditor } from "@/components/blog/MarkdownEditor";
import { generateSlug } from "@/lib/utils";
import { toast } from "sonner";
import { Save, Eye, ArrowLeft, Loader2 } from "lucide-react";

interface PostFormProps {
  postId?: string;
  initialData?: {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string | null;
    published?: boolean;
    categoryIds?: string[];
  };
}

/**
 * PostForm Component
 * 
 * Comprehensive form for creating and editing blog posts.
 * Handles title, slug, content, cover image, excerpt, categories, and publish status.
 */
export function PostForm({ postId, initialData }: PostFormProps) {
  const router = useRouter();
  
  // Form state
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [coverImage, setCoverImage] = useState<string | null>(initialData?.coverImage || null);
  const [published, setPublished] = useState(initialData?.published || false);
  const [categoryIds, setCategoryIds] = useState<string[]>(initialData?.categoryIds || []);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [actionType, setActionType] = useState<"draft" | "publish" | null>(null);

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = api.category.list.useQuery();

  // Create mutation
  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      toast.success("Post created successfully!");
      setActionType(null);
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create post");
      setActionType(null);
    },
  });

  // Update mutation
  const updatePost = api.post.update.useMutation({
    onSuccess: () => {
      toast.success("Post updated successfully!");
      setActionType(null);
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update post");
      setActionType(null);
    },
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !slugManuallyEdited) {
      setSlug(generateSlug(title));
    }
  }, [title, slugManuallyEdited]);

  // Handle slug manual edit
  const handleSlugChange = (value: string) => {
    setSlug(value);
    setSlugManuallyEdited(true);
  };

  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    setCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Validation
  const validateForm = (): boolean => {
    if (!title.trim() || title.length < 3) {
      toast.error("Title must be at least 3 characters long");
      return false;
    }

    if (!content.trim() || content.length < 10) {
      toast.error("Content must be at least 10 characters long");
      return false;
    }

    if (!slug.trim()) {
      toast.error("Slug is required");
      return false;
    }

    if (categoryIds.length === 0) {
      toast.error("Please select at least one category");
      return false;
    }

    return true;
  };

  // Handle save as draft
  const handleSaveDraft = async () => {
    if (!validateForm()) return;

    setActionType("draft");

    const postData = {
      title: title.trim(),
      slug: slug.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || null,
      coverImage,
      published: false,
      categoryIds,
    };

    if (postId) {
      updatePost.mutate({ id: postId, ...postData });
    } else {
      createPost.mutate(postData);
    }
  };

  // Handle publish
  const handlePublish = async () => {
    if (!validateForm()) return;

    setActionType("publish");

    const postData = {
      title: title.trim(),
      slug: slug.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || null,
      coverImage,
      published: true,
      categoryIds,
    };

    if (postId) {
      updatePost.mutate({ id: postId, ...postData });
    } else {
      createPost.mutate(postData);
    }
  };

  const isLoading = createPost.isPending || updatePost.isPending;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        disabled={isLoading}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Main Form */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">
            {postId ? "Edit Post" : "Create New Post"}
          </h2>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your post title..."
              className="text-lg"
              disabled={isLoading}
              required
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug" className="text-base font-semibold">
              Slug <span className="text-red-500">*</span>
              {!slugManuallyEdited && title && (
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  (auto-generated)
                </span>
              )}
            </Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="post-url-slug"
              disabled={isLoading}
              required
            />
            <p className="text-xs text-muted-foreground">
              URL-friendly version of the title. Used in the post URL.
            </p>
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Cover Image</Label>
            <ImageUpload
              value={coverImage}
              onChange={setCoverImage}
              disabled={isLoading}
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt" className="text-base font-semibold">
              Excerpt <span className="text-xs font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A short description of your post (max 200 characters)..."
              className="resize-none"
              rows={3}
              maxLength={200}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              {excerpt.length}/200 characters
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">
              Categories <span className="text-red-500">*</span>
            </Label>
            {categoriesLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading categories...</span>
              </div>
            ) : categories && categories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-muted/50 p-4 sm:grid-cols-3">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={categoryIds.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                      disabled={isLoading}
                    />
                    <Label
                      htmlFor={category.id}
                      className="cursor-pointer text-sm font-normal"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No categories available. Please create categories first.
              </p>
            )}
          </div>

          {/* Content Editor */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">
              Content <span className="text-red-500">*</span>
            </Label>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder="Write your post content in Markdown..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Bar (Sticky Bottom) */}
      <div className="sticky bottom-0 z-50 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-5 py-4 flex justify-end">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isLoading}
            >
              {isLoading && actionType === "draft" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save as Draft
                </>
              )}
            </Button>

            <Button
              onClick={handlePublish}
              disabled={isLoading}
            >
              {isLoading && actionType === "publish" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Publish
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}