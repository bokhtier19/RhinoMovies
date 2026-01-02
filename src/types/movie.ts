import {TMDBBase, Genre} from "./common";
import {Cast} from "./cast";

export interface Movie extends TMDBBase {
    homepage: string;
    overview: string;
    runtime: number;
    production_countries: {
        iso_3166_1: string;
        name: string;
    }[];
    genres: Genre[];
    title: string;
    release_date: string;
}

export interface MovieDetails extends Movie {
    cast: never[];
    overview: string;
    runtime: number;
    tagline?: string;
    homepage: string;

    genres: Genre[];
    production_countries: {
        iso_3166_1: string;
        name: string;
    }[];
}

export interface MovieCredits {
    cast: Cast[];
}
