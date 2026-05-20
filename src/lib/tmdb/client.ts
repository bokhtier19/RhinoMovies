import https from "node:https";
import { setDefaultResultOrder } from "node:dns";
import { gunzip, inflate, brotliDecompress } from "node:zlib";
import { promisify } from "node:util";

setDefaultResultOrder("ipv4first");

const gunzipAsync = promisify(gunzip);
const inflateAsync = promisify(inflate);
const brotliAsync = promisify(brotliDecompress);

const API_URL = "https://api.themoviedb.org/3";
const TMDB_TOKEN = process.env.TMDB_TOKEN;

if (!TMDB_TOKEN) {
    throw new Error("TMDB token is missing");
}

type FetchOptions = {
    params?: Record<string, string | number | undefined>;
};

const cache = new Map<string, { data: unknown; expires: number }>();
const CACHE_TTL = 60 * 60 * 1000;

function sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
}

function request<T>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
        https
            .get(
                url,
                {
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${TMDB_TOKEN}`,
                    },
                },
                (res) => {
                    const chunks: Buffer[] = [];
                    res.on("data", (chunk: Buffer) => chunks.push(chunk));
                    res.on("end", async () => {
                        try {
                            const buf = Buffer.concat(chunks);
                            const encoding = res.headers["content-encoding"];
                            let text: string;

                            if (encoding === "gzip") {
                                text = (await gunzipAsync(buf)).toString("utf8");
                            } else if (encoding === "deflate") {
                                text = (await inflateAsync(buf)).toString("utf8");
                            } else if (encoding === "br") {
                                text = (await brotliAsync(buf)).toString("utf8");
                            } else {
                                text = buf.toString("utf8");
                            }

                            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                                resolve(JSON.parse(text) as T);
                            } else {
                                reject(new Error(`TMDB ${res.statusCode}: ${text.slice(0, 200)}`));
                            }
                        } catch (e) {
                            reject(e);
                        }
                    });
                }
            )
            .on("error", reject);
    });
}

async function get<T>(url: string, retries = 3): Promise<T> {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            return await request<T>(url);
        } catch (err) {
            if (attempt === retries - 1) throw err;
            await sleep(300 * 2 ** attempt);
        }
    }
    throw new Error("unreachable");
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

    const key = url.toString();
    const cached = cache.get(key);
    if (cached && cached.expires > Date.now()) {
        return cached.data as T;
    }

    const data = await get<T>(key);
    cache.set(key, { data, expires: Date.now() + CACHE_TTL });
    return data;
}
