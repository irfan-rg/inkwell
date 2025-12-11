"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/trpc";
import { PostCard } from "@/components/blog/PostCard";
import { PostListSkeleton } from "@/components/ui/post-skeleton";
import { PencilIcon, BookOpenIcon, UsersIcon, ArrowDownIcon, ArrowRightIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { createClient } from "@/lib/supabase/client";
import { Footer } from "@/components/layout/Footer";

export default function LandingPage() {
  // Fetch recent published posts
  const { data: recentPosts, isLoading } = api.post.list.useQuery({
    published: true,
    limit: 6,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createClient();

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
      {/* SECTION 1 - HERO (Above the fold) */}
      <section className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-paper-cream via-paper-white to-paper-cream px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center pb-16 sm:pb-20">
          {/* Eyebrow text */}
          <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-widest mb-4 sm:mb-6 animate-fade-in">
            Welcome to
          </p>

          {/* Large heading - KEEP BIG */}
          <h1 
            className="text-6xl sm:text-7xl md:text-8xl font-display font-bold text-ink-black tracking-tight mb-4 animate-slide-up"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
          >
            Inkwell
          </h1>

          {/* Tagline */}
          <p className="text-lg sm:text-xl md:text-2xl font-display italic text-muted-foreground mt-4 mb-6">
            Where stories find their voice
          </p>

          {/* Description */}
          <p className="text-base sm:text-lg font-body text-ink-blue max-w-2xl mx-auto mt-6 leading-relaxed px-4">
            A sanctuary for writers and readers who appreciate the craft of storytelling
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10 px-4">
            <Button size="lg" asChild className="w-full sm:w-auto text-base font-semibold px-8 shadow-md hover:shadow-lg transition-all">
              <Link href={startWritingHref}>
                <PencilIcon className="mr-2 h-5 w-5" />
                Start Writing
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild className="w-full sm:w-auto text-base font-semibold px-8">
              <Link href="/blogs">
                <BookOpenIcon className="mr-2 h-5 w-5" />
                Explore Stories
              </Link>
            </Button>
          </div>

          {/* Scroll indicator - hidden on very small screens */}
          <div className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 animate-bounce">
            <p className="text-sm text-primary">Scroll to explore</p>
            <ArrowDownIcon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </section>

      {/* SECTION 2 - FEATURES */}
      <section className="py-16 sm:py-20 md:py-24 bg-paper-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold text-center mb-12 sm:mb-16">
            Why Inkwell?
          </h2>

          {/* Features grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <Card className="p-6 sm:p-8 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="mb-4 sm:mb-6">
                <PencilSquareIcon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-display font-semibold mb-2 sm:mb-3">
                Elegant Writing Experience
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Write with markdown support and real-time preview
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-6 sm:p-8 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="mb-4 sm:mb-6">
                <BookOpenIcon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-display font-semibold mb-2 sm:mb-3">
                Beautiful Design
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Clean, typography-focused layout that puts content first
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-6 sm:p-8 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="mb-4 sm:mb-6">
                <UsersIcon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-display font-semibold mb-2 sm:mb-3">
                Share & Connect
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Publish instantly and share your stories with the world
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 3 - RECENT POSTS */}
      <section className="py-16 sm:py-20 md:py-24 bg-paper-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold text-center mb-8 sm:mb-12">
            Latest Stories
          </h2>

          {/* Posts grid */}
          {isLoading ? (
            <PostListSkeleton count={6} />
          ) : recentPosts && recentPosts.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {recentPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
              
              {/* View All button */}
              <div className="flex justify-center mt-10 sm:mt-12">
                <Button size="lg" asChild variant="outline" className="w-full sm:w-auto">
                  <Link href="/blogs">
                    View All Posts
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <BookOpenIcon className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-base sm:text-lg text-muted-foreground px-4">
                Be the first to share your story! Sign up and start writing today.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4 - CTA SECTION */}
      <section className="py-16 sm:py-20 md:py-24 bg-linear-to-b from-paper-white to-gold-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold mb-4 sm:mb-6">
            Ready to share your story?
          </h2>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10">
            Join our community of writers today
          </p>

          {/* CTA Button */}
          <Button size="lg" asChild className="w-full sm:w-auto text-base font-semibold px-8 shadow-md hover:shadow-lg transition-all">
            <Link href="/auth/signup">
              <PencilIcon className="mr-2 h-5 w-5" />
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
