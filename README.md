# 🦏 RhinoMovies

[![Demo](https://img.shields.io/badge/demo-live-blue?style=flat)](https://rhino-movies.vercel.app)
[![Framework](https://img.shields.io/badge/framework-Next.js-black?style=flat)](https://nextjs.org/)
[![Language](https://img.shields.io/badge/language-TypeScript-3178c6?style=flat)](https://www.typescriptlang.org/)
[![Styling](https://img.shields.io/badge/styling-Tailwind_CSS-38bdf8?style=flat)](https://tailwindcss.com/)
[![API](https://img.shields.io/badge/API-TMDb-01d277?style=flat)](https://www.themoviedb.org/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat)](./LICENSE)

Welcome to **RhinoMovies** — a fast, modern, and delightful movie & TV discovery experience built with Next.js, React, and TypeScript. Explore trending titles, discover top-rated gems, and dive deep into details with a beautiful, responsive UI.

---

✨ Highlights

- Ultra-fast Next.js App Router architecture
- Live instant search with suggestions
- Infinite scroll for top-rated lists
- Rich detail pages: cast, genres, runtime, release dates, ratings
- Hover previews and a mobile-first responsive layout
- Built with TypeScript + Tailwind for maintainability and speed

---

Table of Contents

- [Demo](#-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Install](#install)
    - [Environment](#environment)
    - [Run Locally](#run-locally)
- [Project Structure](#-project-structure)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)

---

🎬 Demo

> https://rhino-movies.vercel.app

---

🚀 Features

- Browse top-rated movies and TV shows
- Trending section (movies & TV)
- Live search with instant results and debounce
- Dedicated detail pages with:
    - Overview, runtime, release/air dates
    - Genre list and metadata
    - Top cast members
    - Ratings with like / dislike interactions
- Infinite scrolling on top-rated lists
- Hover previews that reveal titles & quick actions
- Fully responsive (desktop, tablet, mobile)
- Clean component-driven architecture for reusability

---

🧰 Tech Stack

| Category         | Technology                       |
| ---------------- | -------------------------------- |
| Framework        | Next.js (App Router)             |
| UI Library       | React                            |
| Language         | TypeScript                       |
| Styling          | Tailwind CSS                     |
| API              | TMDb (The Movie Database API v3) |
| State Management | React Context API                |
| Icons            | react-icons                      |
| Hosting          | Vercel (recommended)             |

---

⚙️ Getting Started

Prerequisites

- Node.js v18+ (recommended)
- A TMDb API key (free from https://www.themoviedb.org)

Install & run locally

```bash
# clone
git clone https://github.com/your-username/rhinomovies.git
cd rhinomovies

# install
npm install

# dev server
npm run dev
```

Environment Variables
Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
```

Build & start (production)

```bash
npm run build
npm start
```

Open http://localhost:3000 in your browser.

---

📁 Project Structure (high level)

```
src/
 ├── app/            # Next.js App Router pages & layouts
 ├── components/     # Reusable components (cards, lists, modals)
 ├── context/        # React Context for global state
 ├── lib/            # API client, helpers, and utils
 ├── types/          # TypeScript interfaces
 └── styles/         # Global Tailwind config & styles
```

---

🛣️ Roadmap

- User authentication & profiles
- Watchlist & favorites
- Trailer playback integration
- Genre / country-based filtering
- SEO improvements (metadata & Open Graph)
- Caching, ISR & performance tuning
- Tests and CI pipelines

---

🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feat/my-feature`
5. Open a Pull Request describing your change

Please open issues for bugs or feature requests. Include steps to reproduce and screenshots where helpful.

---

🧾 Code of Conduct
This project follows the Contributor Covenant. Be kind and respectful. Treat others how you want to be treated.

---

📦 License
This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

---

🙏 Acknowledgements

- TMDb for the movie & TV data
- Next.js & React communities for exceptional libraries
- Inspiration from many open-source movie discovery projects

---

💡 Tips & Notes

- Use the TMDb API rate limits responsibly in production (cache results where possible).
- For better SEO, consider server-side caching and Open Graph metadata on detail pages.
- Replace placeholder demo / badge links with real deployment URLs after you deploy.

---

Made with ❤️ for movie lovers.
