"use client";

import { useState } from "react";
import { api } from "@/lib/trpc";
import { PostCard } from "@/components/blog/PostCard";
import { PostListSkeleton } from "@/components/ui/post-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { SearchBar } from "@/components/blog/SearchBar";
import { Button } from "@/components/ui/button";
import { FileText, X } from "lucide-react";

export default function BlogsPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12;

  // Fetch posts with filters (fetch limit + 1 to check for more)
  const { data: postsData, isLoading } = api.post.list.useQuery({
    published: true,
    categoryId: selectedCategoryId || undefined,
    search: searchQuery || undefined,
    limit: limit + 1,
    offset: (currentPage - 1) * limit,
  });

  // Check if there are more posts and slice to show only limit
  const hasMore = postsData && postsData.length > limit;
  const posts = postsData ? postsData.slice(0, limit) : [];

  // Handle filter changes
  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedCategoryId(null);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategoryId !== null || searchQuery !== "";

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="bg-linear-to-b from-paper-cream to-paper-white py-16 md:py-24 text-center">
        <div className="max-w-4xl mx-auto px-6">
          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
            Stories & Insights
          </h1>

          {/* Subheading */}
          <p className="text-xl text-muted-foreground">
            Explore our collection of stories
          </p>
        </div>
      </section>

      {/* SEARCH & FILTER SECTION */}
      <section className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="bg-paper-white rounded-xl shadow-lg border p-6">
          {/* SearchBar */}
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search posts by title or content..."
          />

          {/* CategoryFilter below search */}
          <div className="mt-4">
            <CategoryFilter
              selectedCategoryId={selectedCategoryId}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          {/* Clear filters button */}
          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground"
              >
                <X className="mr-2 h-4 w-4" />
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* POSTS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {/* Results header */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-sm text-muted-foreground">
            {isLoading ? (
              "Loading posts..."
            ) : (
              `Showing ${posts.length} post${posts.length !== 1 ? "s" : ""}`
            )}
          </p>
        </div>

        {/* Posts grid */}
        {isLoading ? (
          <PostListSkeleton count={6} />
        ) : posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="No posts found"
            description="Try adjusting your filters"
          />
        )}

        {/* Pagination */}
        {posts.length > 0 && (
          <div className="mt-12 flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <span className="flex items-center px-4 text-sm text-muted-foreground">
              Page {currentPage}
            </span>

            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={!hasMore}
            >
              Next
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
