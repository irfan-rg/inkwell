ALTER TABLE "auth"."users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "auth"."users" CASCADE;--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_author_id_users_id_fk";
--> statement-breakpoint
DROP INDEX "post_categories_post_id_idx";--> statement-breakpoint
DROP INDEX "post_categories_category_id_idx";--> statement-breakpoint
DROP INDEX "posts_author_id_idx";--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "updated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
CREATE INDEX "post_categories_post_idx" ON "post_categories" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "post_categories_category_idx" ON "post_categories" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "posts_author_idx" ON "posts" USING btree ("author_id");