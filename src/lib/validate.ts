export type MediaType = "movie" | "tv";

export interface ValidationOk {
    id: number;
    type: MediaType;
}
export interface ValidationErr {
    error: string;
}

export function validateMediaParams(
    media_id: string | null,
    media_type: string | null,
): ValidationOk | ValidationErr {
    const id = Number(media_id);
    if (!media_id || !Number.isInteger(id) || id <= 0) {
        return { error: "Invalid media_id" };
    }
    if (media_type !== "movie" && media_type !== "tv") {
        return { error: "media_type must be 'movie' or 'tv'" };
    }
    return { id, type: media_type };
}

export function isValidationErr(v: ValidationOk | ValidationErr): v is ValidationErr {
    return "error" in v;
}
