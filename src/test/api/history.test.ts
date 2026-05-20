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

describe("POST /api/history", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAuth.mockResolvedValue(SESSION);
    });

    it("returns 401 when unauthenticated", async () => {
        mockAuth.mockResolvedValue(null);
        const { POST } = await import("@/src/app/api/history/route");
        const res = await POST(makeRequest("http://localhost/api/history", { method: "POST", body: "{}" }));
        expect(res.status).toBe(401);
    });

    it("returns 400 for malformed JSON", async () => {
        const { POST } = await import("@/src/app/api/history/route");
        const res = await POST(makeRequest("http://localhost/api/history", {
            method: "POST",
            body: "{not json",
            headers: { "Content-Type": "application/json" },
        }));
        expect(res.status).toBe(400);
    });

    it("returns 400 for invalid media_id", async () => {
        const { POST } = await import("@/src/app/api/history/route");
        const res = await POST(makeRequest("http://localhost/api/history", {
            method: "POST",
            body: JSON.stringify({ media_id: "abc", media_type: "movie", title: "Test" }),
            headers: { "Content-Type": "application/json" },
        }));
        expect(res.status).toBe(400);
    });

    it("returns 400 for invalid media_type", async () => {
        const { POST } = await import("@/src/app/api/history/route");
        const res = await POST(makeRequest("http://localhost/api/history", {
            method: "POST",
            body: JSON.stringify({ media_id: 550, media_type: "invalid", title: "Test" }),
            headers: { "Content-Type": "application/json" },
        }));
        expect(res.status).toBe(400);
    });

    it("uses upsert to avoid duplicate history entries", async () => {
        const chain = { upsert: vi.fn().mockResolvedValue({ error: null }) };
        mockFrom.mockReturnValue(chain);
        const { POST } = await import("@/src/app/api/history/route");
        await POST(makeRequest("http://localhost/api/history", {
            method: "POST",
            body: JSON.stringify({ media_id: 550, media_type: "movie", title: "Fight Club" }),
            headers: { "Content-Type": "application/json" },
        }));
        expect(chain.upsert).toHaveBeenCalledWith(
            expect.objectContaining({ media_id: 550, media_type: "movie", title: "Fight Club" }),
            expect.objectContaining({ onConflict: "user_email,media_id,media_type" }),
        );
    });

    it("records history successfully", async () => {
        const chain = { upsert: vi.fn().mockResolvedValue({ error: null }) };
        mockFrom.mockReturnValue(chain);
        const { POST } = await import("@/src/app/api/history/route");
        const res = await POST(makeRequest("http://localhost/api/history", {
            method: "POST",
            body: JSON.stringify({ media_id: 1399, media_type: "tv", title: "Game of Thrones" }),
            headers: { "Content-Type": "application/json" },
        }));
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ success: true });
    });
});

describe("GET /api/history", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAuth.mockResolvedValue(SESSION);
    });

    it("returns 401 when unauthenticated", async () => {
        mockAuth.mockResolvedValue(null);
        const { GET } = await import("@/src/app/api/history/route");
        const res = await GET();
        expect(res.status).toBe(401);
    });

    it("returns history list", async () => {
        const items = [{ media_id: 550, media_type: "movie", title: "Fight Club" }];
        const chain = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockResolvedValue({ data: items, error: null }),
        };
        mockFrom.mockReturnValue(chain);
        const { GET } = await import("@/src/app/api/history/route");
        const res = await GET();
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual(items);
    });
});
