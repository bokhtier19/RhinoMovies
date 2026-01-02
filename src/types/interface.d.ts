// ======================
// Movie (list/summary)
// ======================
export interface Movie {
    id: number;
    title: string;
    poster_path: string | null;
    vote_average: number;
    release_date: string;
    media_type?: "movie"; // TMDB trending/all gives this
}

// ======================
// TV Show (list/summary)
// ======================
export interface TVShow {
    id: number;
    name: string;
    poster_path: string | null;
    vote_average: number;
    first_air_date: string;
    media_type?: "tv";
}

// ======================
// Movie details
// ======================
export interface MovieDetails extends Movie {
    production_countries: { iso_3166_1: string; name: string }[];
    homepage: string;
    overview: string;
    genres: { id: number; name: string }[];
    runtime: number;
    tagline?: string;
    backdrop_path: string | null;
}

// ======================
// TV Show details
// ======================
export interface TVShowDetails extends TVShow {
    production_companies: {
        id: number;
        name: string;
        logo_path: string | null;
        origin_country: string;
    }[];
    homepage: string;
    overview: string;
    genres: { id: number; name: string }[];
    number_of_seasons: number;
    number_of_episodes: number;
    tagline?: string;
    backdrop_path: string | null;
}

// ======================
// Card Props (used in MovieCard)
// ======================
export interface CardProps {
    id: number;
    title?: string; // for movies
    name?: string; // for tv shows
    poster_path: string | null;
    vote_average?: number;
    release_date?: string; // for movies
    first_air_date?: string; // for tv shows
    type?: "MOVIE" | "TV"; // optional override
    media_type?: string;
}

export interface Cast {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}
