/**
 * Upload Router
 * 
 * Handles file uploads to Supabase Storage, specifically for blog post cover images.
 * Uses base64 encoded files sent from the client and stores them in Supabase Storage buckets.
 * 
 * @module server/api/routers/upload
 */

import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { router, protectedProcedure } from '../trpc';
import { Buffer } from 'buffer';

// ============================================
// ENVIRONMENT VALIDATION
// ============================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  throw new Error(
    'NEXT_PUBLIC_SUPABASE_URL is not set. Please add it to your .env.local file.'
  );
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    'SUPABASE_SERVICE_ROLE_KEY is not set. Please add it to your .env.local file. ' +
    'This key is required for server-side storage operations.'
  );
}

// Create Supabase client with service role for storage operations
const supabaseAdmin = createSupabaseClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ============================================
// CONSTANTS
// ============================================

const STORAGE_BUCKET = 'post-covers';
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

// ============================================
// INPUT SCHEMAS
// ============================================

/**
 * Schema for uploading an image
 * File is sent as base64 encoded string from the client
 */
const uploadImageSchema = z.object({
  file: z.string().min(1, 'File data is required'),
  fileName: z.string().min(1, 'File name is required'),
  fileType: z.string().min(1, 'File type is required'),
});

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate the size of a base64 encoded string in bytes
 */
function getBase64FileSize(base64String: string): number {
  // Remove data URL prefix if present
  const base64Data = base64String.split(',')[1] || base64String;
  
  // Calculate actual file size from base64
  // Base64 encoding increases size by ~33%, so we calculate original size
  const padding = (base64Data.match(/=/g) || []).length;
  const sizeInBytes = (base64Data.length * 3) / 4 - padding;
  
  return sizeInBytes;
}

/**
 * Validate file type
 */
function isValidFileType(fileType: string): boolean {
  return ALLOWED_FILE_TYPES.includes(fileType.toLowerCase());
}

/**
 * Get file extension from filename
 */
function getFileExtension(fileName: string): string {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Generate a unique file path for storage
 */
function generateFilePath(userId: string, fileName: string): string {
  const timestamp = Date.now();
  const sanitizedName = fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\s+/g, '_');
  
  return `${userId}/${timestamp}-${sanitizedName}`;
}

/**
 * Convert base64 to Buffer
 */
function base64ToBuffer(base64String: string): Buffer {
  // Remove data URL prefix if present
  const base64Data = base64String.split(',')[1] || base64String;
  return Buffer.from(base64Data, 'base64');
}

// ============================================
// UPLOAD ROUTER
// ============================================

export const uploadRouter = router({
  /**
   * Upload post cover image
   * 
   * Protected procedure that uploads an image to Supabase Storage.
   * The image is sent as a base64 encoded string from the client.
   * 
   * @requires Authentication
   * @input uploadImageSchema
   * @returns Object with public URL and storage path
   * 
   * @example
   * ```tsx
   * const upload = trpc.upload.uploadPostCover.useMutation()
   * 
   * // Convert file to base64 first (on client)
   * const base64File = await fileToBase64(file)
   * 
   * const result = await upload.mutateAsync({
   *   file: base64File,
   *   fileName: 'my-image.jpg',
   *   fileType: 'image/jpeg',
   * })
   * 
   * console.log(result.url) // Use this URL in your post
   * ```
   */
  uploadPostCover: protectedProcedure
    .input(uploadImageSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { file, fileName, fileType } = input;

      // Validate file type
      if (!isValidFileType(fileType)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`,
        });
      }

      // Validate file extension
      const extension = getFileExtension(fileName);
      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Invalid file extension. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`,
        });
      }

      // Validate file size
      const fileSize = getBase64FileSize(file);
      if (fileSize > MAX_FILE_SIZE_BYTES) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `File size exceeds ${MAX_FILE_SIZE_MB}MB limit. Current size: ${(fileSize / 1024 / 1024).toFixed(2)}MB`,
        });
      }

      // Generate unique file path
      const filePath = generateFilePath(user.id, fileName);

      // Convert base64 to buffer
      let fileBuffer: Buffer;
      try {
        fileBuffer = base64ToBuffer(file);
      } catch {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid base64 file data',
        });
      }

      // Upload to Supabase Storage
      const { error } = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, fileBuffer, {
          contentType: fileType,
          upsert: false,
        });

      if (error) {
        console.error('Supabase storage upload error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to upload file: ${error.message}`,
        });
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get public URL for uploaded file',
        });
      }

      return {
        url: urlData.publicUrl,
        path: filePath,
        size: fileSize,
      };
    }),

  /**
   * Delete an uploaded image
   * 
   * Protected procedure that deletes an image from Supabase Storage.
   * Only the user who uploaded the file can delete it.
   * 
   * @requires Authentication
   * @input Object with file path
   * @returns Success confirmation
   * 
   * @example
   * ```tsx
   * const deleteImage = trpc.upload.deleteImage.useMutation()
   * 
   * await deleteImage.mutateAsync({
   *   path: 'user-id/123456789-image.jpg'
   * })
   * ```
   */
  deleteImage: protectedProcedure
    .input(
      z.object({
        path: z.string().min(1, 'File path is required'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { path } = input;

      // Verify the file belongs to the user (path starts with user ID)
      if (!path.startsWith(user.id + '/')) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to delete this file',
        });
      }

      // Delete from Supabase Storage
      const { error } = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .remove([path]);

      if (error) {
        console.error('Supabase storage delete error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to delete file: ${error.message}`,
        });
      }

      return {
        success: true,
        message: 'File deleted successfully',
      };
    }),
});
