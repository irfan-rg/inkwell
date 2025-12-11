/**
 * tRPC API Route Handler
 * 
 * This file sets up the tRPC API endpoints for the Next.js 15 App Router.
 * It handles all tRPC procedure calls through the /api/trpc/* endpoints.
 * 
 * @module app/api/trpc/[trpc]/route
 */

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { type NextRequest } from 'next/server';
import { appRouter } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';

/**
 * Main request handler for tRPC procedures
 * 
 * This function handles all HTTP requests to the tRPC API endpoints.
 * It uses the fetch adapter which is optimized for serverless environments
 * and works seamlessly with Next.js App Router.
 * 
 * Features:
 * - Automatic request batching
 * - Context creation for each request
 * - Error handling and formatting
 * - Type-safe API calls
 * 
 * @param req - Next.js request object
 * @returns Response from tRPC handler
 */
async function handler(req: NextRequest) {
  try {
    return fetchRequestHandler({
      /**
       * The endpoint path for tRPC API calls
       * This should match the directory structure: app/api/trpc
       */
      endpoint: '/api/trpc',

      /**
       * The incoming HTTP request
       */
      req,

      /**
       * The main tRPC router containing all procedures
       */
      router: appRouter,

      /**
       * Function to create context for each request
       * This is called for every tRPC procedure and provides:
       * - Database connection
       * - User session
       * - Authentication state
       */
      createContext: createTRPCContext,

      /**
       * Error handler for debugging
       * In development, this provides detailed error information
       * In production, it logs errors while keeping responses safe
       */
      onError:
        process.env.NODE_ENV === 'development'
          ? ({ path, error }) => {
              console.error(
                `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
              );
            }
          : undefined,
    });
  } catch (error) {
    console.error('Unhandled error in tRPC handler:', error);
    
    // Return a generic error response
    return new Response(
      JSON.stringify({
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_SERVER_ERROR',
        },
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

/**
 * Export GET handler
 * 
 * Handles GET requests to tRPC endpoints.
 * Used primarily for queries and can be cached.
 * 
 * @example
 * GET /api/trpc/post.list?input={"limit":10}
 */
export { handler as GET };

/**
 * Export POST handler
 * 
 * Handles POST requests to tRPC endpoints.
 * Used for mutations and batch requests.
 * 
 * @example
 * POST /api/trpc/post.create
 * Body: { "title": "My Post", "content": "..." }
 */
export { handler as POST };
