/**
 * Supabase Browser Client
 * 
 * This client is designed for use in Client Components and browser environments.
 * It automatically handles cookie-based authentication and session management.
 * 
 * @example
 * ```tsx
 * 'use client'
 * 
 * import { createClient } from '@/lib/supabase/client'
 * 
 * export default function MyComponent() {
 *   const supabase = createClient()
 *   
 *   async function handleSignIn(email: string, password: string) {
 *     const { data, error } = await supabase.auth.signInWithPassword({
 *       email,
 *       password,
 *     })
 *   }
 *   
 *   return <div>...</div>
 * }
 * ```
 * 
 * @module lib/supabase/client
 */

type CookieOptions = {
  expires?: Date | number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
};

import { createBrowserClient } from '@supabase/ssr';
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
 * Creates a Supabase client for use in Client Components
 * 
 * This function creates a new Supabase client instance configured for browser use.
 * The client automatically manages authentication state and cookies.
 * 
 * Features:
 * - Automatic cookie-based session management
 * - Type-safe database operations
 * - Real-time subscriptions support
 * - Authentication methods (sign in, sign up, sign out)
 * - Storage operations (upload/download files)
 * 
 * @returns A configured Supabase browser client instance
 * 
 * @example
 * ```tsx
 * const supabase = createClient()
 * 
 * // Query data
 * const { data: posts } = await supabase
 *   .from('posts')
 *   .select('*')
 *   .eq('published', true)
 * 
 * // Sign in
 * const { data, error } = await supabase.auth.signInWithPassword({
 *   email: 'user@example.com',
 *   password: 'password',
 * })
 * 
 * // Upload file
 * const { data, error } = await supabase.storage
 *   .from('avatars')
 *   .upload('public/avatar.png', file)
 * ```
 */
export function createClient() {
  return createBrowserClient<Database>(
    supabaseUrl!,
    supabaseAnonKey!,
    {
      cookies: {
        get(name: string) {
          // Check if we're in a browser environment
          if (typeof document === 'undefined') {
            return undefined;
          }
          // Get cookie value from document.cookie
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) {
            return parts.pop()?.split(';').shift();
          }
        },
        set(name: string, value: string, options: CookieOptions) {
          // Check if we're in a browser environment
          if (typeof document === 'undefined') {
            return;
          }
          // Set cookie in the browser
          let cookie = `${name}=${value}`;
          
          if (options?.maxAge) {
            cookie += `; max-age=${options.maxAge}`;
          }
          if (options?.path) {
            cookie += `; path=${options.path}`;
          }
          if (options?.domain) {
            cookie += `; domain=${options.domain}`;
          }
          if (options?.sameSite) {
            cookie += `; samesite=${options.sameSite}`;
          }
          if (options?.secure) {
            cookie += '; secure';
          }
          
          if (typeof document !== 'undefined') {
            document.cookie = cookie;
          }
        },
        remove(name: string, options: CookieOptions) {
          // Check if we're in a browser environment
          if (typeof document === 'undefined') {
            return;
          }
          // Remove cookie by setting expiry to past date
          let cookie = `${name}=; max-age=0`;
          
          if (options?.path) {
            cookie += `; path=${options.path}`;
          }
          if (options?.domain) {
            cookie += `; domain=${options.domain}`;
          }
          
          document.cookie = cookie;
        },
      },
    }
  );
}

/**
 * Type exports for TypeScript support
 */
export type SupabaseClient = ReturnType<typeof createClient>;
