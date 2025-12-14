<div align="center">
  <br/>
  <img src="https://inkwelll.vercel.app/favicon.svg" alt="Inkwell" width="60" height="60"/>
  <h1>Inkwell</h1>
  <p><strong>Modern Blogging Platform</strong></p>
  <p>A full-stack multi-user blogging platform built with Next.js 15, featuring markdown support, category management, and a refined editorial design system.</p>
  
  
  
  <p>
    <a href="https://inkwelll.vercel.app" target="_blank">
      <strong>View Live Demo</strong>
    </a>
  </p>
</div>

---

## Design Philosophy

Inkwell departs from the standard "SaaS" look, embracing the principles of **Swiss Design**:

*   **Typography First:** Utilizing `Playfair Display` for impact and `DM Sans` for readability, with `JetBrains Mono` for technical precision.
*   **Strict Grid & Alignment:** Layouts are governed by mathematical precision.
*   **High Contrast:** A monochromatic palette (Ink Black & Paper White) ensures maximum legibility.
*   **Zero Radius:** Sharp corners (`0rem`) replace rounded edges for a cleaner, more architectural feel.
*   **Function over Decoration:** Every element serves a purpose.

---

## Tech Stack

Built on the bleeding edge of the React ecosystem:

### Core
*   **Next.js 16** - The latest React framework with App Router and Server Actions.
*   **React 19** - Leveraging the newest React features.
*   **TypeScript** - Strict type safety throughout the application.

### Styling & UI
*   **Tailwind CSS v4** - The next generation of utility-first CSS.
*   **Radix UI** - Headless, accessible component primitives.
*   **Swiss Design System** - Custom-built design tokens for typography and spacing.

### Backend & Data
*   **tRPC** - End-to-end type-safe APIs.
*   **Drizzle ORM** - Lightweight and type-safe SQL query builder.
*   **PostgreSQL** - Robust relational database (via Supabase).
*   **React Query** - Powerful asynchronous state management.

### Infrastructure
*   **Supabase Auth** - Secure user authentication and RLS.
*   **Supabase Storage** - Scalable object storage for media.
*   **Vercel** - Edge-ready deployment.

---

## Features

### ✍️ For Writers
*   **Distraction-Free Editor:** A split-pane Markdown editor with live preview.
*   **Rich Media:** Drag-and-drop image uploads and cover art management.
*   **Organization:** Robust category management and tagging system.
*   **Draft System:** Save work-in-progress and publish when ready.

### 📖 For Readers
*   **Optimized Reading Experience:** Carefully calibrated line lengths and typographic rhythm.
*   **Fast Navigation:** Instant page transitions and category filtering.
*   **Search:** Full-text search functionality.
*   **Responsive:** Flawless experience across all device sizes.

### 🛡️ Enterprise Grade
*   **Role-Based Access:** Secure authoring and editing permissions.
*   **SEO Optimized:** Server-side rendering and semantic HTML.
*   **Performance:** Sub-second load times and optimized assets.

---

## Getting Started

### Prerequisites
*   Node.js 18+
*   Supabase Account

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/irfan-rg/inkwell.git
    cd inkwell
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file:
    ```env
    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=your_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

    # Database
    DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres

    # App
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```

4.  **Database Setup**
    Push the schema to your Supabase instance:
    ```bash
    npm run db:push
    ```

5.  **Run Locally**
    ```bash
    npm run dev
    ```

---

## Project Structure

```
inkwell/
├── app/                  # Next.js App Router
│   ├── (auth)/           # Authenticated routes (Dashboard)
│   ├── (public)/         # Public routes (Blog, Landing)
│   ├── api/              # API Routes (tRPC, Keep-alive)
│   └── globals.css       # Global styles & Tailwind theme
├── components/
│   ├── auth/             # Authentication components
│   ├── blog/             # Blog-specific components
│   ├── layout/           # Layout components (Nav, Footer)
│   ├── theme/            # Theme providers
│   └── ui/               # Reusable UI primitives
├── drizzle/              # Database migrations & schema snapshots
├── lib/                  # Utilities & configuration
├── server/               # Backend logic
│   ├── api/              # tRPC routers
│   └── db/               # Database schema & connection
└── types/                # Global type definitions
```

---

## Documentation

For a deep dive into the architecture, database schema, and design decisions, please refer to the [Detailed Guide](docs/DETAILED_GUIDE.md).

