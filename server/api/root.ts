/**
 * tRPC Root Router
 * 
 * This is the main router that combines all sub-routers for the application.
 * It exports the complete API surface and type definitions for client-side usage.
 * 
 * @module server/api/root
 */

import { router } from './trpc';
import { postRouter } from './routers/post';
import { categoryRouter } from './routers/category';
import { uploadRouter } from './routers/upload';

/**
 * Application Router
 * 
 * This is the primary router for the tRPC API. It combines all feature-specific
 * routers into a single unified API.
 * 
 * Each sub-router handles a specific domain:
 * - post: Blog post operations (create, read, update, delete)
 * - category: Category management
 * - upload: File upload operations (images, etc.)
 * 
 * @example
 * ```tsx
 * // Client-side usage
 * const posts = trpc.post.getAll.useQuery()
 * const categories = trpc.category.getAll.useQuery()
 * ```
 * 
 * @example
 * ```tsx
 * // Server-side usage
 * const caller = await createCaller()
 * const posts = await caller.post.getAll()
 * ```
 */
export const appRouter = router({
  post: postRouter,
  category: categoryRouter,
  upload: uploadRouter,
});

/**
 * Type definition for the app router
 * 
 * This type is used on the client-side to provide end-to-end type safety.
 * Import this type in your client code to get full TypeScript autocomplete
 * and type checking for all tRPC procedures.
 * 
 * @example
 * ```tsx
 * // lib/trpc/client.ts
 * import { createTRPCReact } from '@trpc/react-query'
 * import type { AppRouter } from '@/server/api/root'
 * 
 * export const trpc = createTRPCReact<AppRouter>()
 * ```
 */
export type AppRouter = typeof appRouter;
