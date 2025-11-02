"use client";

import Link from "next/link";
import { PenTool } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Footer Component
 * 
 * Minimal, elegant footer with:
 * - Logo and tagline
 * - Simple navigation links
 * - Copyright
 */
export default function Footer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <footer className="w-full border-t border-border bg-background py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Logo and tagline */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <PenTool className="h-5 w-5 text-primary -rotate-90" />
              <span className="font-display text-xl font-bold">Inkwell</span>
            </Link>
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Share Your Stories
            </span>
          </div>

          {/* Center: Navigation links */}
          <nav className="flex items-center gap-6">
            <Link 
              href="/blogs" 
              className="text-sm text-muted-foreground hover:text-gold-600 transition-colors"
            >
              Blogs
            </Link>
            {isAuthenticated && (
              <>
                <span className="text-muted-foreground">•</span>
                <Link 
                  href="/dashboard" 
                  className="text-sm text-muted-foreground hover:text-gold-600 transition-colors"
                >
                  Dashboard
                </Link>
              </>
            )}
          </nav>

          {/* Right: Copyright */}
          <p className="text-sm text-muted-foreground">
            © 2025 Inkwell
          </p>
        </div>
      </div>
    </footer>
  );
}

