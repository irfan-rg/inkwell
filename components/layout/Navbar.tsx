"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { createClient } from "@/lib/supabase/client";

interface NavLinkProps {
  href: string;
  pathname: string | null;
  number: string;
  label: string;
}

function NavLink({ href, pathname, number, label }: NavLinkProps) {
  // Active if exact match or pathname starts with href and next char is / or end
  const isActive =
    pathname === href ||
    (href !== "/" && pathname?.startsWith(href) &&
      (pathname === href || pathname?.charAt(href.length) === "/"));
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-4 text-xs font-mono uppercase tracking-[0.2em] transition-colors font-bold hover:text-foreground/60",
        isActive ? "text-foreground" : "text-muted-foreground"
      )}
    >
      <span>[{number}]</span>
      <span>{label}</span>
    </Link>
  );
}

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState<string>("");
  const [userName, setUserName] = React.useState<string>("");
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      if (user?.email) setUserEmail(user.email);
      if (user?.user_metadata?.name) setUserName(user.user_metadata.name);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user?.email) setUserEmail(session.user.email);
      if (session?.user?.user_metadata?.name) setUserName(session.user.user_metadata.name);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    setIsMobileMenuOpen(false);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh(); 
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const getUserInitials = () => {
    if (!userEmail) return "U";
    return userEmail.charAt(0).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border h-16 bg-background">
      <div className="flex h-full items-center justify-between px-4 md:px-8">
        
        {/* Left: Branding */}
        <Link 
          href="/" 
          className="font-display text-2xl font-black tracking-tighter text-foreground hover:text-foreground/60 transition-colors"
          onClick={closeMobileMenu}
        >
          INKWELL .
        </Link>

        {/* Center: Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/blogs" pathname={pathname} number="01" label="Journal" />
          {isAuthenticated && <NavLink href="/dashboard" pathname={pathname} number="02" label="Studio" />}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {/* Desktop: User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden md:flex items-center justify-center h-9 w-9 hover:bg-muted/50 p-6 transition-colors focus:outline-none">
                  <Avatar className="h-8 w-8 rounded-none border border-foreground">
                    <AvatarFallback className="bg-foreground text-background text-xs font-bold rounded-none">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 border border-border p-2 shadow-lg" 
                style={{ backgroundColor: 'hsl(var(--background))' }}
              >
                <div className="p-4 border-b border-border">
                  <p className="text-sm font-bold text-foreground font-display uppercase tracking-wide">{userName || "Writer"}</p>
                  <p className="text-[10px] text-muted-foreground mt-2 mb-1 truncate font-mono uppercase">{userEmail}</p>
                </div>
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="cursor-pointer font-bold uppercase text-xs tracking-wider py-3 p-4 rounded-none focus:bg-destructive focus:text-destructive-foreground"
                >
                  <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link 
                href="/auth/login" 
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider hover:text-foreground/60 transition-colors"
              >
                Log in
              </Link>
              <Link 
                href="/auth/signup" 
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-foreground text-background hover:bg-foreground/90 hover:text-background transition-colors"
              >
                Join Now
              </Link>
            </div>
          )}

          {/* Mobile: Hamburger */}
          <button
            className="md:hidden flex items-center justify-center h-9 w-9 hover:bg-muted/50 rounded transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 w-full bg-background border-b border-border shadow-lg z-50" style={{ backgroundColor: 'hsl(var(--background))' }}>
          <div className="flex flex-col p-4 space-y-2">
            {/* User Info Section (if authenticated) */}
            {isAuthenticated && (
              <div className="p-4 mb-2 bg-muted/30 rounded border border-border">
                <p className="text-sm font-bold text-foreground font-display uppercase tracking-wide">{userName || "Writer"}</p>
                <p className="text-[10px] text-muted-foreground mt-1 truncate font-mono uppercase">{userEmail}</p>
              </div>
            )}

            {/* Navigation Links */}
            <Link 
              href="/blogs" 
              onClick={closeMobileMenu}
              className={cn(
                "px-4 py-3 text-sm font-mono font-bold uppercase tracking-wider rounded transition-colors",
                pathname.startsWith('/blogs') ? "bg-foreground text-background" : "hover:bg-muted/50"
              )}
            >
              <span className="font-mono text-[10px] tracking-[0.2em] mr-2">[01]</span>
              Journal
            </Link>
            
            {isAuthenticated && (
              <Link 
                href="/dashboard" 
                onClick={closeMobileMenu}
                className={cn(
                  "px-4 py-3 text-sm font-mono font-bold uppercase tracking-wider rounded transition-colors",
                  pathname.startsWith('/dashboard') ? "bg-foreground text-background" : "hover:bg-muted/50"
                )}
              >
                <span className="font-mono text-[10px] tracking-[0.2em] mr-2">[02]</span>
                Studio
              </Link>
            )}

            {/* Auth Actions */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-4 py-3 text-sm font-bold uppercase tracking-wider bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded transition-colors flex items-center justify-center gap-2"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Sign Out
              </button>
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <Link 
                  href="/auth/login" 
                  onClick={closeMobileMenu}
                  className="px-4 py-3 text-sm font-bold uppercase tracking-wider hover:bg-muted/50 rounded transition-colors text-center"
                >
                  Log in
                </Link>
                <Link 
                  href="/auth/signup" 
                  onClick={closeMobileMenu}
                  className="px-4 py-3 text-sm font-bold uppercase tracking-wider bg-foreground text-background hover:bg-foreground/90 hover:text-background rounded transition-colors text-center"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}