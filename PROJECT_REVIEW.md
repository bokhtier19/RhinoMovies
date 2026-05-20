# RhinoMovies — Project Review & Architecture Documentation

> A full project breakdown covering architecture, tech stack, current features, and actionable improvement ideas.

---

## Table of Contents

0. [Your Backlog](#0-your-backlog)
1. [Fixes Applied (Session Log)](#fixes-applied-session-log)
2. [Project Overview](#1-project-overview)
3. [Tech Stack](#2-tech-stack)
4. [Architecture](#3-architecture)
5. [Data Flow](#4-data-flow)
6. [Current Features](#5-current-features)
7. [What's Missing / Can Be Improved](#6-whats-missing--can-be-improved)
8. [What Can Be Added](#7-what-can-be-added)
9. [Security Concerns](#8-security-concerns)
10. [Performance Notes](#9-performance-notes)

---

## 0. Your Backlog

> **This section is yours to edit.** Drop ideas, requests, and priorities here. Use any format you like — checkboxes, bullets, notes. Claude will use this as context in future sessions.

_Add your own below this line:_

---

## Fixes Applied (Session Log)

> Tracks every change made by Claude in dev sessions. Newest first.

---

### Session — May 20, 2026 (Pass 2 — Section 6 Issues)

#### Fix 4 — TMDB token security (`src/lib/tmdb/client.ts`, `.env.local`)
Renamed `NEXT_PUBLIC_TMDB_TOKEN` → `TMDB_TOKEN`. The `NEXT_PUBLIC_` prefix caused Next.js to embed the token in the client-side JS bundle. Now server-side only.

#### Fix 5 — Watch Now → YouTube trailer modal (`src/components/TrailerModal.tsx`, `WatchButton.tsx`)
Added `getMovieVideos` / `getTVVideos` TMDB functions. Created `TrailerModal` (keyboard-dismissable iframe embed) and `WatchButton` (client component). Both detail pages now fetch the first official YouTube trailer and open it in a modal. Button is disabled with reduced opacity when no trailer is available.

#### Fix 6 — Add to Watchlist → localStorage (`src/components/FavouriteButton.tsx`)
Created `FavouriteButton` client component. Reads/writes `rhino_favourites` key in localStorage. Toggles heart icon and border color. No account required. Works across page refreshes.

#### Fix 7 — Rating bar dynamic color (detail pages)
Rating bar fill color is now `green` (≥7), `amber` (4–7), or `red` (<4) instead of always green.

#### Fix 8 — Mobile nav close-on-outside-click (`src/components/Navbar.tsx`)
Added a `mousedown` listener on `document` that closes the mobile menu when the user taps outside it. Also closes on route change via `usePathname` effect.

#### Fix 9 — SearchContext query leak (`src/context/SearchContext.tsx`)
Search query now resets to `""` on every route change via `usePathname` + `useEffect`. Previously the query from `/movies` persisted when navigating to `/shows`.

#### Fix 10 — SEO for browse pages (layouts)
Added `export const metadata` to `src/app/movies/layout.tsx` and created `src/app/shows/layout.tsx` with proper title and description. Client components cannot export metadata, so it lives in the layout wrapper.

#### Fix 11 — Skeleton loading pages (`loading.tsx`)
Added `src/app/movies/loading.tsx`, `src/app/shows/loading.tsx`, `src/app/topimdb/loading.tsx`. Next.js App Router automatically shows these during navigation with `animate-pulse` card skeletons.

#### Fix 12 — Error boundary (`src/components/ErrorBoundary.tsx`)
Created a React class-based `ErrorBoundary` with "Try again" recovery. Wraps `<main>` in the root layout so a render error in any page doesn't crash the entire app.

#### Fix 13 — Deleted dead code
- Deleted `src/components/ComingSoon.tsx` (not imported anywhere)
- Deleted `src/components/TVShowCard.tsx` (duplicated `MovieCard.tsx`, not imported)
- Deleted `src/types/interface.d.ts` (duplicated types already in `movie.ts`, `tv.ts`, `cast.ts`)

---

### Session — May 20, 2026 (Pass 1 — Server fixes)

#### Fix 1 — TMDB response decompression (`src/lib/tmdb/client.ts`)

**Problem:** TMDB was returning gzip-compressed HTTP responses even though the client requested `accept-encoding: identity`. The code was concatenating raw `Buffer` chunks directly into a string (`raw += chunk`), which corrupted binary compressed data before passing it to `JSON.parse`. This caused all 4 homepage API calls to silently fail (the `safe()` wrapper swallowed errors and returned empty arrays), resulting in the "Failed to load content" message on every page load.

**Root cause of the silent crash:** `JSON.parse` was called inside a Node.js `EventEmitter` callback (`.on("end", ...)`), not inside the Promise executor. When it threw, the error became an uncaught exception instead of a rejected Promise — bypassing the retry logic and the `safe()` wrapper entirely, and flooding the server log with `⨯ uncaughtException` spam that destabilized Turbopack's worker process.

**Fix applied:**
- Collect response data as `Buffer[]` chunks instead of string concatenation
- Check `res.headers["content-encoding"]` and decompress with `node:zlib` (`gunzip` / `inflate` / `brotliDecompress`) before parsing
- Wrap `JSON.parse` in a `try/catch` so failures reject the Promise cleanly instead of escaping as uncaught exceptions
- Removed the `accept-encoding: identity` header since we now handle any encoding

**File changed:** `src/lib/tmdb/client.ts`

---

#### Fix 2 — In-memory response cache (`src/lib/tmdb/client.ts`)

**Problem:** Every page render (including HMR reloads in dev) triggered fresh TMDB network calls. Combined with the network being slow, this made every page load take 60–130 seconds.

**Fix applied:** Added a `Map`-based in-memory cache with a 1-hour TTL. After the first successful fetch, subsequent renders return instantly from cache without hitting TMDB. Cache is per-server-process (resets on server restart).

**File changed:** `src/lib/tmdb/client.ts`

---

#### Fix 3 — Turbopack corrupted source map (`[root-of-the-server]__b5d25fa5._.js`)

**Problem:** A Turbopack-generated SSR chunk consistently contained a corrupted source map (binary data where a JSON source map was expected). This caused a flood of `SyntaxError: Unexpected token` warnings on every request, which made the server logs unreadable and slowed HMR.

**Fix applied:** Cleared the `.next` cache folder and restarted the dev server. The corruption was in the cached build artifact, not in the source. The corrupted chunk was also masking real errors in stack traces because Turbopack couldn't map back to TypeScript source lines.

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
│   │   ├── layout.tsx              # Root layout — ThemeProvider, SearchProvider, ErrorBoundary
│   │   ├── page.tsx                # Root page — redirects to /home
│   │   ├── globals.css             # Global styles, CSS variables, Tailwind base
│   │   │
│   │   ├── home/                   # Homepage (Server Component)
│   │   │   ├── layout.tsx          # Home layout (SearchProvider wrapper)
│   │   │   └── page.tsx            # Trending, now playing, upcoming — SSR with Promise.all
│   │   │
│   │   ├── movies/                 # Movies section
│   │   │   ├── layout.tsx          # SEO metadata + SearchProvider
│   │   │   ├── loading.tsx         # Skeleton loader shown during navigation
│   │   │   ├── page.tsx            # Browse & search movies (Client Component)
│   │   │   └── [id]/page.tsx       # Movie detail — SSR, fetches trailer + credits in parallel
│   │   │
│   │   ├── shows/                  # TV Shows section
│   │   │   ├── layout.tsx          # SEO metadata + SearchProvider
│   │   │   ├── loading.tsx         # Skeleton loader shown during navigation
│   │   │   ├── page.tsx            # Browse & search TV shows (Client Component)
│   │   │   └── [id]/page.tsx       # TV show detail — SSR, fetches trailer + credits in parallel
│   │   │
│   │   ├── topimdb/                # Top IMDb ratings page
│   │   │   ├── loading.tsx         # Skeleton loader
│   │   │   └── page.tsx            # Client Component with pagination
│   │   │
│   │   └── api/                    # Internal API routes (Next.js Route Handlers)
│   │       ├── movies/route.ts     # GET /api/movies — search/filter delegated to TMDB
│   │       ├── tv/route.ts         # GET /api/tv — search/filter delegated to TMDB
│   │       ├── genres/route.ts     # GET /api/genres — cached 24h
│   │       └── countries/route.ts  # GET /api/countries — cached 24h
│   │
│   ├── components/                 # Shared UI components
│   │   ├── Navbar.tsx              # Sticky nav, mega menus, outside-click close, theme toggle
│   │   ├── MovieCard.tsx           # Polymorphic card for movie or TV show
│   │   ├── TrailerModal.tsx        # YouTube trailer iframe modal (Escape to close)
│   │   ├── WatchButton.tsx         # Client button — opens TrailerModal or disabled if no trailer
│   │   ├── FavouriteButton.tsx     # Client button — localStorage watchlist toggle with heart icon
│   │   ├── ErrorBoundary.tsx       # React class error boundary with "Try again" recovery
│   │   ├── Searchbar.tsx           # Debounced search input tied to SearchContext
│   │   ├── Pagination.tsx          # Page controls with windowed page buttons
│   │   ├── Footer.tsx              # Footer with links and disclaimer
│   │   ├── ThemeProvider.tsx       # next-themes wrapper + ModeToggle component
│   │   ├── Loader.tsx              # Full-height loading spinner
│   │   ├── Title.tsx               # Styled section heading
│   │   └── ScrollToTop.tsx         # Fixed scroll-to-top button
│   │
│   ├── context/
│   │   └── SearchContext.tsx       # Search state — resets automatically on route change
│   │
│   ├── lib/
│   │   └── tmdb/                   # TMDB API client layer
│   │       ├── client.ts           # https.get wrapper — gzip decompress, in-memory cache, retry
│   │       ├── movies.ts           # Movie API calls incl. getMovieVideos
│   │       ├── tv.ts               # TV API calls incl. getTVVideos
│   │       └── trending.ts         # Trending endpoint
│   │
│   └── types/                      # TypeScript type definitions
│       ├── movie.ts                # Movie, MovieDetails, MovieCredits
│       ├── tv.ts                   # TVShow, TVShowDetails, TVShowCredits
│       ├── cast.ts                 # Cast member interface
│       └── common.ts               # TMDBBase, MediaType, PaginatedResponse<T>
│
├── public/                         # Static assets
├── .env.local                      # TMDB_TOKEN (server-side only)
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
        ├── Navbar (outside-click close, route-aware)
        │   ├── ModeToggle
        │   └── Genre/Country Mega Menus → /movies?genre= / ?country=
        ├── ErrorBoundary
        │   └── [Page Content]
        │       ├── HomePage
        │       │   └── MovieCard[]
        │       ├── MoviesPage
        │       │   ├── Searchbar
        │       │   ├── MovieCard[]
        │       │   └── Pagination
        │       ├── MovieDetailPage
        │       │   ├── WatchButton → TrailerModal (YouTube embed)
        │       │   ├── FavouriteButton (localStorage)
        │       │   └── Cast list (with fallback avatars)
        │       ├── ShowsPage
        │       │   ├── Searchbar
        │       │   ├── MovieCard[]
        │       │   └── Pagination
        │       └── ShowDetailPage
        │           ├── WatchButton → TrailerModal (YouTube embed)
        │           ├── FavouriteButton (localStorage)
        │           └── Cast list (with fallback avatars)
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
Promise.all([
  getMovieById(id),
  getMovieCredits(id),  → cast list
  getMovieVideos(id)    → first YouTube trailer key
])
     │
     ▼
TMDB API (fresh, no cache)
     │
     ▼
Full detail page HTML → Browser
  WatchButton (client) receives trailerKey prop
  FavouriteButton (client) reads/writes localStorage
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
- Full movie detail: title, overview, genres, runtime, release date, production countries, dynamic rating bar
- Full TV show detail: title, overview, genres, seasons, episodes, first air date, production companies
- Top 10 cast members with profile photos and fallback avatars
- Backdrop image with blur/overlay effect
- **"Watch Trailer" button** — fetches YouTube trailer from TMDB `/videos`, opens in keyboard-dismissable modal. Greyed out if no trailer is found.
- **"Add to Watchlist" button** — saves to `localStorage` with heart icon toggle. Persists across refreshes. No account required.
- Rating bar color: green (≥7.0), amber (4.0–6.9), red (<4.0)

### Navigation
- Sticky navbar with scroll-hide behavior
- Genre mega menu (fetched and cached from TMDB) — links to `/movies?genre=`
- Country mega menu (fetched and cached from TMDB) — links to `/movies?country=`
- Mobile-responsive hamburger menu — closes on outside tap and route change
- Dark / Light theme toggle

### UI & UX
- Responsive grid layout (2–7 columns depending on viewport)
- Dark and light theme (system-aware with manual toggle)
- Skeleton loading pages (`loading.tsx`) for movies, shows, and topimdb routes
- Scroll-to-top floating button
- Graceful 404 handling for invalid movie/show IDs
- Empty state and error state handling on browse pages
- Windowed pagination (max 10 visible page buttons, capped at 500 for TMDB limits)
- Global `ErrorBoundary` with "Try again" recovery — prevents full-app crashes

### Code Quality
- Full TypeScript coverage with strict mode
- Separated concerns: API client, types, context, components
- Search context resets on route change — no query bleed between pages
- Prettier + ESLint enforced
- Vercel Analytics integrated

---

## 6. What's Missing / Can Be Improved

### 6.1 Critical / High Priority

| Status | Issue | Detail |
|---|---|---|
| ✅ **Fixed** | **TMDB token was `NEXT_PUBLIC_*`** | Renamed to `TMDB_TOKEN`. Server-side only now. |
| ✅ **Fixed** | **"Watch Now" was a dead button** | Opens YouTube trailer modal via TMDB `/videos` endpoint. Disabled (greyed) when no trailer exists. |
| ✅ **Fixed** | **"Add to Watchlist" was a dead button** | Reads/writes `localStorage`. Toggles heart icon. No account needed. |
| ✅ **Fixed** | **`ComingSoon.tsx` was unused** | Deleted. |
| ✅ **Fixed** | **`TVShowCard.tsx` duplicated `MovieCard.tsx`** | Deleted. `MovieCard` already handles both types. |
| ✅ **Fixed** | **No SEO for browse pages** | Added `metadata` export to `movies/layout.tsx` and created `shows/layout.tsx`. |
| ✅ **Fixed** | **No error boundaries** | `ErrorBoundary` class component wraps `<main>` in root layout with "Try again" recovery. |
| ℹ️ **Was fine** | **No real pagination on `/topimdb`** | Pagination was already implemented and working. |

### 6.2 Code Quality

| Status | Issue | Detail |
|---|---|---|
| ✅ **Fixed** | **`SearchContext` query leaked between pages** | `usePathname` effect now resets query to `""` on every route change. |
| ✅ **Fixed** | **No `loading.tsx` files** | Added for `/movies`, `/shows`, `/topimdb` — animated skeleton cards on navigation. |
| ✅ **Fixed** | **Unused `interface.d.ts`** | Deleted — types already existed in `movie.ts`, `tv.ts`, `cast.ts`. |
| 🔲 **Open** | **API calls from Client Components use internal `/api/*`** | Extra hop: Client → `/api/movies` → TMDB. Low priority while the architecture works. |
| 🔲 **Open** | **Inconsistent caching** | No documented cache strategy per route. Add comments to each route handler. |
| 🔲 **Open** | **Tailwind v4 config approach** | Verify no v3 patterns are mixed in. Low risk right now. |

### 6.3 UX Issues

| Status | Issue | Detail |
|---|---|---|
| ✅ **Fixed** | **Rating bar color was static** | Now green (≥7), amber (4–7), red (<4) dynamically. |
| ✅ **Fixed** | **Mobile nav had no close-on-outside-click** | `mousedown` listener on `document` closes it on outside tap. Also closes on route change. |
| ✅ **Fixed** | **No skeleton loading** | `loading.tsx` files added for movies, shows, topimdb with `animate-pulse` card skeletons. |
| ✅ **Was fine** | **No image fallback for missing cast photos** | Fallback `div` was already implemented in both detail pages. |
| ✅ **Was fine** | **Genre/Country menus don't filter content** | Filtering was already wired up via `?genre=` and `?country=` URL params. |

---

## 7. What Can Be Added

### 7.1 Must-Have Features (Core Product)

#### User Authentication & Profiles
- Email/password or OAuth (Google, GitHub) via **NextAuth.js** or **Clerk**
- User profile page showing saved watchlists and ratings
- TMDB supports linking user accounts via session tokens — you can delegate ratings and watchlists to TMDB itself

#### Watchlist / Favourites ✅ Done (localStorage)
- ~~Save movies and shows to a personal list~~
- localStorage implementation is live. Upgrade path: **Supabase** (Postgres, free tier) for cross-device persistence when auth is added.

#### Movie / Show Trailers ✅ Done
- ~~TMDB provides `/movie/{id}/videos` — embed YouTube trailers on detail pages~~
- YouTube trailer modal is live on all detail pages.

#### Genre & Country Filtering ✅ Already wired
- Navbar genre/country links route to `/movies?genre=` and `/movies?country=` — filtering is active.
- Remaining: extend to `/shows` page and add visible filter chips on the browse pages.

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
| ~~**Skeleton loaders**~~ ✅ Done | `loading.tsx` files added for movies, shows, topimdb with `animate-pulse` card skeletons |
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

| Concern | Severity | Status |
|---|---|---|
| ~~`NEXT_PUBLIC_TMDB_TOKEN` exposed client-side~~ | **High** | ✅ **Fixed** — renamed to `TMDB_TOKEN`, server-side only |
| No input sanitization on search query params | Medium | 🔲 Open — validate `query` and `page` in API route handlers |
| No rate limiting on internal API routes | Medium | 🔲 Open — add Upstash or in-memory rate limiter |
| No Content Security Policy headers | Low | 🔲 Open — add CSP in `next.config.ts` via `headers()` |
| Footer 3rd-party hosting disclaimer | Info | Ensure ToS compliance with TMDB API usage terms |

---

## 9. Performance Notes

### Current Optimizations
- Turbopack build tool (faster HMR in dev)
- `next/image` for automatic image optimization and lazy loading
- Genre/country lists cached for 24 hours (ISR)
- Debounced search (400ms) with AbortController
- `Promise.all()` for parallel API calls on homepage
- TMDB page limit capped at 500 (API constraint)
- **In-memory TMDB response cache (1-hour TTL)** — added May 2026; first load hits TMDB, all subsequent loads are instant for the lifetime of the server process

### Recommended Improvements

| Optimization | Impact |
|---|---|
| Add `sizes` to all `<Image>` tags | Prevents downloading oversized images on mobile |
| ~~Use `loading.tsx` + Suspense boundaries~~ ✅ Done | `loading.tsx` added for movies, shows, topimdb |
| Implement SWR/React Query caching | Eliminates redundant fetches on back-navigation |
| Add `<link rel="preconnect">` for TMDB image CDN | Reduces DNS lookup time for images |
| Lazy-load below-the-fold sections on homepage | Reduces initial JS payload |
| Use `next/font` for typography | Eliminates CLS from font swaps |

---

*Last updated: May 20, 2026 (Pass 2) — `main` branch. See [Fixes Applied](#fixes-applied-session-log) for full session history.*
