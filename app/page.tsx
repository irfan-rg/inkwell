"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/trpc";
import { PostCard } from "@/components/blog/PostCard";
import { PostListSkeleton } from "@/components/ui/post-skeleton";
import { PenTool, BookOpen, Users, ArrowDown, ArrowRight, PencilLine, Compass } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Footer from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function LandingPage() {
  const [showNavbar, setShowNavbar] = useState(false);
  // Fetch recent published posts
  const { data: recentPosts, isLoading } = api.post.list.useQuery({
    published: true,
    limit: 3,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createClient();

  // Handle scroll to show/hide navbar
  useEffect(() => {
    const handleScroll = () => {
      // Get the height of the hero section (first viewport)
      const heroHeight = window.innerHeight;
      // Calculate 70-80% of hero height
      const scrollThreshold = heroHeight * 0.75; // 75% of hero section
      
      // Show navbar if scrolled past threshold
      if (window.scrollY > scrollThreshold) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    
    // Call once on mount to check initial position
    handleScroll();

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const startWritingHref = isAuthenticated ? "/dashboard" : "/auth/signup";

  return (
    <div className="min-h-screen">
      {/* Fixed Navbar - Shows after scrolling past hero */}
      <div 
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Navbar />
      </div>

      {/* SECTION 1 - HERO (Above the fold) */}
      <section className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-paper-cream via-paper-white to-paper-cream">
        <div className="max-w-5xl mx-auto px-6 text-center">
          {/* Eyebrow text */}
          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-6 animate-fade-in">
            Welcome to
          </p>

          {/* Large heading */}
          <h1 
            className="text-7xl md:text-8xl font-display font-bold text-ink-black tracking-tight mb-4 animate-slide-up"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
          >
            Inkwell
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl font-serif italic text-muted-foreground mt-4 mb-6">
            Where stories find their voice
          </p>

          {/* Description */}
          <p className="text-lg text-muted-foreground font-body italic text-ink-blue max-w-2xl mx-auto mt-8 leading-relaxed">
            A sanctuary for Writers and Readers who appreciate the craft of Storytelling.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-14">
            <Button size="lg" asChild className="text-base font-semibold px-8 shadow-md hover:shadow-lg transition-all">
              <Link href={startWritingHref}>
                <PenTool className="h-5 w-5 -rotate-95" />
                Start Writing
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild className="text-base font-semibold px-8">
              <Link href="/blogs">
                <Compass className="h-5 w-5" />
                Explore Stories
              </Link>
            </Button>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <p className="text-sm text-primary">Scroll to explore</p>
            <ArrowDown className="h-5 w-5 text-primary" />
          </div>
        </div>
      </section>

      {/* SECTION 2 - FEATURES */}
      <section className="py-24 bg-paper-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section heading */}
          <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-20">
            Why Inkwell?
          </h2>

          {/* Features grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="p-8 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="mb-6">
                <PencilLine className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">
                Elegant Writing Experience
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Write with markdown support and real-time preview
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-8 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="mb-6">
                <BookOpen className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">
                Beautiful Design
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Clean, typography-focused layout that puts content first
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-8 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="mb-6">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">
                Share & Connect
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Publish instantly and share your stories with the world
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 3 - RECENT POSTS */}
      <section className="py-24 bg-paper-cream">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section heading */}
          <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-16">
            Latest Stories
          </h2>

          {/* Posts grid */}
          {isLoading ? (
            <PostListSkeleton count={3} />
          ) : recentPosts && recentPosts.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
              
              {/* View All button */}
              <div className="flex justify-center mt-12">
                <Button size="lg" asChild variant="outline">
                  <Link href="/blogs">
                    View All Posts
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg text-muted-foreground">
                Be the first to share your story! Sign up and start writing today.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4 - CTA SECTION */}
      <section className="py-24 bg-linear-to-b from-paper-white to-gold-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Ready to share your story?
          </h2>

          {/* Subtext */}
          <p className="text-lg text-muted-foreground mb-10">
            Join our community of writers today
          </p>

          {/* CTA Button */}
          <Button size="lg" asChild className="text-base font-semibold px-8 shadow-md hover:shadow-lg transition-all">
            <Link href="/auth/signup">
              <PenTool className="h-5 w-5 -rotate-95" />
              Get Started
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
