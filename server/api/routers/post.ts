/**
 * Post Router
 * 
 * Handles all blog post operations including CRUD operations,
 * filtering, and category management.
 * 
 * @module server/api/routers/post
 */

import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { eq, and, desc, or, ilike, sql, inArray } from 'drizzle-orm';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { posts, postCategories } from '@/server/db/schema';
import { generateSlug } from '@/lib/utils';

// ============================================
// INPUT SCHEMAS
// ============================================

/**
 * Schema for creating a new post
 */
const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
  coverImage: z.string().optional().nullable(),
  excerpt: z.string().max(500, 'Excerpt is too long').optional().nullable(),
  published: z.boolean().default(false),
  categoryIds: z.array(z.string().uuid('Invalid category ID')).optional(),
});

/**
 * Schema for updating an existing post
 */
const updatePostSchema = z.object({
  id: z.string().uuid('Invalid post ID'),
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
  slug: z.string().min(1).max(255).optional(),
  coverImage: z.string().optional().nullable(),
  excerpt: z.string().max(500).optional().nullable(),
  published: z.boolean().optional(),
  archived: z.boolean().optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
});

/**
 * Schema for deleting a post
 */
const deletePostSchema = z.object({
  id: z.string().uuid('Invalid post ID'),
});

/**
 * Schema for getting a post by slug
 */
const getBySlugSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
});

/**
 * Schema for listing posts with filters
 */
const listPostsSchema = z.object({
  published: z.boolean().optional(),
  categoryId: z.string().uuid().optional(),
  authorId: z.string().uuid().optional(),
  search: z.string().optional(),
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
});

// ============================================
// POST ROUTER
// ============================================

