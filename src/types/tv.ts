import {Cast} from "./cast";

export interface TVShow {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    media_type?: "tv"; // ✅ allowed ONLY here
}

export interface TVShowDetails {
    id: number;
    name: string;
    overview: string;

    poster_path: string | null;
    backdrop_path: string | null;

    vote_average: number;
    first_air_date: string;

    number_of_seasons: number;
    number_of_episodes: number;

    genres: {
        id: number;
        name: string;
    }[];

    production_companies: {
        id: number;
        name: string;
    }[];

    homepage?: string;
}

export interface TVShowCredits {
    cast: Cast[];
}
