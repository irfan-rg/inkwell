import type { ReactNode } from "react";

/**
 * Auth Layout
 * 
 * Layout for authentication pages (login, signup).
 * Provides a centered container with gradient background
 * suitable for auth forms.
 */
export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted">
      {children}
    </div>
  );
}
