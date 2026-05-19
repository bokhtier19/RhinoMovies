import https from "https";

const API_URL = "https://api.themoviedb.org/3";
const TMDB_TOKEN = process.env.NEXT_PUBLIC_TMDB_TOKEN;

if (!TMDB_TOKEN) {
    throw new Error("TMDB token is missing");
}

type FetchOptions = {
    params?: Record<string, string | number | undefined>;
};

function get<T>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
        https
            .get(url, { headers: { accept: "application/json", Authorization: `Bearer ${TMDB_TOKEN}` } }, (res) => {
                let raw = "";
                res.on("data", (chunk: string) => {
                    raw += chunk;
                });
                res.on("end", () => {
                    if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(JSON.parse(raw) as T);
                    } else {
                        reject(new Error(`TMDB request failed: ${res.statusCode}`));
                    }
                });
            })
            .on("error", reject);
    });
}

export async function tmdbFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params } = options;
    const url = new URL(`${API_URL}${endpoint}`);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    return get<T>(url.toString());
}
