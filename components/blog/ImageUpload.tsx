"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  disabled?: boolean;
}

/**
 * ImageUpload Component
 * 
 * Handles image uploads to Supabase Storage for post cover images.
 * Features: file validation, preview, progress indication, and removal.
 */
export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

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
      // Extract filename from URL
      const urlParts = value.split('/');
      const fileName = urlParts[urlParts.length - 1];

      // Delete from Supabase Storage
      const { error } = await supabase.storage
        .from('post-covers')
        .remove([fileName]);

      if (error) {
        console.error("Delete error:", error);
        // Continue anyway - file might already be deleted
      }

      setPreview(null);
      onChange(null);
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
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
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleFileSelect}
        disabled={disabled || uploading}
        className="hidden"
      />

      {preview || value ? (
        // Image Preview
        <div className="relative group aspect-video w-full overflow-hidden rounded-lg border-2 border-border">
          <img
            src={preview || value || ''}
            alt="Cover preview"
            className="h-full w-full object-cover"
          />
          
          {/* Overlay with remove button */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={disabled || uploading}
            >
              <X className="mr-2 h-4 w-4" />
              Remove Image
            </Button>
          </div>

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        // Upload Area
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
      )}
    </div>
  );
}
