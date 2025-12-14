<div align="center">
  <h1>Inkwell</h1>
  <p>
    <img src="https://inkwelll.vercel.app/favicon.svg" alt="Inky Logo" width="60" height="60"/>
    </p>
  <p><strong>Modern Blogging Platform</strong></p>
  <p>A full-stack Multi-User Blogging platform built with Next.js 15, featuring Markdown Support, Category Management, and a refined Editorial Design system.</p>
<br>
  <p>
    <a href="https://inkwelll.vercel.app" target="_blank">
      <strong>View Live Demo</strong>
    </a>
  </p>
</div>

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | **Next.js 15**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **React Query**, **Zustand**, **React Markdown**, **Heroicons** |
| **Backend & DB** | **tRPC**, **Drizzle ORM**, **PostgreSQL (Supabase)**, **Zod** |
| **Auth & Storage** | **Supabase Auth**, **Supabase Storage**, **Row Level Security (RLS)** |
| **Deployment** | **Vercel**, **Supabase** |

---

## 🚀 Setup Steps (How to Run Locally)

### Prerequisites
- Node.js 18 or higher
- npm, yarn, or pnpm
- Supabase account (free tier)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/irfan-rg/inkwell
   cd inkwell
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to **Project Settings → API**
   - Copy your project URL and API keys

4. **Set up Supabase Storage:**
   - Navigate to **Storage** in Supabase dashboard
   - Create a new bucket named `post-covers`
   - Set bucket to **Public**
   - File size limit: **5MB**
   - Allowed MIME types: `image/jpeg, image/png, image/webp`

5. **Configure Supabase Authentication:**
   - Go to **Authentication → Providers**
   - Enable **Email** provider
   - In **URL Configuration**, add:
     - Site URL: `http://localhost:3000`
     - Redirect URLs: `http://localhost:3000/**`

6. **Set up environment variables:**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

   # Database Connection
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres

   # Application URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

   > **Where to find these values:**
   > - `NEXT_PUBLIC_SUPABASE_URL`: Project Settings → API → Project URL
   > - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Project Settings → API → anon public key
   > - `SUPABASE_SERVICE_ROLE_KEY`: Project Settings → API → service_role key (keep secret!)
   > - `DATABASE_URL`: Project Settings → Database → Connection String → URI

7. **Set up the database schema:**
   ```bash
   npm run db:push
   ```

8. **(Optional) Seed sample Posts:**
   ```bash
   npm run seed-posts
   ```
   or
   ```bash
   npm dotenv -e .env.local -- tsx scripts/seed-posts.ts
   ```
9. **Run the development server:**
   ```bash
   npm run dev
   ```

