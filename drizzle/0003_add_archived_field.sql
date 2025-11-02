-- Add archived field to posts table
ALTER TABLE "posts" ADD COLUMN "archived" boolean DEFAULT false NOT NULL;

-- Create index for archived status
CREATE INDEX IF NOT EXISTS "posts_archived_idx" ON "posts" ("archived");
