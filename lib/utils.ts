import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

/**
 * Merge Tailwind classes conditionally using clsx + tailwind-merge
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Format a date using date-fns. Defaults to a locale-friendly pattern ("PPP").
 */
export function formatDate(
  date: Date | string | number,
  pattern: string = "PPP"
): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return ""
  return format(d, pattern)
}

/**
 * Estimate reading time in whole minutes. Defaults to 200 WPM.
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
  const words = (text?.trim().match(/\S+/g) ?? []).length
  const minutes = Math.ceil(words / Math.max(1, wordsPerMinute))
  return Math.max(1, minutes)
}

/**
 * Generate a URL-safe slug from a string.
 */
export function generateSlug(input: string): string {
  return input
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumerics to hyphen
    .replace(/^-+|-+$/g, "") // trim hyphens
    .replace(/-{2,}/g, "-") // collapse repeats
}

/**
 * Truncate text to a maximum length. Optionally appends an ellipsis.
 */
export function truncateText(text: string, maxLength: number, addEllipsis: boolean = true): string {
  if (maxLength <= 0) return ""
  if (text.length <= maxLength) return text
  if (!addEllipsis) return text.slice(0, maxLength)
  const ellipsis = "…"
  const sliceLength = Math.max(0, maxLength - ellipsis.length)
  return text.slice(0, sliceLength).trimEnd() + ellipsis
}
