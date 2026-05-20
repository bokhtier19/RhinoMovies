import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockAuth = vi.fn();
vi.mock("@/src/auth", () => ({ auth: mockAuth }));

const mockFrom = vi.fn();
vi.mock("@/src/lib/supabase", () => ({
    createSupabaseClient: () => ({ from: mockFrom }),
}));

const SESSION = { user: { email: "test@example.com" } };

function makeRequest(url: string, options?: RequestInit) {
    return new NextRequest(new URL(url, "http://localhost"), options);
}

describe("POST /api/ratings — rating value validation", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAuth.mockResolvedValue(SESSION);
    });

    it("rejects invalid rating value", async () => {
        const { POST } = await import("@/src/app/api/ratings/route");
        const res = await POST(makeRequest("http://localhost/api/ratings", {
            method: "POST",
            body: JSON.stringify({ media_id: 550, media_type: "movie", title: "Fight Club", rating: "maybe" }),
            headers: { "Content-Type": "application/json" },
        }));
        expect(res.status).toBe(400);
        const body = await res.json();
        expect(body.error).toMatch(/like.*dislike/i);
    });

    it("accepts 'like' rating", async () => {
        const chain = { upsert: vi.fn().mockResolvedValue({ error: null }) };
        mockFrom.mockReturnValue(chain);
        const { POST } = await import("@/src/app/api/ratings/route");
        const res = await POST(makeRequest("http://localhost/api/ratings", {
            method: "POST",
            body: JSON.stringify({ media_id: 550, media_type: "movie", title: "Fight Club", rating: "like" }),
            headers: { "Content-Type": "application/json" },
        }));
        expect(res.status).toBe(200);
    });

    it("accepts 'dislike' rating", async () => {
        const chain = { upsert: vi.fn().mockResolvedValue({ error: null }) };
        mockFrom.mockReturnValue(chain);
        const { POST } = await import("@/src/app/api/ratings/route");
        const res = await POST(makeRequest("http://localhost/api/ratings", {
            method: "POST",
            body: JSON.stringify({ media_id: 550, media_type: "movie", title: "Fight Club", rating: "dislike" }),
            headers: { "Content-Type": "application/json" },
        }));
        expect(res.status).toBe(200);
    });

    it("returns 401 when not authenticated", async () => {
        mockAuth.mockResolvedValue(null);
        const { POST } = await import("@/src/app/api/ratings/route");
        const res = await POST(makeRequest("http://localhost/api/ratings", {
            method: "POST",
            body: "{}",
        }));
        expect(res.status).toBe(401);
    });

    it("returns 400 for malformed JSON", async () => {
        const { POST } = await import("@/src/app/api/ratings/route");
        const res = await POST(makeRequest("http://localhost/api/ratings", {
            method: "POST",
            body: "{bad json",
            headers: { "Content-Type": "application/json" },
        }));
        expect(res.status).toBe(400);
    });
});

describe("GET /api/ratings", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAuth.mockResolvedValue(SESSION);
    });

    it("returns existing rating for a specific item", async () => {
        const chain = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: { rating: "like" }, error: null }),
        };
        mockFrom.mockReturnValue(chain);
        const { GET } = await import("@/src/app/api/ratings/route");
        const res = await GET(makeRequest("http://localhost/api/ratings?media_id=550&media_type=movie"));
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ rating: "like" });
    });

    it("returns rating:null when item not rated", async () => {
        const chain = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        };
        mockFrom.mockReturnValue(chain);
        const { GET } = await import("@/src/app/api/ratings/route");
        const res = await GET(makeRequest("http://localhost/api/ratings?media_id=550&media_type=movie"));
        expect(await res.json()).toEqual({ rating: null });
    });
});
