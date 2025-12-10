/**
 * Category Router
 * 
 * tRPC router for managing blog categories.
 * Provides CRUD operations for categories with proper authentication.
 */

import { z } from 'zod';
import { eq, sql } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { publicProcedure, protectedProcedure, router } from '../trpc';
import { db } from '@/drizzle/server/db';
import { categories, postCategories } from '@/drizzle/server/db/schema';
import { generateSlug } from '@/lib/utils';

/**
 * Input schema for creating a new category
 */
const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50),
  description: z.string().max(200).optional(),
});

/**
 * Input schema for updating an existing category
 */
const updateCategorySchema = z.object({
  id: z.string().uuid('Invalid category ID'),
  name: z.string().min(1, 'Category name is required').max(50).optional(),
  description: z.string().max(200).optional().nullable(),
});

/**
 * Input schema for deleting a category
 */
const deleteCategorySchema = z.object({
  id: z.string().uuid('Invalid category ID'),
});

/**
 * Input schema for getting a category by slug
 */
const getBySlugSchema = z.object({
  slug: z.string().min(1),
});

/**
 * Category Router
 * 
 * Handles all category-related operations including:
 * - Creating new categories
 * - Updating existing categories
 * - Deleting categories
 * - Listing all categories
 * - Getting a category by slug
 */
export const categoryRouter = router({
  /**
   * Create a new category
   * 
   * @requires Authentication
   * @param name - Category name (1-50 characters)
   * @param description - Optional category description (max 200 characters)
   * @returns The created category with generated slug
   * @throws TRPCError if category with slug already exists
   */
  create: protectedProcedure
    .input(createCategorySchema)
    .mutation(async ({ input }) => {
      const { name, description } = input;
      
      // Generate slug from category name
      const slug = generateSlug(name);

      // Check if category with this slug already exists
      const existingCategory = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, slug))
        .limit(1);

      if (existingCategory.length > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A category with this name already exists',
        });
      }

      // Insert the new category
      const [newCategory] = await db
        .insert(categories)
        .values({
          name,
          slug,
          description: description || null,
        })
        .returning();

      return newCategory;
    }),

  /**
   * Update an existing category
   * 
   * @requires Authentication
   * @param id - Category ID to update
   * @param name - New category name (optional)
   * @param description - New category description (optional)
   * @returns The updated category
   * @throws TRPCError if category not found or slug conflict
   */
  update: protectedProcedure
    .input(updateCategorySchema)
    .mutation(async ({ input }) => {
      const { id, name, description } = input;

      // Check if category exists
      const [existingCategory] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id))
        .limit(1);

      if (!existingCategory) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        });
      }

      // Prepare update data
      const updateData: {
        name?: string;
        slug?: string;
        description?: string | null;
      } = {};

      // If name is being updated, generate new slug
      if (name && name !== existingCategory.name) {
        const newSlug = generateSlug(name);

        // Check if new slug conflicts with another category
        const slugConflict = await db
          .select()
          .from(categories)
          .where(eq(categories.slug, newSlug))
          .limit(1);

        if (slugConflict.length > 0 && slugConflict[0].id !== id) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'A category with this name already exists',
          });
        }

        updateData.name = name;
        updateData.slug = newSlug;
      }

      // Update description if provided
      if (description !== undefined) {
        updateData.description = description;
      }

      // Perform the update
      const [updatedCategory] = await db
        .update(categories)
        .set(updateData)
        .where(eq(categories.id, id))
        .returning();

      return updatedCategory;
    }),

  /**
   * Delete a category
   * 
   * @requires Authentication
   * @param id - Category ID to delete
   * @returns Success message
   * @throws TRPCError if category not found
   * @note This will cascade delete all post-category associations
   */
  delete: protectedProcedure
    .input(deleteCategorySchema)
    .mutation(async ({ input }) => {
      const { id } = input;

      // Check if category exists
      const [existingCategory] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id))
        .limit(1);

      if (!existingCategory) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        });
      }

      // Delete the category (will cascade to postCategories)
      await db
        .delete(categories)
        .where(eq(categories.id, id));

      return {
        success: true,
        message: 'Category deleted successfully',
      };
    }),

  /**
   * List all categories
   * 
   * @public
   * @returns Array of all categories ordered by name with post counts
   */
  list: publicProcedure
    .query(async () => {
      const allCategories = await db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
          createdAt: categories.createdAt,
          postCount: sql<number>`cast(count(${postCategories.categoryId}) as integer)`,
        })
        .from(categories)
        .leftJoin(postCategories, eq(categories.id, postCategories.categoryId))
        .groupBy(categories.id)
        .orderBy(categories.name);

      return allCategories;
    }),

  /**
   * Get a category by slug
   * 
   * @public
   * @param slug - Category slug to look up
   * @returns Category object or null if not found
   */
  getBySlug: publicProcedure
    .input(getBySlugSchema)
    .query(async ({ input }) => {
      const { slug } = input;

      const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, slug))
        .limit(1);

      return category || null;
    }),
});
