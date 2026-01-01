"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);
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

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setShowNewsletter(media.matches);
    update();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  return (
    <footer className="w-full border-t border-border bg-background text-foreground">
      <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-foreground/20 border-b border-foreground/20">
        
        {/* Brand Column */}
        <div className="md:col-span-1 p-6 md:p-8 flex flex-col justify-between h-full">
          <div>
            <span className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6 md:mb-12">Platform</span>
            <div className="flex flex-nowrap items-center gap-3 mb-2 min-w-0">
              <Link href="/" className="shrink-0" aria-label="Home">
                <Image src="/favicon.svg" alt="Inkwell" width={32} height={32} className="cursor-pointer" />
              </Link>
              <Link
                href="/"
                className="font-display font-bold text-4xl tracking-tighter uppercase mb-0 leading-none whitespace-nowrap"
              >
                InkWell .
              </Link>
            </div>
            
          </div>
          <p className="text-xs font-mono text-muted-foreground mt-6 md:mt-auto">
            &copy; 2025 Inkwell Inc.<br/>
            All Rights Reserved.
          </p>
        </div>

        {/* Navigation Column */}
        <div className="md:col-span-1 p-6 md:p-8">
          <span className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-8">Directory</span>
          <nav className="grid grid-cols-2 gap-3">
            <Link href="/" className="font-display text-lg font-bold uppercase hover:text-foreground/60 transition-colors">Home</Link>
            <Link href="/blogs" className="font-display text-lg font-bold uppercase hover:text-foreground/60 transition-colors">Journal</Link>
            {isAuthenticated ? (
              <Link href="/dashboard" className="font-display text-lg font-bold uppercase hover:text-foreground/60 transition-colors">Studio</Link>
            ) : (
              <Link href="/auth/login" className="font-display text-lg font-bold uppercase hover:text-foreground/60 transition-colors">Sign In</Link>
            )}
            <Link href="/about" className="font-display text-lg font-bold uppercase hover:text-foreground/60 transition-colors">About</Link>
          </nav>
        </div>

        {/* Social / Manifesto Column */}
        <div className="md:col-span-1 p-6 md:p-8 flex flex-col">
          <span className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6">Manifesto</span>
          <p className="font-sans text-base leading-relaxed text-foreground/80 mb-6">
            &ldquo;We believe in the power of the written word. Design should retreat, allowing stories to step forward.&rdquo;
          </p>
          <div className="mt-auto flex gap-4">
            {['Twitter', 'GitHub', 'LinkedIn'].map((social) => (
              <Link key={social} href="#" className="text-xs font-bold uppercase tracking-widest hover:text-foreground/60 transition-colors flex items-center gap-1">
                {social} <ArrowUpRightIcon className="h-3 w-3" />
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter Column */}
        {showNewsletter && (
          <div className="md:col-span-1 p-6 md:p-8 bg-foreground text-background">
            <span className="block font-mono text-xs uppercase tracking-widest text-background/60 mb-6">Stay Updated</span>
            <p className="text-sm text-background/70 mb-4">Curated stories delivered directly to your inbox. No spam, ever.</p>
            <div className="space-y-3">
              <Input 
                placeholder="EMAIL ADDRESS" 
                className="bg-transparent border-background/30 text-background placeholder:text-background/40 rounded-none h-11 px-4 focus-visible:border-background focus-visible:ring-0" 
              />
              <Button className="w-full h-11 rounded-none bg-background text-foreground hover:bg-background/90 font-bold uppercase tracking-widest text-xs">
                Subscribe
              </Button>
            </div>
          </div>
        )}

      </div>
      
      {/* Bottom Bar */}
      <div className="px-8 py-4 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
        <span>Designed with Swiss Precision</span>
        <div className="flex flex-wrap justify-center gap-6 mt-2 md:mt-0">
          <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
          <Link href="#" className="hover:text-foreground">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}