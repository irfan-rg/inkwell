/**
 * tRPC Client Setup
 * 
 * This file configures the tRPC client for use in React components.
 * It provides type-safe API calls with React hooks and automatic caching
 * via React Query.
 * 
 * @module lib/trpc
 */

'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import superjson from 'superjson';
import type { AppRouter } from '@/server/api/root';

/**
 * tRPC React hooks
 * 
 * This provides type-safe hooks for all tRPC procedures.
 * Use this in your React components to make API calls.
 * 
 * @example Query
 * ```tsx
 * function PostList() {
 *   const { data, isLoading } = api.post.list.useQuery({ limit: 10 })
 *   return <div>{data?.map(post => <div key={post.id}>{post.title}</div>)}</div>
 * }
 * ```
 * 
 * @example Mutation
 * ```tsx
 * function CreatePost() {
 *   const createPost = api.post.create.useMutation()
 *   const handleCreate = () => {
 *     createPost.mutate({ title: 'New Post', content: 'Content' })
 *   }
 *   return <button onClick={handleCreate}>Create</button>
 * }
 * ```
 */
export const api = createTRPCReact<AppRouter>();

/**
 * Get the base URL for tRPC API calls
 * 
 * @returns The full URL to the tRPC endpoint
 */
function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Browser should use relative path
    return '';
  }

  if (process.env.VERCEL_URL) {
    // Reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    // Use custom app URL if provided
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // Assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

/**
 * tRPC Provider Component
 * 
 * Wraps your app with the necessary providers for tRPC and React Query.
 * This should be placed high in your component tree, typically in the root layout.
 * 
 * Features:
 * - Automatic request batching
 * - Request deduplication
 * - Automatic retries
 * - Cache management
 * - Type-safe API calls
 * 
 * @param props - Component props
 * @param props.children - Child components to wrap
 * @returns Provider component
 * 
 * @example
 * ```tsx
 * // app/layout.tsx
 * import { TRPCProvider } from '@/lib/trpc'
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <TRPCProvider>
 *           {children}
 *         </TRPCProvider>
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
export function TRPCProvider(props: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            /**
             * Data is considered fresh for 5 seconds
             * After this, it will refetch in the background
             */
            staleTime: 5 * 1000,

            /**
             * Unused data stays in cache for 10 minutes
             * After this, it's garbage collected
             */
            gcTime: 10 * 60 * 1000,

            /**
             * Retry failed requests up to 3 times
             */
            retry: 3,

            /**
             * Refetch on window focus
             * Keeps data fresh when user returns to tab
             */
            refetchOnWindowFocus: true,

            /**
             * Don't refetch on reconnect by default
             * Can be overridden per-query
             */
            refetchOnReconnect: false,
          },
          mutations: {
            /**
             * Retry failed mutations once
             */
            retry: 1,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    api.createClient({
      /**
       * Links configuration
       */
      links: [
        /**
         * HTTP Batch Link
         * 
         * Batches multiple requests into a single HTTP call
         * Reduces network overhead and improves performance
         */
        httpBatchLink({
          /**
           * The full URL to the tRPC endpoint
           */
          url: `${getBaseUrl()}/api/trpc`,

          /**
           * SuperJSON transformer
           * Enables sending/receiving complex types like Date, Map, Set, BigInt, etc.
           */
          transformer: superjson,

          /**
           * Include credentials (cookies) in requests
           * Required for authentication to work
           */
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: 'include',
            });
          },

          /**
           * Custom headers for each request
           */
          headers() {
            return {
              /**
               * Include current page URL for debugging
               */
              'x-trpc-source': typeof window !== 'undefined' 
                ? window.location.pathname 
                : 'ssr',
            };
          },

          /**
           * Maximum URLs in a batch
           * Default is 10, which is usually sufficient
           */
          maxURLLength: 2048,
        }),
      ],
    })
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </api.Provider>
  );
}

/**
 * Type-safe tRPC client for use outside of React components
 * 
 * Note: For server components, use the server-side caller instead.
 * This is primarily for client-side usage in utility functions.
 * 
 * @example
 * ```tsx
 * import { api } from '@/lib/trpc'
 * 
 * // In a client-side utility function
 * export async function fetchPosts() {
 *   const posts = await api.post.list.query({ limit: 10 })
 *   return posts
 * }
 * ```
 */
export type TRPCClient = ReturnType<typeof api.createClient>;
