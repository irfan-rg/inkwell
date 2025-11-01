# 🧪 STEP 6 - Testing Checklist

## ✅ Public Pages Testing

### 1. Landing Page (/)
- [ ] Visit http://localhost:3000/
- [ ] Check hero section with gradient background
- [ ] Verify "Start Writing" button links to /auth/signup
- [ ] Verify "Explore Stories" button links to /blogs
- [ ] Check features section displays 4 cards
- [ ] Verify recent posts section shows up to 6 posts
- [ ] Check "View All Posts" button works
- [ ] Verify final CTA section with "Get Started" button
- [ ] Test responsive design on mobile (DevTools)
- [ ] Verify navbar appears with Inkwell logo

### 2. Blog Listing Page (/blogs)
- [ ] Visit http://localhost:3000/blogs
- [ ] Verify hero section with "Explore Stories" heading
- [ ] Check search bar is prominent and functional
- [ ] Test typing in search (should have 300ms debounce)
- [ ] Verify clear button (X) appears when typing
- [ ] Check category filter chips load
- [ ] Click "All Posts" - should show all posts
- [ ] Click a specific category - should filter posts
- [ ] Verify "Clear all filters" button appears when filtering
- [ ] Check post count updates ("Showing X posts")
- [ ] Verify posts display in grid (1 col mobile, 2 tablet, 3 desktop)
- [ ] Test pagination (Previous/Next buttons)
- [ ] Check loading skeleton while fetching
- [ ] Verify empty state if no posts match filters

### 3. Individual Post Page (/blogs/[slug])
- [ ] Click on a post from listing page
- [ ] Verify "Back to Blogs" button works
- [ ] Check cover image displays (if exists)
- [ ] Verify post title is large and bold
- [ ] Check excerpt displays below title
- [ ] Verify author avatar with initials
- [ ] Check author name displays
- [ ] Verify date published shows correctly
- [ ] Check reading time calculation (X min read)
- [ ] Test "Share" button functionality
- [ ] Verify markdown content renders properly:
  - [ ] Headings (H1, H2, H3)
  - [ ] Bold and italic text
  - [ ] Links
  - [ ] Code blocks
  - [ ] Lists
  - [ ] Images
- [ ] Check category badges display
- [ ] Verify "Last updated" timestamp (if different from created)
- [ ] Check "Topics" section in footer
- [ ] Test "Share article" button at bottom
- [ ] Verify related posts section shows (if same category)
- [ ] Check related posts display correctly
- [ ] Test responsive design on mobile

### 4. Navbar Testing
- [ ] Verify Inkwell logo links to home
- [ ] Check "Blogs" link in navbar
- [ ] Test active state on Blogs link (primary color + underline)
- [ ] When logged out:
  - [ ] Verify "Login" button appears
- [ ] When logged in:
  - [ ] Verify "Dashboard" link appears
  - [ ] Check active state on Dashboard link
  - [ ] Verify user avatar with initials
  - [ ] Click avatar to open dropdown
  - [ ] Check "Dashboard" option in dropdown
  - [ ] Check "Profile" option in dropdown
  - [ ] Verify "Logout" button (red color)
  - [ ] Test logout functionality
- [ ] Check theme toggle button works
- [ ] Test mobile menu:
  - [ ] Click hamburger icon
  - [ ] Verify drawer opens from right
  - [ ] Check backdrop darkens screen
  - [ ] Test closing by clicking backdrop
  - [ ] Verify links have active states
  - [ ] Check user info shows when logged in

### 5. Search & Filter Functionality
- [ ] Test search with post title keywords
- [ ] Test search with content keywords
- [ ] Verify search is case-insensitive
- [ ] Test search with partial words
- [ ] Combine search + category filter
- [ ] Check results update immediately (after debounce)
- [ ] Test clearing search
- [ ] Test clearing category filter
- [ ] Test "Clear all filters" button
- [ ] Verify empty state with helpful message when no results

### 6. Components Testing
- [ ] **CategoryFilter:**
  - [ ] All category buttons render
  - [ ] Active category is highlighted
  - [ ] Clear filter button appears when selected
  - [ ] Loading skeleton shows while fetching
- [ ] **SearchBar:**
  - [ ] Search icon on left
  - [ ] Clear button (X) on right when typing
  - [ ] Input is large and prominent
  - [ ] Placeholder text is clear
- [ ] **PostList:**
  - [ ] Posts display in responsive grid
  - [ ] Loading skeletons show during fetch
  - [ ] Empty state shows icon and message
  - [ ] Smooth fade-in animation
- [ ] **PostCard:**
  - [ ] Cover image displays
  - [ ] Title truncates properly
  - [ ] Excerpt shows (if available)
  - [ ] Author name displays
  - [ ] Date formatted correctly
  - [ ] Category badges show
  - [ ] Hover effect works
  - [ ] Click navigates to post

### 7. Performance & UX
- [ ] Page loads quickly
- [ ] No console errors
- [ ] Images load properly
- [ ] Smooth transitions and animations
- [ ] No layout shifts
- [ ] Mobile responsive (320px - 1920px)
- [ ] Dark mode works correctly
- [ ] All fonts load properly

### 8. Edge Cases
- [ ] Test with no posts published
- [ ] Test with no categories
- [ ] Test post with no cover image
- [ ] Test post with no excerpt
- [ ] Test post with very long title
- [ ] Test search with no results
- [ ] Test category filter with no posts
- [ ] Test post with no related posts
- [ ] Test broken image URLs (should have fallback)

---

## 🐛 Known Issues to Check

1. Make sure Supabase connection works
2. Verify tRPC endpoints respond correctly
3. Check authentication state persists
4. Ensure pagination works with filters
5. Verify markdown rendering is secure (no XSS)

---

## 🚀 Quick Test Script

```bash
# 1. Start dev server
npm run dev

# 2. Open browser to http://localhost:3000

# 3. Navigate through:
# - Landing page
# - /blogs (test search & filters)
# - Click a post
# - Test related posts
# - Check mobile view

# 4. Check console for errors
# 5. Test with different screen sizes
```

---

## 📝 Next Steps After Testing

- [ ] Fix any bugs found
- [ ] Optimize images
- [ ] Add meta tags for SEO
- [ ] Test with real content
- [ ] Check accessibility (a11y)
- [ ] Ready for Step 7!
