import Link from "next/link";
import { Github, Twitter, Linkedin, PenSquare } from "lucide-react";

/**
 * Footer Component
 * 
 * Site-wide footer with:
 * - Branding and tagline
 * - Quick navigation links
 * - Social media links
 * - Copyright and tech stack info
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Column 1: Branding */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
              <PenSquare className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Inkwell</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Share Your Stories
            </p>
            <p className="text-sm text-muted-foreground">
              A modern blogging platform built for writers and readers who love great content.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/blogs" 
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard" 
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Social Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Connect</h3>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Follow us for updates and new features.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-center text-sm text-muted-foreground">
              © {currentYear} Inkwell. Crafted with ❤️
            </p>
            <p className="text-center text-sm text-muted-foreground">
              Built with Next.js, Supabase, and tRPC
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
