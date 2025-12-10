"use client";

import { api } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

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
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-full rounded-none" />
        ))}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-sm text-muted-foreground font-mono uppercase border border-dashed border-border p-4 text-center">
        No categories
      </div>
    );
  }

  return (
    <nav className="flex flex-col border-t border-border">
      <button
        onClick={() => onCategoryChange(null)}
        className={cn(
          "group flex items-center justify-between py-3 border-b border-border text-left transition-colors hover:bg-muted/30",
          selectedCategoryId === null ? "text-primary" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <span className="text-xs font-bold font-mono uppercase tracking-widest">
          [00] All Stories
        </span>
        {selectedCategoryId === null && <Check className="h-3 w-3" />}
      </button>

      {categories.map((category, index) => {
        const num = (index + 1).toString().padStart(2, '0');
        const isSelected = selectedCategoryId === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "group flex items-center justify-between py-3 border-b border-border text-left transition-colors hover:bg-muted/30",
              isSelected ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="text-xs font-bold font-mono uppercase tracking-widest truncate max-w-[80%]">
              [{num}] {category.name}
            </span>
            {isSelected && <Check className="h-3 w-3" />}
          </button>
        );
      })}
    </nav>
  );
}