import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PenSquare, BookOpen, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="flex justify-center">
              <PenSquare className="h-16 w-16 text-primary" />
            </div>
            
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
              Welcome to <span className="text-primary">Inkwell</span>
            </h1>
            
            <p className="text-xl text-muted-foreground">
              A modern blogging platform for writers and readers who love great content.
              Share your stories, connect with readers, and build your audience.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/auth/signup">
                  Get Started
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/blogs">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Blogs
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Why Choose Inkwell?
            </h2>
            
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-4 text-center">
                <div className="flex justify-center">
                  <PenSquare className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Easy Writing</h3>
                <p className="text-muted-foreground">
                  Write with markdown, add images, and publish beautiful posts in minutes.
                </p>
              </div>
              
              <div className="space-y-4 text-center">
                <div className="flex justify-center">
                  <BookOpen className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Organized Content</h3>
                <p className="text-muted-foreground">
                  Categorize your posts and help readers discover your best content.
                </p>
              </div>
              
              <div className="space-y-4 text-center">
                <div className="flex justify-center">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Beautiful Design</h3>
                <p className="text-muted-foreground">
                  Dark mode, responsive layout, and a clean reading experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto max-w-2xl space-y-6">
              <h2 className="text-3xl font-bold">
                Ready to Share Your Stories?
              </h2>
              <p className="text-lg text-muted-foreground">
                Join Inkwell today and start writing. It's free and takes less than a minute.
              </p>
              <Button asChild size="lg">
                <Link href="/auth/signup">
                  Create Your Account
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
