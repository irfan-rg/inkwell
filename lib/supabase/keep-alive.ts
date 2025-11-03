/**
 * Keep-Alive Utilities for Supabase
 * Prevents database from sleeping on free tier
 */

import { createClient } from '@/lib/supabase/client';

/**
 * Ping the database to keep it alive
 * Can be called periodically to prevent sleep
 */
export async function pingDatabase() {
  try {
    const supabase = createClient();
    // Simple query to keep connection alive
    const { error } = await supabase.from('posts').select('id').limit(1);
    
    if (error) {
      console.error('Database ping failed:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Database ping error:', error);
    return false;
  }
}

/**
 * Check if database is responsive
 * Useful for showing loading states on cold starts
 */
export async function checkDatabaseStatus() {
  const startTime = Date.now();
  const isAlive = await pingDatabase();
  const responseTime = Date.now() - startTime;
  
  return {
    isAlive,
    responseTime,
    isColdStart: responseTime > 5000, // More than 5 seconds indicates cold start
  };
}
