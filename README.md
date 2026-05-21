# 🦏 RhinoMovies

[![Demo](https://img.shields.io/badge/demo-live-brightgreen?style=flat)](https://rhino-movies.vercel.app)
[![Framework](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Language](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Styling](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Database](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=flat&logo=supabase)](https://supabase.com/)
[![API](https://img.shields.io/badge/TMDB_API-v3-01d277?style=flat)](https://www.themoviedb.org/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat)](./LICENSE)

A full-stack movie & TV discovery platform. Browse trending titles, track what you've watched, rate content, and build a personal watchlist — synced to the cloud when signed in, or saved locally as a guest.

**Live → [rhino-movies.vercel.app](https://rhino-movies.vercel.app)**

---

## Features

### Discovery & Search
- Trending movies and TV shows (daily)
- Now-playing and upcoming sections on the homepage
- Top-rated browsing for movies and shows
- Top IMDb page with pagination
- Live search with 400ms debounce and AbortController cancellation
- Genre filtering (20+ categories) and country filtering (200+ regions) via URL params — shareable and back/forward navigable
- **Advanced Filter Modal** — multi-select genres, country, release year, sort (Popularity / Rating / Release Date / Name A–Z / Revenue / Budget), and ascending/descending order. Available on both the Movies and TV Shows pages. Active filter count badge shows how many filters are applied. All state is URL-driven so filtered results are shareable and deep-linkable.
- Category shortcuts — browse Trending, Upcoming, Latest, or Top Rated directly via `?category=` param

### Detail Pages
- Full movie & TV show info: cast, runtime, genres, release date, production countries
- Dynamic rating bar — green (≥7.0), amber (4–7), red (<4.0)
- **Watch Trailer** — fetches the official YouTube trailer via TMDB `/videos`, plays in a keyboard-dismissable modal. Greyed out when no trailer exists.
- **Where to Watch** — streaming, rental, and purchase providers via TMDB `/watch/providers` with JustWatch attribution. US-first with country fallback.
- **You Might Also Like** — horizontally scrollable row of up to 12 deduplicated recommendations + similar titles. Left/right chevron buttons on desktop; native touch scroll on mobile.
- Top 10 cast members with profile photos and fallback avatars

### User Accounts & Data
- **Google OAuth** via NextAuth v5 — one-click sign-in, sessions persisted securely
- **Guest Mode** — full feature set without an account, using `sessionStorage`. Guest flag auto-cleared on Google sign-in.
- **Watchlist** — synced to Supabase when signed in; falls back to `localStorage` for guests
- **Like / Dislike ratings** — synced to Supabase when signed in; falls back to `localStorage` for guests
- **Watch History** — auto-tracks every detail page visit. Last 50 entries, newest first.
- **Profile page** (`/profile`) with Watchlist, Ratings, and History tabs. Direct tab linking via `?tab=` query param.
- Optimistic UI with instant feedback and rollback on error
- **Copy card** — copies rich movie/show info (title, year, rating, genres, overview, link) to clipboard from detail and profile pages

### UI & UX
- Dark / Light theme with system preference detection and manual toggle
- Fully responsive — mobile to 4K ultrawide (1920px max container)
- Skeleton loading pages (`loading.tsx`) for smooth navigation transitions
- `MovieGridSkeleton` component for in-page loading states on browse pages
- Perfect grid alignment via `useGridRows` — a `ResizeObserver`-based hook that measures actual CSS columns at runtime, caps results to exactly N full rows, and fills the last row with ghost elements so the grid never looks ragged
- Sticky navbar with scroll-hide, genre/country mega menus, and outside-tap close on mobile
- Global `ErrorBoundary` with "Try again" recovery — one broken page never crashes the app
- Scroll-to-top floating button

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Server Components) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Auth | NextAuth v5 + Google OAuth |
| Database | Supabase (PostgreSQL) |
| External API | TMDB API v3 |
| Deployment | Vercel |
| Analytics | Vercel Analytics |
| Build Tool | Turbopack |
| Testing | Vitest + Testing Library |

---

## Getting Started

### Prerequisites

- Node.js v18+
- A free [TMDB API Read Access Token](https://www.themoviedb.org/settings/api)
- A [Supabase](https://supabase.com) project (free tier is fine)
- A [Google OAuth app](https://console.cloud.google.com/) for sign-in

### Install

```bash
git clone https://github.com/bokhtier19/rhinomovies.git
cd rhinomovies
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# TMDB — server-side only (do NOT use NEXT_PUBLIC_)
TMDB_TOKEN=your_tmdb_read_access_token

# NextAuth
AUTH_SECRET=your_nextauth_secret
AUTH_URL=http://localhost:3000

# Google OAuth
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

See `.env.example` for a full reference.

### Supabase Setup

Run the included SQL schema in your Supabase SQL editor:

```bash
# File is at project root
supabase-schema.sql
```

This creates the `watchlist`, `ratings`, and `watch_history` tables with RLS policies.

### Run Locally

```bash
npm run dev      # development (Turbopack)
npm run build    # production build
npm start        # production server
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── home/               # Homepage — SSR, parallel TMDB fetches
│   ├── movies/             # Browse + search (CSR) + detail pages (SSR)
│   ├── shows/              # Browse + search (CSR) + detail pages (SSR)
│   ├── topimdb/            # Top-rated with pagination (CSR)
│   ├── profile/            # User profile — Watchlist · Ratings · History
│   ├── login/              # Login page with Google OAuth + Guest option
│   └── api/                # Route handlers: movies, tv, genres, countries, watchlist, ratings, history
├── components/             # Navbar, MovieCard, TrailerModal, WatchButton, FavouriteButton,
│                           # LikeDislike, HistoryTracker, StreamingProviders, MediaRow,
│                           # AdvancedFilterModal, MovieGridSkeleton, CopyCardButton,
│                           # ErrorBoundary, Pagination, ThemeProvider, ...
├── context/
│   ├── SearchContext.tsx   # Global search state, resets on route change
│   ├── AuthModalContext.tsx
│   └── GuestContext.tsx
├── hooks/
│   └── useGridRows.ts      # ResizeObserver hook — measures live CSS columns, fills ghost cells
├── lib/
│   ├── tmdb/               # TMDB API client — gzip decompress, in-memory cache, retry
│   ├── supabase.ts         # Supabase service-role client
│   └── validate.ts         # Shared input validation for API route handlers
├── test/                   # Vitest unit tests
│   ├── api/                # watchlist, ratings, history route tests
│   ├── components/         # CopyCardButton, FavouriteButton, LikeDislike tests
│   └── lib/                # validate.ts tests
└── types/                  # movie.ts, tv.ts, cast.ts, common.ts
```

### Rendering Strategy

| Route | Rendering | Reason |
|---|---|---|
| `/home` | SSR | Fresh trending data on every request |
| `/movies`, `/shows` | CSR | Dynamic search + pagination with user state |
| `/movies/[id]`, `/shows/[id]` | SSR (`no-store`) | Always-fresh detail + parallel data fetches |
| `/topimdb` | CSR | Paginated browsing |
| `/profile` (logged in) | SSR | Supabase data fetched server-side |
| `/profile` (guest) | CSR | Reads from `localStorage` |
| `/api/genres`, `/api/countries` | ISR (24h) | Rarely-changing reference data |

---

## Architecture Notes

**TMDB Client** (`src/lib/tmdb/client.ts`) handles gzip/brotli decompression, an in-memory 1-hour TTL cache, and exponential-backoff retries. The `TMDB_TOKEN` is server-side only — never embedded in the client bundle.

**Detail pages** run a 5-way `Promise.all` (credits, trailer, recommendations, similar, watch providers) in parallel. Each sub-fetch has its own `.catch(() => null)` so a missing trailer or no providers never breaks the page.

**Guest mode** mirrors the full feature set using `sessionStorage` with the exact same component API as the Supabase-backed path — no degraded experience for unauthenticated users.

**Advanced filtering** uses TMDB's `/discover` endpoint when any filter is active (genre, country, year, sort). The API route fetches two TMDB pages per app page and merges them, so each page shows double the results. Sort options map to TMDB's `sort_by` field (`popularity.desc`, `vote_average.asc`, etc.). Revenue and Budget sort options are hidden automatically for TV shows since TMDB doesn't support them there.

**`useGridRows`** is a `ResizeObserver`-based hook that reads the actual `grid-template-columns` value from the computed CSS at runtime. It caps the card count to `cols × 5` (5 full rows) and returns a `ghosts()` function that calculates how many invisible filler elements are needed to complete the last row — keeping the grid flush regardless of how many results come back.

**Input validation** for API routes is centralised in `src/lib/validate.ts`. All watchlist, ratings, and history routes use `validateMediaParams()` before hitting Supabase, returning a typed `ValidationOk | ValidationErr` discriminated union.

**Search** is URL-driven (`?query=`, `?genre=`, `?country=`, `?year=`, `?sort=`, `?order=`) — all filter states are in the URL, making filtered pages shareable and browser-navigable.

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push and open a Pull Request

Please open an issue first for bugs or significant feature ideas. Include steps to reproduce and screenshots where helpful.

---

## License

MIT — see [LICENSE](./LICENSE).

---

## Acknowledgements

- [TMDB](https://www.themoviedb.org/) for the movie and TV data API
- [JustWatch](https://www.justwatch.com/) for streaming availability data (via TMDB)
- [Supabase](https://supabase.com/) for the database
- [Vercel](https://vercel.com/) for hosting

---

*This product uses the TMDB API but is not endorsed or certified by TMDB.*
