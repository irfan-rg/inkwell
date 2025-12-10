/**
 * Authentication Helper Functions
 * 
 * This module provides server-side authentication utilities for protecting
 * routes, managing user sessions, and handling authentication state.
 * 
 * All functions in this module use the Supabase server client and should
 * only be called from Server Components, Server Actions, or Route Handlers.
 * 
 * @module lib/auth
 */

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { User, Session } from '@supabase/supabase-js';

/**
 * Gets the currently authenticated user from the server
 * 
 * This function retrieves the authenticated user from the current session
 * using the Supabase server client. It's safe to call from Server Components.
 * 
 * @returns A Promise that resolves to the authenticated User object, or null if not authenticated
 * 
 * @example
 * ```tsx
 * import { getUser } from '@/lib/auth'
 * 
 * export default async function ProfilePage() {
 *   const user = await getUser()
 *   
 *   if (!user) {
 *     return <div>Not authenticated</div>
 *   }
 *   
 *   return <div>Welcome, {user.email}!</div>
 * }
 * ```
 */
export async function getUser(): Promise<User | null> {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error fetching user:', error.message);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Unexpected error in getUser:', error);
    return null;
  }
}

/**
 * Gets the current session from the server
 * 
 * This function retrieves the full session object including user data
 * and access tokens. Use this when you need session details beyond
 * just the user information.
 * 
 * @returns A Promise that resolves to the Session object, or null if no active session
 * 
 * @example
 * ```tsx
 * import { getSession } from '@/lib/auth'
 * 
 * export default async function DashboardPage() {
 *   const session = await getSession()
 *   
 *   if (!session) {
 *     return <div>No active session</div>
 *   }
 *   
 *   return (
 *     <div>
 *       <p>User: {session.user.email}</p>
 *       <p>Expires: {new Date(session.expires_at! * 1000).toLocaleString()}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export async function getSession(): Promise<Session | null> {
  try {
    const supabase = await createClient();
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error fetching session:', error.message);
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Unexpected error in getSession:', error);
    return null;
  }
}

/**
 * Signs out the current user and redirects to login page
 * 
 * This function should be called from a Server Action. It signs out
 * the user, clears the session, and redirects to the login page.
 * 
 * Note: This function uses redirect() which throws an error to interrupt
 * execution, so no return statement is needed after calling it.
 * 
 * @param redirectTo - Optional path to redirect to after sign out (defaults to '/auth/login')
 * 
 * @example Server Action
 * ```tsx
 * 'use server'
 * 
 * import { signOut } from '@/lib/auth'
 * 
 * export async function handleSignOut() {
 *   await signOut()
 *   // Code after this won't execute due to redirect
 * }
 * ```
 * 
 * @example With Custom Redirect
 * ```tsx
 * 'use server'
 * 
 * import { signOut } from '@/lib/auth'
 * 
 * export async function handleSignOut() {
 *   await signOut('/') // Redirect to home page
 * }
 * ```
 */
export async function signOut(redirectTo: string = '/auth/login'): Promise<void> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error.message);
    }
  } catch (error) {
    console.error('Unexpected error in signOut:', error);
  }
  
  // Redirect even if sign out failed to clear client state
  redirect(redirectTo);
}

/**
 * Middleware function to require authentication on protected routes
 * 
 * This function checks if a user is authenticated and redirects to the
 * login page if not. Use this at the top of protected pages or layouts.
 * 
 * If authenticated, returns the user object for further use.
 * If not authenticated, redirects to login (never returns).
 * 
 * @param redirectTo - Optional path to redirect to if not authenticated (defaults to '/auth/login')
 * @returns A Promise that resolves to the authenticated User object
 * 
 * @throws Redirects to login page if user is not authenticated
 * 
 * @example Protected Server Component
 * ```tsx
 * import { requireAuth } from '@/lib/auth'
 * 
 * export default async function DashboardPage() {
 *   const user = await requireAuth()
 *   
 *   // This code only runs if user is authenticated
 *   return (
 *     <div>
 *       <h1>Dashboard</h1>
 *       <p>Welcome, {user.email}!</p>
 *     </div>
 *   )
 * }
 * ```
 * 
 * @example With Custom Redirect
 * ```tsx
 * import { requireAuth } from '@/lib/auth'
 * 
 * export default async function AdminPage() {
 *   const user = await requireAuth('/login?returnUrl=/admin')
 *   
 *   return <div>Admin content</div>
 * }
 * ```
 */
export async function requireAuth(redirectTo: string = '/auth/login'): Promise<User> {
  const user = await getUser();
  
  if (!user) {
    redirect(redirectTo);
  }
  
  return user;
}

/**
 * Checks if a user is authenticated without redirecting
 * 
 * This is a convenience function that returns a boolean indicating
 * whether a user is currently authenticated. Useful for conditional
 * rendering or logic that doesn't require a redirect.
 * 
 * @returns A Promise that resolves to true if authenticated, false otherwise
 * 
 * @example
 * ```tsx
 * import { isAuthenticated } from '@/lib/auth'
 * 
 * export default async function HomePage() {
 *   const authenticated = await isAuthenticated()
 *   
 *   return (
 *     <div>
 *       {authenticated ? (
 *         <a href="/dashboard">Go to Dashboard</a>
 *       ) : (
 *         <a href="/auth/login">Sign In</a>
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser();
  return user !== null;
}

/**
 * Gets user ID if authenticated, or null
 * 
 * Convenience function to quickly get just the user ID without
 * fetching the entire user object.
 * 
 * @returns A Promise that resolves to the user ID string, or null if not authenticated
 * 
 * @example
 * ```tsx
 * import { getUserId } from '@/lib/auth'
 * 
 * export default async function MyPostsPage() {
 *   const userId = await getUserId()
 *   
 *   if (!userId) {
 *     return <div>Please sign in</div>
 *   }
 *   
 *   // Fetch posts for this user
 *   const posts = await fetchPostsByAuthor(userId)
 *   
 *   return <div>render posts</div>
 * }
 * ```
 */
export async function getUserId(): Promise<string | null> {
  const user = await getUser();
  return user?.id ?? null;
}

/**
 * Type exports for convenience
 */
export type { User, Session } from '@supabase/supabase-js';