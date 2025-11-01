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
import { PenSquare, Menu, X, LogOut, User, LayoutDashboard } from "lucide-react";
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
    return `text-sm font-medium transition-colors hover:text-primary ${
      isActive ? "text-primary border-b-2 border-primary pb-[2px]" : ""
    }`;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          onClick={closeMobileMenu}
        >
          <PenSquare className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Inkwell</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          <Link 
            href="/blogs" 
            className={getLinkClasses("/blogs")}
          >
            Blogs
          </Link>

          {isAuthenticated ? (
            <>
              <Link 
                href="/dashboard" 
                className={getLinkClasses("/dashboard")}
              >
                Dashboard
              </Link>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="text-sm font-medium">{userEmail}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild variant="default" size="sm">
              <Link href="/auth/login">Login</Link>
            </Button>
          )}

          <ThemeToggle />
        </div>

        {/* Mobile Menu Button & Theme Toggle */}
        <div className="flex items-center space-x-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={closeMobileMenu}
          />
          
          {/* Drawer */}
          <div className="fixed right-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 border-l bg-background p-6 shadow-lg md:hidden animate-in slide-in-from-right">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/blogs" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/blogs" || pathname?.startsWith("/blogs") ? "text-primary font-semibold" : ""
                }`}
                onClick={closeMobileMenu}
              >
                Blogs
              </Link>

              {isAuthenticated ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      pathname === "/dashboard" || pathname?.startsWith("/dashboard") ? "text-primary font-semibold" : ""
                    }`}
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>

                  <div className="pt-4 border-t">
                    <div className="flex items-center space-x-2 mb-4">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium truncate">{userEmail}</p>
                    </div>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-600 hover:text-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <Button asChild variant="default" className="w-full">
                  <Link href="/auth/login" onClick={closeMobileMenu}>
                    Login
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
