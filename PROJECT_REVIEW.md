# RhinoMovies — Project Review & Architecture Documentation

> A full project breakdown covering architecture, tech stack, current features, and actionable improvement ideas.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [Data Flow](#4-data-flow)
5. [Current Features](#5-current-features)
6. [What's Missing / Can Be Improved](#6-whats-missing--can-be-improved)
7. [What Can Be Added](#7-what-can-be-added)
8. [Security Concerns](#8-security-concerns)
9. [Performance Notes](#9-performance-notes)

---

## 1. Project Overview

**RhinoMovies** is a movie and TV show discovery web application built on **Next.js 16** using the **TMDB (The Movie Database) API**. It allows users to browse trending content, search movies and TV shows, view detailed information, and explore cast members — all wrapped in a responsive dark/light-themed UI.

- **Live URL:** Defined in README (Vercel deployment)
- **License:** MIT
- **Analytics:** Vercel Analytics
- **External API:** TMDB v3

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.0.8 |
| UI Library | React | 19.2.1 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Icons | react-icons | 5.5.0 |
| Theme | next-themes | 0.4.6 |
| Analytics | @vercel/analytics | 1.5.0 |
| Linter | ESLint v9 + Next.js config | — |
| Formatter | Prettier v3.7.4 + Tailwind plugin | — |
| Build Tool | Turbopack (via Next.js) | — |
| Deployment | Vercel | — |
| Data Source | TMDB REST API v3 | — |

**No database.** No ORM. No authentication library. No external state manager.

---

## 3. Architecture

### 3.1 Directory Structure

```
rhinomovies/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout — wraps with ThemeProvider & SearchContext
│   │   ├── page.tsx                # Root page — redirects to /home
│   │   ├── globals.css             # Global styles, CSS variables, Tailwind base
│   │   │
│   │   ├── home/                   # Homepage (Server Component)
│   │   │   ├── layout.tsx          # Home layout
│   │   │   └── page.tsx            # Trending, now playing, upcoming — SSR with Promise.all
│   │   │
│   │   ├── movies/                 # Movies section
│   │   │   ├── page.tsx            # Browse & search movies (Client Component)
│   │   │   └── [id]/page.tsx       # Movie detail page (Server Component, dynamic)
│   │   │
│   │   ├── shows/                  # TV Shows section
│   │   │   ├── page.tsx            # Browse & search TV shows (Client Component)
│   │   │   └── [id]/page.tsx       # TV show detail page (Server Component, dynamic)
│   │   │
│   │   ├── topimdb/                # Top IMDb ratings page
│   │   │   └── page.tsx            # Client Component
│   │   │
│   │   └── api/                    # Internal API routes (Next.js Route Handlers)
│   │       ├── movies/route.ts     # GET /api/movies — delegates search/filter to TMDB
│   │       ├── tv/route.ts         # GET /api/tv — delegates search/filter to TMDB
│   │       ├── genres/route.ts     # GET /api/genres — cached 24h
│   │       └── countries/route.ts  # GET /api/countries — cached 24h
│   │
│   ├── components/                 # Shared UI components
│   │   ├── Navbar.tsx              # Sticky nav with mega menus, theme toggle
│   │   ├── MovieCard.tsx           # Polymorphic card for movie or TV show
│   │   ├── TVShowCard.tsx          # TV show variant card
│   │   ├── Searchbar.tsx           # Debounced search input tied to SearchContext
│   │   ├── Pagination.tsx          # Page controls with windowed page buttons
│   │   ├── Footer.tsx              # Footer with links and disclaimer
│   │   ├── ThemeProvider.tsx       # next-themes wrapper + ModeToggle component
│   │   ├── Loader.tsx              # Full-height loading spinner
│   │   ├── Title.tsx               # Styled section heading
│   │   ├── ScrollToTop.tsx         # Fixed scroll-to-top button
│   │   └── ComingSoon.tsx          # Placeholder component
│   │
│   ├── context/
│   │   └── SearchContext.tsx       # Global search state via React Context
│   │
│   ├── lib/
│   │   └── tmdb/                   # TMDB API client layer
│   │       ├── client.ts           # Base fetch wrapper with Bearer auth
│   │       ├── movies.ts           # All movie-related API calls
│   │       ├── tv.ts               # All TV show-related API calls
│   │       └── trending.ts         # Trending endpoint
│   │
│   └── types/                      # TypeScript type definitions
│       ├── movie.ts                # Movie, MovieDetails, MovieCredits
│       ├── tv.ts                   # TVShow, TVShowDetails, TVShowCredits
│       ├── cast.ts                 # Cast member interface
│       ├── common.ts               # TMDBBase, MediaType, PaginatedResponse<T>
│       └── interface.d.ts          # Additional type declarations
│
├── public/                         # Static assets
├── .env.local                      # NEXT_PUBLIC_TMDB_TOKEN
├── next.config.ts                  # Image remote patterns
├── tsconfig.json                   # TypeScript config
├── tailwind.config (inline)        # Tailwind v4 via PostCSS
├── .prettierrc                     # Code formatting rules
└── eslint.config.mjs               # ESLint flat config
```

---

### 3.2 Rendering Strategy

| Route | Rendering | Why |
|---|---|---|
| `/home` | **SSR (Server Component)** | Fetch trending/now-playing data on every request |
| `/movies` | **CSR (Client Component)** | Dynamic search + pagination with user state |
| `/movies/[id]` | **SSR (Server Component)** | `no-store` cache — always fresh movie detail |
| `/shows` | **CSR (Client Component)** | Dynamic search + pagination with user state |
| `/shows/[id]` | **SSR (Server Component)** | `no-store` cache — always fresh TV detail |
| `/topimdb` | **CSR (Client Component)** | Paginated browsing |
| `/api/genres` | **ISR** | 24-hour `revalidate` — genres rarely change |
| `/api/countries` | **ISR** | 24-hour `revalidate` — regions rarely change |

---

### 3.3 Component Hierarchy

```
RootLayout (layout.tsx)
└── ThemeProvider
    └── SearchProvider
        ├── Navbar
        │   ├── ModeToggle
        │   └── Genre/Country Mega Menus
        ├── [Page Content]
        │   ├── HomePage
        │   │   └── MovieCard[]
        │   ├── MoviesPage
        │   │   ├── Searchbar
        │   │   ├── MovieCard[]
        │   │   └── Pagination
        │   ├── MovieDetailPage
        │   │   └── Cast list
        │   ├── ShowsPage
        │   │   ├── Searchbar
        │   │   ├── TVShowCard[]
        │   │   └── Pagination
        │   └── ShowDetailPage
        │       └── Cast list
        └── Footer
```

---

### 3.4 API Client Design

The TMDB client (`src/lib/tmdb/client.ts`) is a thin wrapper:

```
Component/Page
     │
     ▼
lib/tmdb/movies.ts  ──►  tmdbFetch()  ──►  TMDB API v3
lib/tmdb/tv.ts              │
lib/tmdb/trending.ts        └── Authorization: Bearer <token>
                                 + query params
                                 + Next.js cache options
```

Internal API routes (`/api/*`) serve as a proxy layer between client-side components and TMDB, keeping the token server-side.

---

## 4. Data Flow

### Homepage (SSR)

```
Browser Request
     │
     ▼
home/page.tsx (Server)
     │
     ▼
Promise.all([
  getTrendingAll(),
  getNowPlaying(),
  getTrendingTV(),
  getUpcoming()
])
     │
     ▼
TMDB API
     │
     ▼
Rendered HTML with data → Browser
```

### Browse Page (CSR with internal API)

```
User types in Searchbar
     │  (400ms debounce)
     ▼
SearchContext.setQuery()
     │
     ▼
movies/page.tsx useEffect
     │
     ▼
fetch('/api/movies?query=...&page=...')
     │
     ▼
api/movies/route.ts (Server)
     │
     ▼
TMDB searchMovies() or getTopRated()
     │
     ▼
JSON response → MovieCard grid + Pagination
```

### Detail Page (SSR, no-store)

```
Browser navigates to /movies/[id]
     │
     ▼
movies/[id]/page.tsx (Server)
     │
     ▼
Promise.all([getMovieById(id), getMovieCredits(id)])
     │
     ▼
TMDB API (fresh, no cache)
     │
     ▼
Full detail page HTML → Browser
```

---

## 5. Current Features

### Content Discovery
- Trending movies and TV shows (daily/weekly)
- Now-playing movies section on homepage
- Upcoming movies section on homepage
- Currently-airing TV shows
- Top-rated movies and TV shows browsing (`/movies`, `/shows`)
- Top IMDb page (`/topimdb`)

### Search
- Real-time search on movies and shows pages
- Debounced input (400ms) with AbortController cancellation
- Search falls through to top-rated list when query is empty

### Detail Pages
- Full movie detail: title, overview, genres, runtime, release date, production countries, rating bar
- Full TV show detail: title, overview, genres, seasons, episodes, first air date, production companies
- Top 8 cast members with profile photos and character names
- Backdrop image with blur/overlay effect
- "Watch Now" and "Add to Favourites" buttons (currently non-functional UI placeholders)

### Navigation
- Sticky navbar with scroll-hide behavior
- Genre mega menu (fetched and cached from TMDB)
- Country mega menu (fetched and cached from TMDB)
- Mobile-responsive hamburger menu
- Dark / Light theme toggle

### UI & UX
- Responsive grid layout (2–7 columns depending on viewport)
- Dark and light theme (system-aware with manual toggle)
- Loading spinner for async states
- Scroll-to-top floating button
- Graceful 404 handling for invalid movie/show IDs
- Empty state and error state handling on browse pages
- Windowed pagination (max 10 visible page buttons, capped at 500 for TMDB limits)

### Code Quality
- Full TypeScript coverage with strict mode
- Separated concerns: API client, types, context, components
- Prettier + ESLint enforced
- Vercel Analytics integrated

---

## 6. What's Missing / Can Be Improved

### 6.1 Critical / High Priority

| Issue | Detail |
|---|---|
| **TMDB token is `NEXT_PUBLIC_*`** | Using `NEXT_PUBLIC_TMDB_TOKEN` exposes the API key to the browser bundle. It should be `TMDB_TOKEN` (no `NEXT_PUBLIC_` prefix) and only used server-side in API routes and Server Components. |
| **"Watch Now" button is a dead link** | The button exists on every detail page but does nothing. It should either link to a streaming source, a trailer, or be removed until implemented. |
| **"Add to Favourites" is a dead link** | Same issue — no backend or localStorage to persist favourites. |
| **No real pagination on `/topimdb`** | The top IMDb page fetches data but pagination behavior is unclear/unfinished. |
| **`ComingSoon.tsx` is unused** | Dead component. Should be used on placeholder routes or deleted. |
| **`TVShowCard.tsx` may duplicate `MovieCard.tsx`** | Two card components for the same visual purpose. Should be merged into one polymorphic component (MovieCard already handles both). |
| **No SEO for browse pages** | `/movies` and `/shows` have no `<title>` or `<meta>` tags. Only detail pages have metadata generation. |
| **No error boundaries** | No React error boundaries. An uncaught render error on the homepage would crash the entire page. |

### 6.2 Code Quality

| Issue | Detail |
|---|---|
| **API calls from Client Components call internal `/api/*` routes** | This adds an unnecessary hop: Client → `/api/movies` → TMDB. Better to call TMDB directly from Server Components or route handlers. |
| **Inconsistent caching** | Detail pages use `no-store`; homepage uses default. There's no documented strategy. Define clear cache policies per route. |
| **`SearchContext` is globally shared** | The search state persists when navigating between Movies and Shows pages, which causes the shows page to load with the leftover movie search query. |
| **No loading.tsx files** | Next.js App Router supports `loading.tsx` for streaming skeletons. Currently only a `Loader` spinner is used inside components. |
| **Tailwind v4 config approach** | Tailwind v4 moves config inline into CSS — make sure the setup is fully leveraging this rather than mixing old v3 patterns. |
| **Unused `interface.d.ts`** | Appears redundant alongside the typed files in `types/`. |

### 6.3 UX Issues

| Issue | Detail |
|---|---|
| **No skeleton loading** | Content jumps in — should use skeleton placeholders while data loads for better perceived performance. |
| **Genre / Country menus don't filter content** | The mega menus list genres and countries but clicking them doesn't actually filter the movie/show list. They're purely decorative. |
| **No image fallback for missing cast photos** | If `profile_path` is null, cast cards may render broken or empty. |
| **Rating bar color is static** | The rating bar shows the same color regardless of score. A green/yellow/red gradient based on score would be more informative. |
| **Mobile nav menu has no close-on-outside-click** | The hamburger menu stays open when the user taps outside it. |

---

## 7. What Can Be Added

### 7.1 Must-Have Features (Core Product)

#### User Authentication & Profiles
- Email/password or OAuth (Google, GitHub) via **NextAuth.js** or **Clerk**
- User profile page showing saved watchlists and ratings
- TMDB supports linking user accounts via session tokens — you can delegate ratings and watchlists to TMDB itself

#### Watchlist / Favourites
- Save movies and shows to a personal list
- Can use **localStorage** (no account needed) or a real database for persistence
- Database options: **Supabase** (Postgres, free tier), **PlanetScale**, or **MongoDB Atlas**

#### Movie / Show Trailers
- TMDB provides `/movie/{id}/videos` — embed YouTube trailers on detail pages
- A "Watch Trailer" modal or section would immediately improve detail pages

#### Genre & Country Filtering
- The Navbar already fetches genres and countries — wire them up to filter the browse pages
- Add filter pills/chips on the movies/shows pages

#### Reviews & Ratings
- Show TMDB community reviews on detail pages (`/movie/{id}/reviews`)
- Allow logged-in users to submit their own ratings

---

### 7.2 Nice-to-Have Features

#### Advanced Search & Filters
- Filter by year range, rating, language, runtime
- Sort by: popularity, rating, release date, revenue
- Multi-genre filter (e.g., Action + Thriller)

#### "Similar" / "Recommended" Section
- TMDB exposes `/movie/{id}/similar` and `/movie/{id}/recommendations`
- Show these on detail pages as horizontal scrollable rows

#### Collections & Franchises
- TMDB supports movie collections (e.g., the Marvel or Harry Potter franchise)
- Link related movies together on detail pages

#### Streaming Availability
- TMDB provides `/movie/{id}/watch/providers` with streaming platform data per country
- Show Netflix/Disney+/Prime badges on detail and card views

#### Progressive Web App (PWA)
- Add `manifest.json` and a service worker
- Enables "Add to Home Screen" on mobile
- Offline support for cached pages

#### Infinite Scroll (Alternative to Pagination)
- Replace current pagination with `IntersectionObserver`-based infinite scroll on browse pages
- Pairs well with a "load more" button fallback

#### Notification System
- "Notify me when available" for upcoming movies
- Could use **web push notifications** or simple email reminders (Resend API)

#### Internationalization (i18n)
- TMDB supports content in multiple languages via `language` query param
- Add language selector, use Next.js `i18n` routing

#### Admin / Curated Lists
- Manually curated "Editor's Pick" or "Hidden Gems" lists
- Simple CMS (e.g., **Contentlayer**, **Sanity**, or just a JSON file in the repo)

---

### 7.3 Technical Improvements

| Improvement | Approach |
|---|---|
| **Skeleton loaders** | Use Tailwind `animate-pulse` divs that match card dimensions |
| **React Query / SWR** | Replace manual `useEffect` fetches with SWR for automatic caching, revalidation, and deduplication |
| **Image optimization** | Add `sizes` prop to all `<Image>` components for proper responsive srcsets |
| **OpenGraph / Twitter cards** | Add OG images on detail pages for social sharing previews |
| **Sitemap & robots.txt** | Add `sitemap.ts` and `robots.ts` in the `app/` directory for SEO |
| **Rate limiting on API routes** | Add basic rate limiting (Upstash Redis) to prevent abuse of internal `/api/*` routes |
| **Error monitoring** | Integrate **Sentry** for frontend error tracking |
| **Search suggestions** | Show a dropdown of title suggestions while typing in the Searchbar |
| **Storybook** | Document and visually test components in isolation |
| **Testing** | Add unit tests (Vitest) for API client functions and integration tests (Playwright/Cypress) for key flows |

---

## 8. Security Concerns

| Concern | Severity | Fix |
|---|---|---|
| `NEXT_PUBLIC_TMDB_TOKEN` is exposed client-side | **High** | Rename to `TMDB_TOKEN`, use only in Server Components and API routes |
| No input sanitization on search query params | Medium | Sanitize and validate `query` and `page` params in API route handlers |
| No rate limiting on internal API routes | Medium | Add Upstash or simple in-memory rate limiter |
| No Content Security Policy headers | Low | Add CSP headers in `next.config.ts` via `headers()` |
| Footer mentions 3rd-party hosting disclaimer | Info | Ensure ToS compliance with TMDB API usage terms |

---

## 9. Performance Notes

### Current Optimizations
- Turbopack build tool (faster HMR in dev)
- `next/image` for automatic image optimization and lazy loading
- Genre/country lists cached for 24 hours (ISR)
- Debounced search (400ms) with AbortController
- `Promise.all()` for parallel API calls on homepage
- TMDB page limit capped at 500 (API constraint)

### Recommended Improvements

| Optimization | Impact |
|---|---|
| Add `sizes` to all `<Image>` tags | Prevents downloading oversized images on mobile |
| Use `loading.tsx` + Suspense boundaries | Enables streaming HTML for faster TTFB |
| Implement SWR/React Query caching | Eliminates redundant fetches on back-navigation |
| Add `<link rel="preconnect">` for TMDB image CDN | Reduces DNS lookup time for images |
| Lazy-load below-the-fold sections on homepage | Reduces initial JS payload |
| Use `next/font` for typography | Eliminates CLS from font swaps |

---

*This document was generated as of May 2026 against the `main` branch of RhinoMovies.*