export const postRouter = router({
  /**
   * Create a new post
   * 
   * Protected procedure that creates a new blog post with optional categories.
   * Automatically generates a slug from the title and sets the author to the
   * current authenticated user.
   * 
   * @requires Authentication
   * @input createPostSchema
   * @returns Created post with ID
   * 
   * @example
   * ```tsx
   * const createPost = trpc.post.create.useMutation()
   * 
   * await createPost.mutateAsync({
   *   title: 'My First Post',
   *   content: '# Hello World',
   *   published: true,
   *   categoryIds: ['uuid-1', 'uuid-2'],
   * })
   * ```
   */
  create: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { categoryIds, ...postData } = input;

      // Generate slug from title
      const slug = generateSlug(input.title);

      // Check if slug already exists
      const existingPost = await db.query.posts.findFirst({
        where: eq(posts.slug, slug),
      });

      if (existingPost) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A post with this title already exists. Please use a different title.',
        });
      }

      // Extract author information from user metadata
      // Falls back to email username if name is not set
      const authorName = user.user_metadata?.name || user.email?.split('@')[0] || 'Anonymous';
      const authorEmail = user.email || '';

      // Insert the post with cached author information
      const [newPost] = await db
        .insert(posts)
        .values({
          ...postData,
          slug,
          authorId: user.id,
          authorName,
          authorEmail,
        })
        .returning();

      // Add categories if provided
      if (categoryIds && categoryIds.length > 0) {
        await db.insert(postCategories).values(
          categoryIds.map((categoryId) => ({
            postId: newPost.id,
            categoryId: categoryId,
          }))
        );
      }

      return newPost;
    }),

  /**
   * Update an existing post
   * 
   * Protected procedure that updates a post owned by the current user.
   * Can update post content, metadata, and categories.
   * 
   * @requires Authentication
   * @requires Post ownership
   * @input updatePostSchema
   * @returns Updated post
   * 
   * @example
   * ```tsx
   * const updatePost = trpc.post.update.useMutation()
   * 
   * await updatePost.mutateAsync({
   *   id: 'post-uuid',
   *   title: 'Updated Title',
   *   published: true,
   *   categoryIds: ['uuid-3'],
   * })
   * ```
   */
  update: protectedProcedure
    .input(updatePostSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { id, categoryIds, ...updateData } = input;

      // Check if post exists and belongs to user
      const existingPost = await db.query.posts.findFirst({
        where: eq(posts.id, id),
      });

      if (!existingPost) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      if (existingPost.authorId !== user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to update this post',
        });
      }

      // If title is being updated, regenerate slug
      if (input.title && input.title !== existingPost.title) {
        const newSlug = generateSlug(input.title);
        
        // Check if new slug conflicts with another post
        const slugConflict = await db.query.posts.findFirst({
          where: and(
            eq(posts.slug, newSlug),
            // Exclude current post from check
            eq(posts.id, id)
          ),
        });

        if (slugConflict && slugConflict.id !== id) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'A post with this title already exists',
          });
        }

        updateData.slug = newSlug;
      }

      // Update the post
      // Note: Author information is cached and doesn't change on update
      // If user profile changes, posts will keep their original author info
      const [updatedPost] = await db
        .update(posts)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, id))
        .returning();

      // Update categories if provided
      if (categoryIds !== undefined) {
        // Delete existing categories
        await db.delete(postCategories).where(eq(postCategories.postId, id));

        // Insert new categories
        if (categoryIds.length > 0) {
          await db.insert(postCategories).values(
            categoryIds.map((categoryId) => ({
              postId: id,
              categoryId: categoryId,
            }))
          );
        }
      }

      return updatedPost;
    }),

  /**
   * Delete a post
   * 
   * Protected procedure that deletes a post owned by the current user.
   * Cascade delete will automatically remove associated category relationships.
   * 
   * @requires Authentication
   * @requires Post ownership
   * @input deletePostSchema
   * @returns Success confirmation
   * 
   * @example
   * ```tsx
   * const deletePost = trpc.post.delete.useMutation()
   * 
   * await deletePost.mutateAsync({ id: 'post-uuid' })
   * ```
   */
  delete: protectedProcedure
    .input(deletePostSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;

      // Check if post exists and belongs to user
      const existingPost = await db.query.posts.findFirst({
        where: eq(posts.id, input.id),
      });

      if (!existingPost) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      if (existingPost.authorId !== user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to delete this post',
        });
      }

      // Delete the post (cascade will handle postCategories)
      await db.delete(posts).where(eq(posts.id, input.id));

      return { success: true, message: 'Post deleted successfully' };
    }),

  /**
   * Get a post by slug
   * 
   * Public procedure that retrieves a single post by its slug.
   * Returns post with associated categories. Only shows published posts
   * unless the requester is the post author.
   * 
   * @public
   * @input getBySlugSchema
   * @returns Post with categories
   * 
   * @example
   * ```tsx
   * const { data: post } = trpc.post.getBySlug.useQuery({ 
   *   slug: 'my-post-slug' 
   * })
   * ```
   */
  getBySlug: publicProcedure
    .input(getBySlugSchema)
    .query(async ({ ctx, input }) => {
      const { db, user } = ctx;

      // Build query conditions
      const conditions = [eq(posts.slug, input.slug)];
      
      // If not authenticated or not the author, only show published posts
      if (!user) {
        conditions.push(eq(posts.published, true));
      }

      const post = await db.query.posts.findFirst({
        where: user
          ? or(
              and(eq(posts.slug, input.slug), eq(posts.published, true)),
              and(eq(posts.slug, input.slug), eq(posts.authorId, user.id))
            )
          : and(...conditions),
        with: {
          postCategories: {
            with: {
              category: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      return post;
    }),

  /**
   * Get total count of posts with filters
   */
  count: publicProcedure
    .input(listPostsSchema.omit({ limit: true, offset: true }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { published, categoryId, authorId, search } = input;

      const conditions = [];

      if (published !== undefined) {
        conditions.push(eq(posts.published, published));
      }

      if (authorId) {
        conditions.push(eq(posts.authorId, authorId));
      }

      conditions.push(eq(posts.archived, false));

      if (search) {
        conditions.push(
          or(
            ilike(posts.title, `%${search}%`),
            ilike(posts.content, `%${search}%`),
            ilike(posts.excerpt, `%${search}%`)
          )
        );
      }

      if (categoryId) {
        const result = await db
          .select({ count: sql<number>`count(distinct ${posts.id})` })
          .from(posts)
          .innerJoin(postCategories, eq(posts.id, postCategories.postId))
          .where(and(...conditions, eq(postCategories.categoryId, categoryId)));
        
        return Number(result[0]?.count || 0);
      } else {
        const result = await db
          .select({ count: sql<number>`count(*)` })
          .from(posts)
          .where(and(...conditions));
        
        return Number(result[0]?.count || 0);
      }
    }),

  /**
   * List posts with filtering and pagination
   * 
   * Public procedure that retrieves a list of posts with optional filters.
   * Supports filtering by publication status, category, author, and pagination.
   * 
   * @public
   * @input listPostsSchema
   * @returns Array of posts with categories
   * 
   * @example
   * ```tsx
   * const { data: posts } = trpc.post.list.useQuery({
   *   published: true,
   *   categoryId: 'tech-uuid',
   *   limit: 20,
   *   offset: 0,
   * })
   * ```
   */
  list: publicProcedure
    .input(listPostsSchema)
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { published, categoryId, authorId, search, limit, offset } = input;

      // Build where conditions
      const conditions = [];

      if (published !== undefined) {
        conditions.push(eq(posts.published, published));
      }

      if (authorId) {
        conditions.push(eq(posts.authorId, authorId));
      }

      // Always exclude archived posts from public listing
      conditions.push(eq(posts.archived, false));

      // Add search condition (case-insensitive)
      if (search) {
        conditions.push(
          or(
            ilike(posts.title, `%${search}%`),
            ilike(posts.content, `%${search}%`),
            ilike(posts.excerpt, `%${search}%`)
          )
        );
      }

      // If filtering by category, we need to filter IDs first to ensure pagination works correctly
      if (categoryId) {
        const matchingCategories = await db
          .select({ postId: postCategories.postId })
          .from(postCategories)
          .where(eq(postCategories.categoryId, categoryId));
        
        const matchingIds = matchingCategories.map(m => m.postId);
        
        if (matchingIds.length === 0) {
          return [];
        }
        
        conditions.push(inArray(posts.id, matchingIds));
      }

      // Fetch exactly what is requested
      const query = db.query.posts.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        orderBy: [desc(posts.createdAt), desc(posts.id)],
        limit: limit,
        offset,
        with: {
          postCategories: {
            with: {
              category: true,
            },
          },
        },
      });

      const allPosts = await query;

      return allPosts;
    }),

  /**
   * Get current user's posts
   * 
   * Protected procedure that retrieves all posts (published and drafts)
   * belonging to the authenticated user.
   * 
   * @requires Authentication
   * @returns Array of user's posts
   * 
   * @example
   * ```tsx
   * const { data: myPosts } = trpc.post.getUserPosts.useQuery()
   * ```
   */
  getUserPosts: protectedProcedure.query(async ({ ctx }) => {
    const { db, user } = ctx;

    const userPosts = await db.query.posts.findMany({
      where: eq(posts.authorId, user.id),
      orderBy: [desc(posts.updatedAt)],
      with: {
        postCategories: {
          with: {
            category: true,
          },
        },
      },
    });

    return userPosts;
  }),

  /**
   * Get post by ID
   * 
   * Protected procedure that retrieves a single post by ID.
   * User must be the author of the post to access it.
   * 
   * @requires Authentication
   * @input { id: string }
   * @returns Post with categories
   * 
   * @example
   * ```tsx
   * const { data: post } = trpc.post.getById.useQuery({ id: 'post-uuid' })
   * ```
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { db, user } = ctx;

      const post = await db.query.posts.findFirst({
        where: eq(posts.id, input.id),
        with: {
          postCategories: {
            with: {
              category: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      // Check if user owns the post
      if (post.authorId !== user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to access this post',
        });
      }

      return post;
    }),
});
