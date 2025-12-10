"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { X, Image as ImageIcon, Loader2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  disabled?: boolean;
}

/**
 * ImageUpload Component
 * 
 * Handles image uploads in two ways:
 * 1. File upload to Supabase Storage
 * 2. Direct URL input for external images
 * Features: file validation, URL validation, preview, progress indication, and removal.
 */
export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value);
  const [urlInput, setUrlInput] = useState<string>("");
  const [isValidatingUrl, setIsValidatingUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  // Validate URL by checking extension only
  const validateImageUrl = (url: string): boolean => {
    try {
      new URL(url);
    } catch {
      return false;
    }
    // Accept if ends with image extension
    return /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
  };

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) {
      toast.error("Please enter an image URL");
      return;
    }

    try {
      setIsValidatingUrl(true);
      const isValid = validateImageUrl(urlInput);
      if (!isValid) {
        toast.error("Invalid image URL. Must end with .jpg, .jpeg, .png, .webp, or .gif");
        return;
      }
      setPreview(urlInput);
      onChange(urlInput);
      setUrlInput("");
      toast.success("Image URL added successfully!");
    } catch (error) {
      console.error("URL validation error:", error);
      toast.error("Failed to validate image URL");
    } finally {
      setIsValidatingUrl(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Please upload a JPEG, PNG, or WebP image.");
      return;
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      toast.error("File too large. Maximum size is 5MB.");
      return;
    }

    try {
      setUploading(true);

      // Generate unique filename
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('post-covers')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('post-covers')
        .getPublicUrl(data.path);

      setPreview(publicUrl);
      onChange(publicUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    if (!value) return;

    try {
      // Only try to delete from storage if it's an uploaded file (contains 'post-covers')
      if (value.includes('post-covers')) {
        const urlParts = value.split('/');
        const fileName = urlParts[urlParts.length - 1];

        const { error } = await supabase.storage
          .from('post-covers')
          .remove([fileName]);

        if (error) {
          console.error("Delete error:", error);
        }
      }

      setPreview(null);
      onChange(null);
      setUrlInput("");
      toast.success("Image removed");
    } catch (error) {
      console.error("Remove error:", error);
      toast.error("Failed to remove image");
    }
  };

  const handleClick = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled || uploading) return;

    const file = e.dataTransfer.files[0];
    if (!file) return;

    // Validate file type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Please upload a JPEG, PNG, or WebP image.");
      return;
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      toast.error("File too large. Maximum size is 5MB.");
      return;
    }

    try {
      setUploading(true);

      // Generate unique filename
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('post-covers')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('post-covers')
        .getPublicUrl(data.path);

      setPreview(publicUrl);
      onChange(publicUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {preview || value ? (
        // Image Preview
        <div className="relative group aspect-video w-full overflow-hidden rounded-lg border-2 border-border">
          <Image
            src={preview || value || ''}
            alt="Cover preview"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          
          {/* Overlay with remove button */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={disabled || uploading || isValidatingUrl}
            >
              <X className="mr-2 h-4 w-4" />
              Remove Image
            </Button>
          </div>

          {(uploading || isValidatingUrl) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        // Upload/URL Options
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="upload"
                className="flex items-center gap-2 data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:bg-foreground dark:data-[state=active]:text-background"
              >
                <ImageIcon className="h-4 w-4" />
                Upload
              </TabsTrigger>
              <TabsTrigger
                value="url"
                className="flex items-center gap-2 data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:bg-foreground dark:data-[state=active]:text-background"
              >
                <LinkIcon className="h-4 w-4" />
                URL
              </TabsTrigger>
            </TabsList>

          <TabsContent value="upload" className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES.join(',')}
              onChange={handleFileSelect}
              disabled={disabled || uploading}
              className="hidden"
            />

            <div
              onClick={handleClick}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`
                flex aspect-video w-full cursor-pointer flex-col items-center justify-center
                rounded-lg border-2 border-dashed border-muted-foreground/25
                bg-muted/50 transition-colors hover:border-muted-foreground/50 hover:bg-muted
                ${disabled || uploading ? 'cursor-not-allowed opacity-50' : ''}
              `}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Uploading...</p>
                </>
              ) : (
                <>
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    JPEG, PNG, or WebP (max 5MB)
                  </p>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-3">
            <div className="rounded-lg border border-border p-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                Paste the direct URL of an image from Unsplash, Pexels, or any public image source
              </p>
              <div className="flex gap-2">
                <div className="flex-1 rounded-md border border-input bg-background">
                  <Input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    disabled={disabled || isValidatingUrl}
                    onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                    className="border-none bg-transparent px-3 py-2"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleUrlSubmit}
                  disabled={disabled || isValidatingUrl || !urlInput.trim()}
                >
                  {isValidatingUrl ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    'Add'
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Tip: Try Unsplash (unsplash.com) or Pexels (pexels.com) for free images
              </p>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}