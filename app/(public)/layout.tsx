import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

/**
 * Public Layout
 * 
 * Layout for public pages (blogs, blog posts, etc.).
 * Includes Navbar and Footer for consistent layout.
 * No authentication required - accessible to everyone.
 */
export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
