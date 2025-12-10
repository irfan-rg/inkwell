// server/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

/**
 * Database client setup for Drizzle ORM with PostgreSQL
 * Uses postgres-js for connection management
 */

// Get database URL from environment variables
const DATABASE_URL = process.env.DATABASE_URL;

// Validate that DATABASE_URL is provided
if (!DATABASE_URL) {
  throw new Error(
    'DATABASE_URL environment variable is not set. ' +
    'Please add it to your .env.local file. ' +
    'Format: postgresql://user:password@host:port/database'
  );
}

/**
 * Create PostgreSQL connection
 * Configuration optimized for serverless environments
 */
const client = postgres(DATABASE_URL, {
  // Prepare statements for better performance
  prepare: false,
  
  // Maximum number of connections in the pool
  max: 10,
  
  // Idle timeout in seconds
  idle_timeout: 20,
  
  // Connection timeout in seconds
  connect_timeout: 10,
});

/**
 * Drizzle database instance with schema
 * Use this instance for all database operations
 * 
 * @example
 * import { db } from '@/server/db';
 * const posts = await db.query.posts.findMany();
 */
export const db = drizzle(client, { schema });

/**
 * Export schema for use in queries
 */
export { schema };

/**
 * Type-safe database instance
 */
export type Database = typeof db;
