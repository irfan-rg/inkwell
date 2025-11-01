"use client";

import { useState } from "react";
import { api } from "@/lib/trpc";
import { PostList } from "@/components/blog/PostList";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { SearchBar } from "@/components/blog/SearchBar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Filter, X } from "lucide-react";

export default function BlogsPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
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
    setCurrentPage(1); // Reset to first page
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page
  };

  const clearAllFilters = () => {
    setSelectedCategoryId(null);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategoryId !== null || searchQuery !== "";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-primary/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Explore Stories
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Discover insightful articles from our community
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search posts by title or content..."
          />
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Filter by Category
            </h2>
          </div>
          <CategoryFilter
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        <Separator className="my-8" />

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground">
            {isLoading ? (
              <span>Loading posts...</span>
            ) : (
              <span>
                Showing {posts?.length || 0} post{posts?.length !== 1 ? "s" : ""}{" "}
                {currentPage > 1 && `(Page ${currentPage})`}
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="mr-2 h-4 w-4" />
              Clear all filters
            </Button>
          )}
        </div>

        {/* Posts Grid */}
        <PostList
          posts={posts || []}
          loading={isLoading}
          showAuthor={true}
          emptyMessage={hasActiveFilters ? "No posts found" : "No posts yet"}
          emptyDescription={
            hasActiveFilters
              ? "Try adjusting your filters or search query"
              : "There are no published posts at the moment. Check back soon for new content!"
          }
          emptyIcon={hasActiveFilters ? "search" : "default"}
        />

        {/* Pagination */}
        {posts && posts.length > 0 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
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
      </div>
    </div>
  );
}
