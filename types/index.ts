/**
 * Shared TypeScript Types
 * Central location for type definitions used across the application
 */

/**
 * Database types for Supabase
 * These types represent your database schema and provide type safety
 * for all database operations.
 * 
 * Note: You can auto-generate these types from your database using:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.types.ts
 */
export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          title: string;
          content: string;
          slug: string;
          cover_image: string | null;
          excerpt: string | null;
          published: boolean;
          author_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          slug: string;
          cover_image?: string | null;
          excerpt?: string | null;
          published?: boolean;
          author_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          slug?: string;
          cover_image?: string | null;
          excerpt?: string | null;
          published?: boolean;
          author_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      post_categories: {
        Row: {
          post_id: string;
          category_id: string;
        };
        Insert: {
          post_id: string;
          category_id: string;
        };
        Update: {
          post_id?: string;
          category_id?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

/**
 * Helper types for working with tables
 */
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

/**
 * Post types
 */
export type Post = Tables<'posts'>;
export type PostInsert = Database['public']['Tables']['posts']['Insert'];
export type PostUpdate = Database['public']['Tables']['posts']['Update'];

/**
 * Category types
 */
export type Category = Tables<'categories'>;
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
export type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

/**
 * Post Categories junction types
 */
export type PostCategory = Tables<'post_categories'>;
export type PostCategoryInsert = Database['public']['Tables']['post_categories']['Insert'];
export type PostCategoryUpdate = Database['public']['Tables']['post_categories']['Update'];

/**
 * Extended types with relations
 */
export type PostWithCategories = Post & {
  post_categories: (PostCategory & {
    categories: Category;
  })[];
};

export type CategoryWithPostCount = Category & {
  post_count: number;
};

/**
 * Authentication types
 */
export type User = {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
};

/**
 * API Response types
 */
export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};

/**
 * Form state types for Server Actions
 */
export type FormState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};
