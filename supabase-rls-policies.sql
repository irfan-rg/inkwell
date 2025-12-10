-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- For Inkwell Blogging Platform
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- Make sure your tables are created first (run drizzle-kit push)

-- ============================================
-- POSTS TABLE POLICIES
-- ============================================

-- Enable RLS on posts table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone can view published posts (no authentication required)
CREATE POLICY "Public posts are viewable by everyone"
ON posts FOR SELECT
TO public
USING (published = true);

-- Policy 2: Users can view their own posts (published or drafts)
CREATE POLICY "Users can view their own posts"
ON posts FOR SELECT
TO authenticated
USING (auth.uid() = author_id);

-- Policy 3: Authenticated users can create posts (and must set themselves as author)
CREATE POLICY "Users can create posts"
ON posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

-- Policy 4: Users can update only their own posts
CREATE POLICY "Users can update their own posts"
ON posts FOR UPDATE
TO authenticated
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- Policy 5: Users can delete only their own posts
CREATE POLICY "Users can delete their own posts"
ON posts FOR DELETE
TO authenticated
USING (auth.uid() = author_id);


-- ============================================
-- CATEGORIES TABLE POLICIES
-- ============================================

-- Enable RLS on categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone can view all categories (no authentication required)
CREATE POLICY "Categories are viewable by everyone"
ON categories FOR SELECT
TO public
USING (true);

-- Policy 2: Authenticated users can create categories
CREATE POLICY "Authenticated users can create categories"
ON categories FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 3: Authenticated users can update categories
CREATE POLICY "Authenticated users can update categories"
ON categories FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy 4: Authenticated users can delete categories
CREATE POLICY "Authenticated users can delete categories"
ON categories FOR DELETE
TO authenticated
USING (true);


-- ============================================
-- POST_CATEGORIES JUNCTION TABLE POLICIES
-- ============================================

-- Enable RLS on post_categories junction table
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone can view post-category relationships
CREATE POLICY "Post categories are viewable by everyone"
ON post_categories FOR SELECT
TO public
USING (true);

-- Policy 2: Authenticated users can create post-category relationships
CREATE POLICY "Authenticated users can create post categories"
ON post_categories FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 3: Authenticated users can delete post-category relationships
CREATE POLICY "Authenticated users can delete post categories"
ON post_categories FOR DELETE
TO authenticated
USING (true);

-- Note: No UPDATE policy needed as this junction table only has foreign keys
-- (no editable columns - relationships are created/deleted, not updated)


-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify your policies are set up correctly:

-- Check all policies on posts table
-- SELECT * FROM pg_policies WHERE tablename = 'posts';

-- Check all policies on categories table
-- SELECT * FROM pg_policies WHERE tablename = 'categories';

-- Check all policies on post_categories table
-- SELECT * FROM pg_policies WHERE tablename = 'post_categories';


-- ============================================
-- OPTIONAL: ADVANCED POLICIES
-- ============================================
-- If you want more granular control, you can add these additional policies:

-- Example: Only allow post authors to assign categories to their posts
/*
DROP POLICY IF EXISTS "Authenticated users can create post categories" ON post_categories;

CREATE POLICY "Post authors can manage their post categories"
ON post_categories FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM posts 
    WHERE posts.id = post_categories.post_id 
    AND posts.author_id = auth.uid()
  )
);

CREATE POLICY "Post authors can delete their post categories"
ON post_categories FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM posts 
    WHERE posts.id = post_categories.post_id 
    AND posts.author_id = auth.uid()
  )
);
*/


-- ============================================
-- CLEANUP (if you need to start over)
-- ============================================
-- Uncomment and run these if you need to remove all policies:

/*
-- Drop all policies on posts
DROP POLICY IF EXISTS "Public posts are viewable by everyone" ON posts;
DROP POLICY IF EXISTS "Users can view their own posts" ON posts;
DROP POLICY IF EXISTS "Users can create posts" ON posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;

-- Drop all policies on categories
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Authenticated users can create categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can update categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can delete categories" ON categories;

-- Drop all policies on post_categories
DROP POLICY IF EXISTS "Post categories are viewable by everyone" ON post_categories;
DROP POLICY IF EXISTS "Authenticated users can create post categories" ON post_categories;
DROP POLICY IF EXISTS "Authenticated users can delete post categories" ON post_categories;

-- Disable RLS (not recommended for production)
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE post_categories DISABLE ROW LEVEL SECURITY;
*/
