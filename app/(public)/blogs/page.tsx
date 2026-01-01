"use client";

import React, { useState } from "react";
import { api } from "@/lib/trpc";
import { PostCard } from "@/components/blog/PostCard";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { SearchBar } from "@/components/blog/SearchBar";
import { Button } from "@/components/ui/button";
import { PostSkeleton } from "@/components/ui/post-skeleton";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

export default function BlogsPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6; // Even number for 2-col grid

  const { data: postsData, isLoading } = api.post.list.useQuery({
    published: true,
    categoryId: selectedCategoryId || undefined,
    search: searchQuery || undefined,
    limit: limit + 1,
    offset: (currentPage - 1) * limit,
  });

  const { data: totalCount } = api.post.count.useQuery({
    published: true,
    categoryId: selectedCategoryId || undefined,
    search: searchQuery || undefined,
  });

  const hasMore = postsData && postsData.length > limit;
  const posts = postsData ? postsData.slice(0, limit) : [];

  // Scroll to top when page changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);
  };

  const handleSearchChange = React.useCallback((q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  }, []);

  return (
    <div className="min-h-screen bg-background border-t border-border">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-64px)]">
        
        {/* Left Sidebar: Navigation & Filters */}
        <div className="lg:col-span-3 border-r border-border bg-background lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] overflow-y-auto">
          <div className="p-6 md:p-8 space-y-12">
            <div>
              <h1 className="text-5xl font-display font-black tracking-tighter uppercase mb-2">
                The Archive
              </h1>
              <p className="text-xs font-mono text-muted-foreground leading-relaxed border-l-2 border-primary pl-3 mt-4">
                Curated thoughts, tutorials, and insights on modern development and design.
              </p>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Search
                </label>
                <SearchBar
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Topics
                </label>
                <CategoryFilter
                  selectedCategoryId={selectedCategoryId}
                  onCategoryChange={handleCategoryChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Content: Feed */}
        <div className="lg:col-span-9 flex flex-col">
          {/* Status Bar */}
          <div className="border-b border-border p-4 flex justify-between items-center bg-muted/5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
              {isLoading ? "Syncing..." : `Displaying ${posts.length} entries`}
            </span>
            <div className="flex gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-foreground">
                Total {totalCount || 0} stories
              </span>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid md:grid-cols-2 border-b border-x border-border lg:border-l-0 bg-border gap-px">
                {Array.from({ length: 6 }).map((_, i) => (
                  <PostSkeleton key={i} borderless />
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="grid md:grid-cols-2 border-b border-x border-border lg:border-l-0 bg-border gap-px">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} borderless />
                ))}
              </div>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center border-b border-border">
                <p className="font-display text-2xl font-bold text-muted-foreground mb-2">No entries found</p>
                <p className="text-sm text-muted-foreground">Adjust filters to see more results</p>
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          <div className="p-4 sm:p-8 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center items-stretch bg-background">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-none border-foreground hover:bg-foreground hover:text-background font-mono text-xs uppercase tracking-widest h-10 w-full sm:w-32"
            >
              <ArrowLeftIcon className="mr-2 h-3 w-3" /> Previous
            </Button>
            
            <span className="font-mono text-xs font-bold text-center">
              Page {currentPage}
            </span>

            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={!hasMore}
              className="rounded-none border-foreground hover:bg-foreground hover:text-background font-mono text-xs uppercase tracking-widest h-10 w-full sm:w-32"
            >
              Next <ArrowRightIcon className="ml-2 h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
