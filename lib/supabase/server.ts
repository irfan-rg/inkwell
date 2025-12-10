/**
 * Supabase Server Client
 * 
 * This client is designed for use in Server Components, Server Actions,
 * Route Handlers, and Middleware. It properly handles cookies in Next.js 
 * server environments.
 * 
 * @example Server Component
 * ```tsx
 * import { createClient } from '@/lib/supabase/server'
 * 
 * export default async function ServerComponent() {
 *   const supabase = await createClient()
 *   
 *   const { data: posts } = await supabase
 *     .from('posts')
 *     .select('*')
 *     .eq('published', true)
 *   
 *   return <div>...</div>
 * }
 * ```
 * 
 * @example Server Action
 * ```tsx
 * 'use server'
 * 
 * import { createClient } from '@/lib/supabase/server'
 * 
 * export async function signOut() {
 *   const supabase = await createClient()
 *   await supabase.auth.signOut()
 * }
 * ```
 * 
 * @module lib/supabase/server
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types';

/**
 * Environment variables validation
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    'NEXT_PUBLIC_SUPABASE_URL is not set. ' +
    'Please add it to your .env.local file. ' +
    'Get it from: Supabase Dashboard → Settings → API → Project URL'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. ' +
    'Please add it to your .env.local file. ' +
    'Get it from: Supabase Dashboard → Settings → API → Project API keys → anon public'
  );
}

/**
 * Creates a Supabase client for use in Server Components and Server Actions
 * 
 * This function creates a new Supabase client instance configured for server use.
 * It automatically manages authentication state using Next.js cookies.
 * 
 * Features:
 * - Automatic cookie-based session management
 * - Type-safe database operations
 * - Works in Server Components, Server Actions, and Route Handlers
 * - Properly handles Next.js cookie store
 * 
 * @returns A Promise that resolves to a configured Supabase server client instance
 * 
 * @example Server Component
 * ```tsx
 * const supabase = await createClient()
 * 
 * // Query data with RLS policies
 * const { data: posts } = await supabase
 *   .from('posts')
 *   .select('*')
 *   .eq('published', true)
 * 
 * // Get current user
 * const { data: { user } } = await supabase.auth.getUser()
 * ```
 * 
 * @example Server Action
 * ```tsx
 * 'use server'
 * 
 * export async function createPost(formData: FormData) {
 *   const supabase = await createClient()
 *   
 *   const { data, error } = await supabase
 *     .from('posts')
 *     .insert({
 *       title: formData.get('title'),
 *       content: formData.get('content'),
 *     })
 * }
 * ```
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    supabaseUrl!,
    supabaseAnonKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions - this is expected behavior in production.
          }
        },
      },
    }
  );
}

/**
 * Type exports for TypeScript support
 */
export type SupabaseClient = Awaited<ReturnType<typeof createClient>>;
