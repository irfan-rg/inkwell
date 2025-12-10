/**
 * tRPC Server Configuration
 * 
 * This module sets up tRPC for the Inkwell blogging platform with:
 * - Supabase authentication integration
 * - Database access via Drizzle ORM
 * - Public and protected procedures
 * - Proper error handling and serialization
 * 
 * @module server/api/trpc
 */

import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/drizzle/server/db';
import type { Session, User } from '@supabase/supabase-js';

/**
 * Context type definition
 * 
 * This context is available in all tRPC procedures and contains:
 * - db: Drizzle database instance
 * - session: Current Supabase session (if authenticated)
 * - user: Current authenticated user (if authenticated)
 */
export interface Context {
  db: typeof db;
  session: Session | null;
  user: User | null;
}

/**
 * Creates the tRPC context for each request
 * 
 * This function runs on every tRPC request and provides:
 * - Database access
 * - Current user session
 * - User information
 * 
 * The context is created server-side and uses the Supabase server client
 * to authenticate requests based on cookies.
 * 
 * @param opts - Options from the tRPC fetch adapter (headers, etc.)
 * @returns Context object with db, session, and user
 * 
 * @example
 * ```tsx
 * // In a tRPC procedure:
 * const myProcedure = publicProcedure.query(async ({ ctx }) => {
 *   const { db, user } = ctx
 *   // Use db and user here
 * })
 * ```
 */
export async function createTRPCContext() {
  try {
    // Create Supabase client with request cookies
    const supabase = await createClient();
    
    // Get the authenticated user (more secure than getSession)
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error fetching user in tRPC context:', error.message);
    }
    
    // Get session for additional info if user exists
    let session = null;
    if (user) {
      const { data: { session: userSession } } = await supabase.auth.getSession();
      session = userSession;
    }
    
    // Return context with database and auth info
    return {
      db,
      session: session ?? null,
      user: user ?? null,
    } satisfies Context;
  } catch (error) {
    console.error('Error creating tRPC context:', error);
    
    // Return context with null auth info on error
    return {
      db,
      session: null,
      user: null,
    } satisfies Context;
  }
}

/**
 * Initialize tRPC instance
 * 
 * This creates the base tRPC instance with:
 * - SuperJSON for data serialization (handles Date, Map, Set, BigInt, etc.)
 * - Custom error formatter for better error messages
 * - ZodError formatting for input validation errors
 */
const t = initTRPC.context<Context>().create({
  /**
   * SuperJSON transformer
   * Enables sending complex types like Date, Map, Set, BigInt, etc.
   */
  transformer: superjson,
  
  /**
   * Error formatter
   * Provides detailed error messages in development and safe messages in production
   */
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller factory
 * 
 * This allows you to call tRPC procedures directly on the server
 * without going through HTTP.
 * 
 * @example
 * ```tsx
 * import { createCallerFactory } from '@/server/api/trpc'
 * import { appRouter } from '@/server/api/root'
 * 
 * const createCaller = createCallerFactory(appRouter)
 * const caller = createCaller(await createTRPCContext())
 * const posts = await caller.post.getAll()
 * ```
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * Export the tRPC router and procedure helpers
 */
export const router = t.router;

/**
 * Middleware helper
 */
export const middleware = t.middleware;

/**
 * Public procedure
 * 
 * This procedure can be called by anyone, authenticated or not.
 * Use this for public endpoints like:
 * - Fetching published blog posts
 * - Getting categories
 * - Public user profiles
 * 
 * @example
 * ```tsx
 * export const postRouter = router({
 *   getPublished: publicProcedure
 *     .input(z.object({ limit: z.number().optional() }))
 *     .query(async ({ ctx, input }) => {
 *       const { db } = ctx
 *       return await db.query.posts.findMany({
 *         where: eq(posts.published, true),
 *         limit: input.limit ?? 10,
 *       })
 *     }),
 * })
 * ```
 */
export const publicProcedure = t.procedure;

/**
 * Authentication middleware
 * 
 * This middleware checks if a user is authenticated and throws
 * an UNAUTHORIZED error if not.
 * 
 * It also narrows the TypeScript type to ensure ctx.user is not null
 * in protected procedures.
 */
const enforceUserIsAuthed = middleware(async ({ ctx, next }) => {
  // Check if user is authenticated
  if (!ctx.user || !ctx.session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to perform this action',
    });
  }
  
  // Pass user and session to the next middleware/procedure
  // TypeScript now knows these are not null
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
      session: ctx.session,
    },
  });
});

/**
 * Protected procedure
 * 
 * This procedure requires authentication. It will throw an UNAUTHORIZED
 * error if the user is not logged in.
 * 
 * Use this for authenticated endpoints like:
 * - Creating/updating/deleting posts
 * - User profile management
 * - Any user-specific operations
 * 
 * The ctx.user and ctx.session are guaranteed to be non-null in these procedures.
 * 
 * @example
 * ```tsx
 * export const postRouter = router({
 *   create: protectedProcedure
 *     .input(z.object({
 *       title: z.string(),
 *       content: z.string(),
 *     }))
 *     .mutation(async ({ ctx, input }) => {
 *       const { db, user } = ctx
 *       // user is guaranteed to be non-null here
 *       return await db.insert(posts).values({
 *         ...input,
 *         author_id: user.id,
 *       })
 *     }),
 * })
 * ```
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

/**
 * Export the tRPC instance for advanced use cases
 */
export { t };
