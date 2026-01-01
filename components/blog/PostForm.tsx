"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/blog/ImageUpload";
import { MarkdownEditor } from "@/components/blog/MarkdownEditor";
import { generateSlug } from "@/lib/utils";
import { toast } from "sonner";
import { ArrowLeftIcon, ArrowPathIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { MarkdownGuide } from "@/components/blog/MarkdownGuide";

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

export function PostForm({ postId, initialData }: PostFormProps) {
  const router = useRouter();

  const [hideMobileActionBar, setHideMobileActionBar] = useState(false);
  const lastScrollYRef = useRef(0);
  const hideRef = useRef(false);
  
  // Form state
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [coverImage, setCoverImage] = useState<string | null>(initialData?.coverImage || null);
  const [categoryIds, setCategoryIds] = useState<string[]>(initialData?.categoryIds || []);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [actionType, setActionType] = useState<"draft" | "publish" | null>(null);
  const [isMetaOpen, setIsMetaOpen] = useState(false);

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = api.category.list.useQuery();

  const utils = api.useUtils();

  // Create mutation
  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      toast.success("Entry created");
      utils.post.getUserPosts.invalidate();
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
      toast.success("Entry updated");
      utils.post.getUserPosts.invalidate();
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update post");
      setActionType(null);
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.currentTarget.value;
    setTitle(newTitle);
    
    if (!slugManuallyEdited) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSlugChange = (value: string) => {
    setSlug(value);
    setSlugManuallyEdited(true);
  };

  const toggleCategory = (categoryId: string) => {
    setCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const validateForm = (): boolean => {
    if (!title.trim() || title.length < 3) {
      toast.error("Title must be at least 3 characters");
      return false;
    }
    if (!content.trim() || content.length < 10) {
      toast.error("Content is too short");
      return false;
    }
    if (!slug.trim()) {
      toast.error("Slug is required");
      return false;
    }
    if (categoryIds.length === 0) {
      toast.error("Select at least one category");
      return false;
    }
    return true;
  };

  const handleSubmit = async (publish: boolean) => {
    if (!validateForm()) return;

    setActionType(publish ? "publish" : "draft");

    const postData = {
      title: title.trim(),
      slug: slug.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || null,
      coverImage,
      published: publish,
      categoryIds,
    };

    if (postId) {
      updatePost.mutate({ id: postId, ...postData });
    } else {
      createPost.mutate(postData);
    }
  };

  const isLoading = createPost.isPending || updatePost.isPending;

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    let raf = 0;

    const compute = () => {
      const isMobile = window.innerWidth < 640;
      const y = window.scrollY;

      if (!isMobile) {
        if (hideRef.current) {
          hideRef.current = false;
          setHideMobileActionBar(false);
        }
        lastScrollYRef.current = y;
        return;
      }

      const delta = y - lastScrollYRef.current;
      const threshold = 80;
      const dirThreshold = 12;

      let nextHide = hideRef.current;
      if (y <= threshold) nextHide = false;
      else if (delta > dirThreshold) nextHide = true;
      else if (delta < -dirThreshold) nextHide = false;

      if (nextHide !== hideRef.current) {
        hideRef.current = nextHide;
        setHideMobileActionBar(nextHide);
      }

      lastScrollYRef.current = y;
    };

    const onScrollOrResize = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        compute();
      });
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    compute();

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto pb-32">
      {/* Mobile-only Back button (non-sticky) */}
      <div className="sm:hidden pt-0">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          disabled={isLoading}
          className="rounded-none hover:bg-transparent hover:text-foreground/60 pl-0 text-muted-foreground font-mono text-xs uppercase tracking-widest"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Studio
        </Button>
      </div>

      {/* Top Bar */}
      <div
        className={
          "flex flex-col gap-4 sm:gap-0 items-start sm:flex-row sm:items-center sm:justify-between py-3 mb-8 border-b border-border sticky top-16 z-40 transition-transform duration-200 will-change-transform " +
          (hideMobileActionBar ? "-translate-y-full pointer-events-none sm:translate-y-0 sm:pointer-events-auto" : "translate-y-0")
        }
        style={{ backgroundColor: 'hsl(var(--background))' }}
      >
        <Button
          variant="ghost"
          onClick={() => router.back()}
          disabled={isLoading}
          className="hidden sm:inline-flex self-start rounded-none hover:bg-transparent hover:text-foreground pl-0 text-muted-foreground font-mono text-xs uppercase tracking-widest cursor-pointer"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Studio
        </Button>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto">
          <div className="self-start sm:self-auto">
            <MarkdownGuide />
          </div>
          <div className="hidden sm:block w-px h-4 bg-border mx-2" />

          {/* Mobile: 2-button row; Desktop: original inline layout */}
          <div className="grid grid-cols-2 gap-3 w-full sm:w-auto sm:flex sm:items-center sm:gap-4">
            <Button
              variant="ghost"
              onClick={() => handleSubmit(false)}
              disabled={isLoading}
              className="w-full sm:w-auto rounded-none font-bold uppercase tracking-widest text-xs hover:bg-muted px-3 sm:px-5"
            >
              {isLoading && actionType === "draft" ? "Saving..." : "Save Draft"}
            </Button>
            <Button
              onClick={() => handleSubmit(true)}
              disabled={isLoading}
              className="w-full sm:w-auto rounded-none bg-foreground text-background hover:bg-foreground/90 hover:text-background font-bold uppercase tracking-widest text-xs px-3 sm:px-6"
            >
              {isLoading && actionType === "publish" ? (
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
              ) : (
                "Publish"
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {/* Title Input - Massive & Clean */}
        <div>
          <Input
            id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled..."
            className="text-5xl md:text-7xl font-syne font-black tracking-tighter border-none px-0 h-auto placeholder:text-muted-foreground/20 focus-visible:ring-0 bg-transparent"
            style={{ fontFamily: 'var(--font-syne)' }}
            disabled={isLoading}
            autoFocus
          />
        </div>

        {/* Collapsible Metadata Section */}
        <Collapsible open={isMetaOpen} onOpenChange={setIsMetaOpen} className="border-y border-border">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full flex justify-between items-center py-4 px-0 hover:bg-transparent rounded-none group">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground">
                Metadata & Settings
              </span>
              <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${isMetaOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pb-8 space-y-8 animate-slide-down">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
              {/* Left Column */}
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">URL Slug</label>
                  <Input
                    value={slug}
                    onChange={(e) => handleSlugChange(e.currentTarget.value)}
                    className="font-mono text-sm border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent"
                    placeholder="post-url-slug"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Excerpt</label>
                  <Textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.currentTarget.value)}
                    placeholder="Brief description..."
                    className="resize-none border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent min-h-[100px]"
                    maxLength={200}
                  />
                  <div className="text-right text-[10px] text-muted-foreground">{excerpt.length}/200</div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Categories</label>
                  {categoriesLoading ? (
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {categories?.map((cat) => (
                        <div key={cat.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={cat.id}
                            checked={categoryIds.includes(cat.id)}
                            onCheckedChange={() => toggleCategory(cat.id)}
                            className="rounded-none border-muted-foreground data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                          />
                          <label
                            htmlFor={cat.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {cat.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cover Image</label>
                  <ImageUpload
                    value={coverImage}
                    onChange={setCoverImage}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Editor Area */}
        <div className="pt-4">
          <MarkdownEditor
            value={content}
            onChange={setContent}
            placeholder="Type your story here..."
          />
        </div>
      </div>
    </div>
  );
}