"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/trpc";
import { createClient } from "@/lib/supabase/client";
import { ArrowRightIcon, ArrowUpRightIcon } from "@heroicons/react/24/solid";
import { PostCard } from "@/components/blog/PostCard";
import { PostListSkeleton } from "@/components/ui/post-skeleton";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createClient();
  
  const { data: recentPosts, isLoading } = api.post.list.useQuery({
    published: true,
    limit: 3,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  const startWritingHref = isAuthenticated ? "/dashboard" : "/auth/signup";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />
      
      {/* --- HERO SECTION --- */}
      <section className="border-b border-foreground">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[81vh]">
          {/* Main Statement */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center p-6 lg:p-24 border-b lg:border-b-0 lg:border-r border-foreground bg-background">
            <div className="flex flex-col items-center justify-center w-full">
              
              <h1 className="font-display text-[14vw] md:text-[8rem] font-black uppercase tracking-tight text-foreground text-center mb-8 mt-8">
                INKWELL
              </h1>

              <div className="flex flex-col items-center mt-2">
                <p className="font-mono text-xs md:text-xs font-bold uppercase tracking-widest text-foreground mb-4 text-center opacity-70">
                  [EST. 2025]
                </p>

                <p className="font-mono font-semibold text-xs md:text-sm text-muted-foreground text-center">
                  A PLATFORM FOR THOUGHT. DESIGNED FOR CLARITY. BUILT FOR WRITERS
                </p>
              </div>
            </div>
          </div>
          
          {/* Side Actions - USING SEMANTIC CLASSES */}
          <div className="lg:col-span-4 flex flex-col">
            {/* Step 01 */}
            <div className="flex-1 section-inverted p-6 lg:p-8 flex flex-col justify-center items-start transition-opacity duration-500">

              <span className="font-mono text-[10px] font-bold uppercase tracking-widest mb-3 opacity-70 text-inverted">
                [Step 01]
              </span>

              <h3 className="font-display text-3xl lg:text-4xl font-black mb-4 uppercase leading-none text-inverted">
                Start<br/>
                Writing
              </h3>

              <Button 
                size="default" 
                asChild 
                className="mt-4 h-12 w-full text-sm uppercase tracking-wider font-bold btn-inverted rounded-none self-end lg:self-auto"
              >
                <Link href={startWritingHref} className="flex items-center">
                  Initialize <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            {/* Step 02 */}
            <div className="flex-1 section-inverted border-t border-inverted p-6 lg:p-8 flex flex-col justify-center items-start">

              <span className="font-mono text-[10px] font-bold uppercase tracking-widest mb-3 opacity-70 text-inverted">
                [Step 02]
              </span>
              
              <h3 className="font-display text-3xl lg:text-4xl font-black mb-4 uppercase leading-none text-inverted">
                Read<br/>
                Journal
              </h3>

              <Button 
                size="default" 
                asChild 
                className="mt-4 h-12 w-auto lg:w-full text-sm uppercase tracking-wider font-bold btn-inverted rounded-none self-end lg:self-auto"
              >
                <Link href="/blogs" className="flex items-center">
                  Explore Archive
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- MARQUEE STRIP --- */}
        <div className="section-inverted border-b border-inverted overflow-hidden py-4">
        <div className="whitespace-nowrap animate-marquee">
          <span className="text-4xl font-display font-black uppercase text-inverted mx-8">Markdown Native</span>
          <span className="text-4xl font-display font-black uppercase text-transparent mx-8" style={{ WebkitTextStroke: '1px hsl(var(--background))', WebkitTextStrokeWidth: '1px' }}>Global Reach</span>
          <span className="text-4xl font-display font-black uppercase text-inverted mx-8">Zero Distractions</span>
          <span className="text-4xl font-display font-black uppercase text-transparent mx-8" style={{ WebkitTextStroke: '1px hsl(var(--background))', WebkitTextStrokeWidth: '1px' }}>High Performance</span>
          <span className="text-4xl font-display font-black uppercase text-inverted mx-8">Markdown Native</span>
          <span className="text-4xl font-display font-black uppercase text-transparent mx-8" style={{ WebkitTextStroke: '1px hsl(var(--background))', WebkitTextStrokeWidth: '1px' }}>Global Reach</span>
          <span className="text-4xl font-display font-black uppercase text-inverted mx-8">Zero Distractions</span>
          <span className="text-4xl font-display font-black uppercase text-transparent mx-8" style={{ WebkitTextStroke: '1px hsl(var(--background))', WebkitTextStrokeWidth: '1px' }}>High Performance</span>
        </div>
      </div>

      {/* --- FEATURE LIST --- */}
      <section className="border-b border-foreground">
        <div className="grid grid-cols-1">
          {[
            { id: "[01]", title: "Markdown Native", desc: "Write in pure markdown. Real-time rendering. No complex editors." },
            { id: "[02]", title: "Global Reach", desc: "Static generation ensures your stories load instantly, everywhere." },
            { id: "[03]", title: "Swiss Design", desc: "A strict grid system designed to elevate content, not decorate it." }
          ].map((item, i) => (
            <div key={i} className="group border-b border-foreground/10 last:border-b-0">
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[200px] transition-all duration-300 group-hover:bg-foreground group-hover:text-background">
                <div className="md:col-span-2 p-8 md:p-12 border-b md:border-b-0 md:border-r border-foreground/10 group-hover:border-background/10 flex items-center">
                  <span className="font-mono text-sm font-bold tracking-widest">{item.id}</span>
                </div>
                <div className="md:col-span-6 p-8 md:p-12 border-b md:border-b-0 md:border-r border-foreground/10 group-hover:border-background/10 flex items-center">
                  <h3 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter leading-none group-hover:text-background! transition-colors duration-300">
                    {item.title}
                  </h3>
                </div>
                <div className="md:col-span-4 p-8 md:p-12 flex items-center">
                  <p className="text-lg font-sans leading-relaxed opacity-80 max-w-sm">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- LATEST STORIES --- */}
      <section className="py-24 px-6 lg:px-12 bg-muted/5">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b-4 border-foreground pb-6">
            <h2 className="text-6xl md:text-9xl font-display font-black tracking-tighter uppercase">
              Fresh Ink
            </h2>
            <Link href="/blogs" className="group flex items-center text-base font-bold uppercase tracking-widest hover:text-foreground/60 transition-colors mt-6 md:mt-0 mb-2">
              View Complete Archive
              <ArrowUpRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {isLoading ? (
              <PostListSkeleton count={3} />
            ) : recentPosts && recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <div key={post.id} className="group">
                  <PostCard post={post} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-32 text-center border-2 border-dashed border-foreground/10 bg-background">
                <p className="text-2xl font-display font-bold text-muted-foreground uppercase">The ink is dry. No stories yet.</p>
                <Button variant="link" asChild className="mt-4 text-foreground font-bold uppercase tracking-widest text-lg">
                  <Link href={startWritingHref}>Write the first one</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="border-t border-foreground grid lg:grid-cols-2">
        {/* Left - Inverted */}
        <div className="section-inverted border-b lg:border-b-0 lg:border-r border-inverted p-10 sm:p-12 md:p-16 lg:p-32">
          <h2 className="text-5xl md:text-7xl font-display font-black leading-tight uppercase tracking-tighter mb-8 text-inverted">
            Ready to<br/>Publish?
          </h2>
          <Button 
            size="lg" 
            asChild 
            className="btn-inverted w-full sm:w-auto rounded-none h-16 px-10 text-lg font-bold uppercase tracking-widest"
          >
            <Link href={startWritingHref}>Join the Platform</Link>
          </Button>
        </div>
        
        {/* Right - Normal */}
        <div className="p-10 sm:p-12 md:p-16 lg:p-32 bg-background text-foreground flex flex-col justify-center">

          <div className="mb-8 text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-quote-icon lucide-quote" style={{ transform: "scaleX(-1)" }}>
              <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>
              <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>
            </svg>
          </div>
          
          <p className="text-2xl md:text-3xl font-sans leading-relaxed mb-8 text-foreground">
            Design is the silent ambassador of your brand. We provide the canvas; you provide the art. 
          </p>
          
          <p className="text-right text-sm font-mono uppercase tracking-widest opacity-60 text-foreground">
            — Paul Rand (Adapted)
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}