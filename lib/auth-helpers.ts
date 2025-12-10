import type { User } from "@supabase/supabase-js";

/**
 * Get the display name for an author from their user object.
 * Falls back to email username if name is not set in user metadata.
 * 
 * @param user - Supabase user object
 * @returns Author's display name
 */
export function getAuthorName(user: User | null | undefined): string {
  if (!user) return "Anonymous";
  return user.user_metadata?.name || user.email?.split('@')[0] || "Anonymous";
}

/**
 * Get the email address of an author.
 * 
 * @param user - Supabase user object
 * @returns Author's email address or empty string
 */
export function getAuthorEmail(user: User | null | undefined): string {
  return user?.email || "";
}

/**
 * Get initials from an author's name for avatar display.
 * Returns first letters of first and last name (e.g., "John Doe" -> "JD").
 * If only one word, returns first 2 letters.
 * 
 * @param user - Supabase user object
 * @returns Uppercase initials (2 characters)
 */
export function getAuthorInitials(user: User | null | undefined): string {
  const name = getAuthorName(user);
  
  // Split name into words
  const words = name.trim().split(/\s+/);
  
  if (words.length >= 2) {
    // First letter of first name + first letter of last name
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  } else if (words.length === 1 && words[0].length >= 2) {
    // First two letters of single name
    return words[0].substring(0, 2).toUpperCase();
  } else if (words.length === 1 && words[0].length === 1) {
    // Single character, duplicate it
    return (words[0][0] + words[0][0]).toUpperCase();
  }
  
  return "UA"; // Unknown Author
}
