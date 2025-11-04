"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PenTool, Menu, X, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/**
 * Navbar Component
 * 
 * Responsive navigation bar with:
 * - Logo and branding
 * - Desktop and mobile navigation
 * - Authentication state management
 * - Theme toggle
 * - User profile dropdown
 */
export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState<string>("");
  const [userName, setUserName] = React.useState<string>("");
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  // Check authentication status
  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      if (user?.email) {
        setUserEmail(user.email);
      }
      if (user?.user_metadata?.name) {
        setUserName(user.user_metadata.name);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      } else {
        setUserEmail("");
      }
      if (session?.user?.user_metadata?.name) {
        setUserName(session.user.user_metadata.name);
      } else {
        setUserName("");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    setIsMobileMenuOpen(false);
    await supabase.auth.signOut();
    // Force immediate redirect to home page
    router.push("/");
    // Use replace instead of refresh to ensure clean navigation
    router.replace("/");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userEmail) return "U";
    return userEmail.charAt(0).toUpperCase();
  };

  // Helper function to get active link classes
  const getLinkClasses = (path: string) => {
    const isActive = pathname === path || (path !== "/" && pathname?.startsWith(path));
    return `text-sm font-medium transition-colors duration-200 hover:text-gold-600 ${
      isActive ? "text-foreground font-semibold" : "text-muted-foreground"
    }`;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-1.5 sm:gap-2 transition-opacity hover:opacity-80"
          onClick={closeMobileMenu}
        >
          <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
            <PenTool className="h-4 w-4 sm:h-5 sm:w-5 text-primary -rotate-90" />
          </div>
          <span className="font-display text-lg sm:text-xl font-bold">Inkwell</span>
        </Link>

        {/* Desktop Navigation - Left side */}
        <div className="hidden md:flex md:items-center md:gap-6 lg:gap-8 md:flex-1 md:ml-8 lg:ml-12">
          <Link 
            href="/blogs" 
            className={getLinkClasses("/blogs")}
          >
            Blogs
          </Link>

          {isAuthenticated && (
            <Link 
              href="/dashboard" 
              className={getLinkClasses("/dashboard")}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Right Side - Auth & Theme */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle - Always visible */}
          <ThemeToggle />

          {isAuthenticated ? (
            /* User Profile Dropdown */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full">
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {userName && (
                      <p className="text-sm font-semibold">{userName}</p>
                    )}
                    <p className={`${userName ? 'text-xs text-muted-foreground' : 'text-sm font-medium'}`}>{userEmail}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex bg-accent hover:bg-primary/90 shadow-md hover:shadow-lg transition-all text-sm">
              <Link href="/auth/login">Login</Link>
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="flex flex-col space-y-3 px-4 sm:px-6 py-4">
            <Link 
              href="/blogs" 
              className={`${getLinkClasses("/blogs")} text-base`}
              onClick={closeMobileMenu}
            >
              Blogs
            </Link>

            {isAuthenticated ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`${getLinkClasses("/dashboard")} text-base`}
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/auth/login" onClick={closeMobileMenu}>
                <Button variant="default" size="sm" className="w-full">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
