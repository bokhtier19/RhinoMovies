export type MediaType = "movie" | "tv";

export interface TMDBBase {
    id: number;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    media_type?: MediaType;
}

export interface Genre {
    id: number;
    name: string;
}

export interface PaginatedResponse<T> {
    page?: number;
    results: T[];
    total_pages?: number;
    total_results?: number;
}

export interface WatchProvider {
    provider_id: number;
    provider_name: string;
    logo_path: string;
}

export interface WatchProvidersResponse {
    id: number;
    results: Record<string, {
        link: string;
        flatrate?: WatchProvider[];
        rent?: WatchProvider[];
        buy?: WatchProvider[];
    }>;
}