10. **Open the application:**
    
    Visit [http://localhost:3000](http://localhost:3000)

11. **Create your first account:**
    - Click "Get Started" or "Login"
    - Sign up with email and name
    - Check your email for verification link (for now turned off, due to testing purpose)
    - Login and start creating posts!

---

## 📂 Project Structure

<details>
<summary>Click to expand file structure</summary>

```
inkwell/
├── app/                          # Next.js 15 App Router
│   ├── (public)/                 # Public routes
│   │   ├── page.tsx              # Landing page
│   │   └── blogs/
│   │       ├── page.tsx          # Blog listing
│   │       └── [slug]/page.tsx   # Post view
│   ├── (auth)/                   # Protected routes
│   │   └── dashboard/
│   │       ├── page.tsx          # Dashboard
│   │       ├── new/              # Create post
│   │       ├── edit/[id]/        # Edit post
│   │       └── categories/       # Category management
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── api/trpc/[trpc]/route.ts  # tRPC handler
│   └── layout.tsx                # Root layout
├── components/
│   ├── ui/                       # shadcn components
│   ├── blog/                     # Blog components
│   │   ├── PostCard.tsx
│   │   ├── MarkdownEditor.tsx
│   │   ├── ImageUpload.tsx
│   │   └── SearchBar.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── auth/
│       └── AuthGuard.tsx
├── server/
│   ├── api/
│   │   ├── routers/
│   │   │   ├── post.ts           # Post operations
│   │   │   ├── category.ts       # Category operations
│   │   │   └── upload.ts         # Image upload
│   │   ├── trpc.ts               # tRPC setup
│   │   └── root.ts               # Root router
│   └── db/
│       ├── index.ts              # Drizzle client
│       └── schema.ts             # Database schema
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   └── server.ts             # Server client
│   ├── trpc.tsx                  # tRPC React client
│   └── utils.ts                  # Utilities
├── types/
│   └── index.ts                  # Shared types
├── drizzle/                      # DB migrations
├── scripts/
│   └── seed.ts                   # Seed script
└── public/                       # Static assets
```
</details>

---

## ✨ Features Implemented

### 🔴 Priority 1 - Must Have
- [x] Blog post CRUD (create, read, update, delete)
- [x] Category CRUD operations
- [x] Assign multiple categories to posts
- [x] Blog listing page with all posts
- [x] Individual post view page
- [x] Category filtering on listing
- [x] Responsive navigation
- [x] Clean, professional UI

### 🟡 Priority 2 - Should Have
- [x] Landing page (Hero, Features, Recent Posts, CTA)
- [x] Dashboard for post management
- [x] Draft vs Published status
- [x] Loading states (skeletons)
- [x] Error states with empty state messages
- [x] Mobile-responsive design
- [x] Markdown editor with live preview

### 🟢 Priority 3 - Bonus Features
- [x] Full 5-section landing page
- [x] Search functionality
- [x] Post statistics (word count, reading time)
- [x] Dark mode support
- [x] Image upload for cover images
- [x] Post Preview functionality
- [x] Pagination on blog listing

---

## 🌟 Additional Features Beyond Requirements

*   **Archive Post system:** Soft delete for posts
*   **Image add via URL:** Add cover images using direct image URLs
*   **Author attribution:** Posts linked to user accounts
*   **Toast notifications:** User action feedback
*   **Dashboard filtering:** All/Published/Drafts tabs
*   **Recent posts on landing:** Dynamic content showcase
*   **Related posts:** Content discovery
*   **Quick publish toggle:** Instant status changes
*   **Optimistic updates:** Immediate UI feedback

---

## 💡 Design Decisions & Trade-offs

### Authentication Implementation

**Decision:** Implemented full authentication despite it being marked "NOT required" in the assessment.

> **Reason:**
> - A multi-user blogging platform fundamentally requires user authentication
> - Without auth, there's no way to:
>   - Attribute posts to authors
>   - Prevent unauthorized editing/deletion
>   - Implement proper authorization
>   - Display author information
> - Supabase Auth provides production-ready solution with minimal setup
> - Adds real-world functionality expected in production systems

**Implementation:**
- Email/password authentication
- User metadata for author names
- Row Level Security (RLS) policies
- Protected routes with auth guards
- Author info cached in posts table for performance

### Markdown vs Rich Text Editor

**Decision:** Chose Markdown over rich text editor.

> **Reason:**
> - **Developer & writer preference:** Most technical writers prefer markdown
> - **Better for code:** Seamless syntax highlighting
> - **Lightweight:** Smaller bundle, better performance
> - **Portable:** Content easily transferable
> - **Faster implementation:** 2-3 hours saved
> - **WYSIWYG experience:** Live preview provides similar experience

**Implementation:**
- Split-pane editor with live preview
- GitHub Flavored Markdown support
- Syntax highlighting for code blocks
- Word count and reading time calculations

### Database Schema - Author Denormalization

**Decision:** Cache author information in posts table.

> **Reason:**
> - **Performance:** Avoids JOIN with auth.users on every query
> - **Simplicity:** Reduces query complexity
> - **Acceptable trade-off:** Author names rarely change
> - **Efficiency:** Faster post listing queries

### Image Upload Strategy

**Decision:** Supabase Storage upload in addition to URL input.

> **Reason:**
> - **Better UX:** Direct upload without external hosting
> - **Control:** Enforce size and type limits
> - **Security:** Server-side validation
> - **Performance:** CDN delivery
> - **Production-ready:** Real platforms need upload capability

### Design System

**Decision:** Custom Editorial Design instead of default shadcn theme.

> **Reason:**
> - **Uniqueness:** Stands out from typical shadcn implementations
> - **Thematic:** "Inkwell" inspired ink & paper aesthetic
> - **Professional:** Editorial typography (Playfair Display + Inter)
> - **Refinement:** Gold accents, clean spacing, minimal decoration

**Colors:**
- Ink Black (#0F172A), Paper Cream (#FFFBF5)
- Gold (#C9A961) for accents
- Burgundy for errors, Forest Green for success

---

## 📊 Database Schema

### Posts Table
```typescript
posts {
  id: uuid (primary key)
  title: varchar(255) (not null)
  content: text (markdown, not null)
  slug: varchar(255) (unique, not null)
  coverImage: text (nullable, Supabase Storage URL)
  excerpt: text (nullable)
  published: boolean (default: false)
  archived: boolean (default: false)
  authorId: uuid (references auth.users, not null)
  authorName: varchar(255) (denormalized, not null)
  authorEmail: varchar(255) (denormalized, not null)
  createdAt: timestamp (default: now())
  updatedAt: timestamp (default: now())
}
```

**Indexes:**
- `slug_idx` on `slug` for fast lookups
- `author_id_idx` on `authorId` for user post queries
- `published_idx` on `published` for filtering
- `created_at_idx` on `createdAt` for sorting

### Categories Table
```typescript
categories {
  id: uuid (primary key)
  name: varchar(100) (unique, not null)
  slug: varchar(100) (unique, not null)
  description: text (nullable)
  createdAt: timestamp (default: now())
  updatedAt: timestamp (default: now())
}
```

**Indexes:**
- `slug_idx` on `slug` for fast lookups
- `name_idx` on `name` for category searches

### Post Categories (Junction Table)
```typescript
postCategories {
  postId: uuid (references posts.id, on delete cascade)
  categoryId: uuid (references categories.id, on delete cascade)
  PRIMARY KEY (postId, categoryId)
}
```

**Relationships:**
- Posts → Post Categories (one-to-many)
- Categories → Post Categories (one-to-many)
- Many-to-many relationship between Posts and Categories

---

## 🔌 tRPC Router Structure

### Root Router (`server/api/root.ts`)
```typescript
export const appRouter = createTRPCRouter({
  post: postRouter,
  category: categoryRouter,
  upload: uploadRouter,
});
```

### Post Router (`server/api/routers/post.ts`)
**Public Procedures:**
- `list` - Get all published posts with filtering options (category, search, pagination)
- `getBySlug` - Get single post by slug with related posts

**Protected Procedures (require authentication):**
- `getUserPosts` - Get authenticated user's posts (all statuses)
- `create` - Create new post with categories
- `update` - Update existing post (author-only)
- `delete` - Delete post (author-only)

**Input Validation:**
- Zod schemas for all inputs
- Slug uniqueness validation
- Author authorization checks
- Category existence validation

### Category Router (`server/api/routers/category.ts`)
**Public Procedures:**
- `list` - Get all categories with post counts
- `getBySlug` - Get category by slug with posts

**Protected Procedures:**
- `create` - Create new category
- `update` - Update category
- `delete` - Delete category (prevents if posts exist)

**Input Validation:**
- Zod schemas for name and slug
- Unique constraint checks
- Cascade protection on delete

### Upload Router (`server/api/routers/upload.ts`)
**Protected Procedures:**
- `getSignedUrl` - Generate signed URL for Supabase Storage upload
  - Validates file type (images only)
  - Enforces size limits (5MB max)
  - Returns signed URL and file path
  - Client uploads directly to Supabase

**Security:**
- File type validation (jpeg, png, webp)
- Size limit enforcement
- Signed URLs with expiration
- Storage bucket policies

---

## 🧪 Testing Checklist

### Authentication
- [x] Sign up, email verification, login, logout
- [x] Protected routes redirect correctly
- [x] Auth state persists on refresh

### Post Management
- [x] Create, edit, delete posts
- [x] Upload cover images (5MB limit)
- [x] Assign multiple categories
- [x] Save as draft / Publish
- [x] Quick publish toggle from dashboard
- [x] Dashboard stats (total, published, drafts)

### Categories
- [x] Create, edit, delete categories
- [x] Filter posts by category
- [x] Category badges display correctly

### Public Pages
- [x] Landing page loads
- [x] Search posts by title/content
- [x] Category filtering works
- [x] Pagination functional
- [x] Individual post displays properly
- [x] Related posts shown

### Markdown & Editor
- [x] Live preview works
- [x] Syntax highlighting
- [x] Word count updates
- [x] Reading time calculates

### UI/UX
- [x] Dark mode toggle
- [x] Loading skeletons
- [x] Empty states
- [x] Toast notifications
- [x] Responsive (mobile, tablet, desktop)

---

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables from `.env.local`
4. Deploy

### Post-Deployment

1. **Update Supabase:**
   - Authentication → URL Configuration
   - Add Vercel URL to Site URL and Redirect URLs

2. **Update Vercel:**
   - Set `NEXT_PUBLIC_APP_URL` to Vercel domain
   - Redeploy

---

<div align="center">
  <p>Built with Modern Web Technologies and a Passion for great Writing Experiences.</p>
</div>
