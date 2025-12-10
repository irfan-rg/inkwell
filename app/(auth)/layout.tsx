import React, { type ReactNode } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

/**
 * Protected Layout
 * 
 * Layout for authenticated routes (dashboard, etc.).
 * Wraps all children with AuthGuard to ensure only authenticated users can access.
 * Includes Navbar and Footer for consistent layout across protected pages.
 */
export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </div>
    </AuthGuard>
  );
}
