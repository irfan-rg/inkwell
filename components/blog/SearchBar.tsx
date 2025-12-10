"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "SEARCH...",
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(inputValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue, onChange]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className="relative w-full group">
      <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="pl-8 pr-8 h-10 w-full bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary text-sm font-mono uppercase tracking-wider placeholder:text-muted-foreground/50 transition-colors"
      />
      {inputValue && (
        <button
          onClick={() => {
            setInputValue("");
            onChange("");
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Clear</span>
        </button>
      )}
    </div>
  );
}