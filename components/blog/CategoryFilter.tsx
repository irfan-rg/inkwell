"use client";

import { api } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Folder, X } from "lucide-react";

interface CategoryFilterProps {
  selectedCategoryId: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export function CategoryFilter({
  selectedCategoryId,
  onCategoryChange,
}: CategoryFilterProps) {
  const { data: categories, isLoading } = api.category.list.useQuery();

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No categories available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 md:gap-3">
        {/* All Posts Button */}
        <Button
          variant={selectedCategoryId === null ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(null)}
          className="rounded-full"
        >
          <Folder className="mr-2 h-4 w-4" />
          All Posts
        </Button>

        {/* Category Buttons */}
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategoryId === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className="rounded-full"
          >
            {category.name}
          </Button>
        ))}

        {/* Clear Filter Button */}
        {selectedCategoryId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCategoryChange(null)}
            className="rounded-full"
          >
            <X className="mr-2 h-4 w-4" />
            Clear Filter
          </Button>
        )}
      </div>
    </div>
  );
}
