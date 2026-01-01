"use client";

import { api } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@heroicons/react/24/solid";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface CategoryFilterProps {
  selectedCategoryId: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export function CategoryFilter({
  selectedCategoryId,
  onCategoryChange,
}: CategoryFilterProps) {
  const { data: categories, isLoading } = api.category.list.useQuery();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="w-full">
        {/* Mobile: dropdown trigger skeleton */}
        <div className="md:hidden">
          <Skeleton className="h-12 w-full rounded-none" />
        </div>

        {/* Desktop: list skeleton */}
        <div className="hidden md:block space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-full rounded-none" />
          ))}
        </div>
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

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const selectedLabel = selectedCategory ? selectedCategory.name : "All Stories";

  return (
    <div className="w-full">
      {/* Mobile: Collapsible dropdown */}
      <div className="md:hidden">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="w-full flex items-center justify-between py-3 px-4 border border-border bg-background hover:bg-muted/30 transition-colors">
            <span className="text-xs font-bold font-mono uppercase tracking-widest truncate">
              {selectedLabel}
            </span>
            <svg 
              className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <nav className="flex flex-col border-x border-b border-border bg-background">
              <button
                onClick={() => {
                  onCategoryChange(null);
                  setIsOpen(false);
                }}
                className={cn(
                  "group flex items-center justify-between py-3 px-4 border-b border-border text-left transition-colors hover:bg-muted/30",
                  selectedCategoryId === null ? "bg-muted text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="text-xs font-bold font-mono uppercase tracking-widest">
                  [00] All Stories
                </span>
                {selectedCategoryId === null && <CheckIcon className="h-3 w-3" />}
              </button>

              {categories.map((category, index) => {
                const num = (index + 1).toString().padStart(2, '0');
                const isSelected = selectedCategoryId === category.id;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      onCategoryChange(category.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "group flex items-center justify-between py-3 px-4 border-b border-border last:border-b-0 text-left transition-colors hover:bg-muted/30",
                      isSelected ? "bg-muted text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="text-xs font-bold font-mono uppercase tracking-widest truncate">
                      [{num}] {category.name}
                    </span>
                    {isSelected && <CheckIcon className="h-3 w-3" />}
                  </button>
                );
              })}
            </nav>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Desktop: Full list */}
      <nav className="hidden md:flex flex-col border-t border-border">
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
          {selectedCategoryId === null && <CheckIcon className="h-3 w-3" />}
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
              {isSelected && <CheckIcon className="h-3 w-3" />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}