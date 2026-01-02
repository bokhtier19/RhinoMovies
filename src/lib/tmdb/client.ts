const API_URL = "https://api.themoviedb.org/3";
const TMDB_TOKEN = process.env.NEXT_PUBLIC_TMDB_TOKEN;

if (!TMDB_TOKEN) {
    throw new Error("TMDB token is missing");
}

type FetchOptions = RequestInit & {
    params?: Record<string, string | number | undefined>;
    revalidate?: number;
};

export async function tmdbFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const {params, revalidate, ...fetchOptions} = options;

    const url = new URL(`${API_URL}${endpoint}`);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${TMDB_TOKEN}`
        },

        ...(fetchOptions.cache ? {cache: fetchOptions.cache} : revalidate ? {next: {revalidate}} : {}),

        ...fetchOptions
    });

    if (!res.ok) {
        throw new Error(`TMDB request failed: ${res.status}`);
    }

    return res.json() as Promise<T>;
}
