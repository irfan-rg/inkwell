"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/trpc";
import { PostCard } from "@/components/blog/PostCard";
import { PenTool, BookOpen, Users, Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  // Fetch recent published posts
  const { data: recentPosts, isLoading } = api.post.list.useQuery({
    published: true,
    limit: 6,
  });

  return (
    <div className="min-h-screen">
      {/* SECTION 1 - HERO */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-linear-to-br from-primary/10 via-background to-primary/5">
        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>Welcome to Inkwell</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Share Your Stories
              <br />
              <span className="text-primary">with the World</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A modern platform for writers and readers to connect through the
              power of words
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" asChild className="text-lg px-8">
                <Link href="/auth/signup">
                  <PenTool className="mr-2 h-5 w-5" />
                  Start Writing
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <Link href="/blogs">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore Stories
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - FEATURES */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Inkwell?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to share your ideas and connect with readers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-background p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <PenTool className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rich Text Editor</h3>
              <p className="text-muted-foreground">
                Write with powerful markdown support and see your content come
                to life
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-background p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Beautiful Design</h3>
              <p className="text-muted-foreground">
                Clean, distraction-free reading experience for your audience
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-background p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
              <p className="text-muted-foreground">
                Simple, intuitive interface that lets you focus on writing
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-background p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Share & Connect</h3>
              <p className="text-muted-foreground">
                Build your audience and engage with a community of readers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - RECENT POSTS */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Latest Stories
              </h2>
              <p className="text-lg text-muted-foreground">
                Discover what our community is writing about
              </p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link href="/blogs">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4 animate-pulse">
                  <div className="h-48 bg-muted rounded-lg" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : recentPosts && recentPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentPosts.map((post) => (
                  <PostCard key={post.id} post={post} showAuthor={true} />
                ))}
              </div>
              <div className="text-center mt-12">
                <Button size="lg" asChild>
                  <Link href="/blogs">
                    View All Posts
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>No posts yet. Be the first to share your story!</p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4 - CTA */}
      <section className="py-20 bg-linear-to-br from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Ready to Start Writing?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join our community of writers today and share your unique voice
              with the world
            </p>
            <Button size="lg" asChild className="text-lg px-8">
              <Link href="/auth/signup">
                <PenTool className="mr-2 h-5 w-5" />
                Get Started for Free
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
