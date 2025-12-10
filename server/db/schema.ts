// server/db/schema.ts
import { pgTable, text, timestamp, uuid, varchar, boolean, primaryKey, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

// ============================================
// POSTS TABLE
// ============================================
/**
 * Posts table - stores all blog posts with markdown content
 * Supports draft and published states, cover images, and author tracking
 */
export const posts = pgTable('posts', {
  // Primary identifier - auto-generated UUID
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Post title - displayed in listings and detail pages
  title: varchar('title', { length: 255 }).notNull(),
  
  // Main content in markdown format
  content: text('content').notNull(),
  
  // URL-friendly identifier - must be unique for routing
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  
  // Cover image URL from Supabase Storage (nullable)
  coverImage: text('cover_image'),
  
  // Short description for previews and SEO
  excerpt: text('excerpt'),
  
  // Publication status - false for drafts, true for published posts
  published: boolean('published').notNull().default(false),
  
  // Archive status - true for archived posts (removed from main lists but not deleted)
  archived: boolean('archived').notNull().default(false),
  
  // Author reference - links to Supabase auth.users table
  authorId: uuid('author_id').notNull(),
  
  // Cached author information for performance (avoids joins with auth.users)
  // These are denormalized from user_metadata and updated on post creation/update
  authorName: varchar('author_name', { length: 255 }).notNull(),
  authorEmail: varchar('author_email', { length: 255 }).notNull(),
  
  // Timestamps for tracking creation and modifications
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  // Indexes for optimized queries
  slugIdx: index('posts_slug_idx').on(table.slug),
  authorIdx: index('posts_author_idx').on(table.authorId),
  publishedIdx: index('posts_published_idx').on(table.published),
  createdAtIdx: index('posts_created_at_idx').on(table.createdAt),
}));

// ============================================
// CATEGORIES TABLE
// ============================================
/**
 * Categories table - organizes posts into topics
 * Categories can be assigned to multiple posts (many-to-many)
 */
export const categories = pgTable('categories', {
  // Primary identifier - auto-generated UUID
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Category display name
  name: varchar('name', { length: 100 }).notNull().unique(),
  
  // URL-friendly identifier - must be unique for routing
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  
  // Optional description for category pages
  description: text('description'),
  
  // Timestamp for tracking category creation
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  // Index for slug-based queries
  slugIdx: index('categories_slug_idx').on(table.slug),
}));

// ============================================
// POST_CATEGORIES JUNCTION TABLE
// ============================================
/**
 * PostCategories junction table - implements many-to-many relationship
 * between posts and categories. A post can have multiple categories,
 * and a category can be assigned to multiple posts.
 */
export const postCategories = pgTable('post_categories', {
  // Foreign key to posts table
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  
  // Foreign key to categories table
  categoryId: uuid('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
}, (table) => ({
  // Composite primary key prevents duplicate assignments
  pk: primaryKey({ columns: [table.postId, table.categoryId] }),
  
  // Indexes for efficient lookups in both directions
  postIdx: index('post_categories_post_idx').on(table.postId),
  categoryIdx: index('post_categories_category_idx').on(table.categoryId),
}));

// ============================================
// RELATIONS
// ============================================
/**
 * Define relationships between tables for Drizzle's relational queries
 */

// Posts can have many categories through the junction table
export const postsRelations = relations(posts, ({ many }) => ({
  postCategories: many(postCategories),
}));

// Categories can be assigned to many posts through the junction table
export const categoriesRelations = relations(categories, ({ many }) => ({
  postCategories: many(postCategories),
}));

// Junction table relations - connects to both posts and categories
export const postCategoriesRelations = relations(postCategories, ({ one }) => ({
  post: one(posts, {
    fields: [postCategories.postId],
    references: [posts.id],
  }),
  category: one(categories, {
    fields: [postCategories.categoryId],
    references: [categories.id],
  }),
}));

// ============================================
// TYPESCRIPT TYPES
// ============================================
/**
 * TypeScript types for type-safe database operations
 */

// Posts types
export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;

// Categories types
export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

// PostCategories types
export type PostCategory = InferSelectModel<typeof postCategories>;
export type NewPostCategory = InferInsertModel<typeof postCategories>;

// Extended types with relations for complex queries
export type PostWithCategories = Post & {
  postCategories: (PostCategory & {
    category: Category;
  })[];
};

export type CategoryWithPosts = Category & {
  postCategories: (PostCategory & {
    post: Post;
  })[];
};
