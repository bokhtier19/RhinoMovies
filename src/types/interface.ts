export type MediaType = "movie" | "tv";

export interface TMDBBase {
    id: number;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    media_type?: MediaType;
}
