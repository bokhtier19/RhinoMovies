import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Mocks ──────────────────────────────────────────────────────────────────
const mockAuth = vi.fn();
vi.mock("@/src/auth", () => ({ auth: mockAuth }));

const mockFrom = vi.fn();
vi.mock("@/src/lib/supabase", () => ({
    createSupabaseClient: () => ({ from: mockFrom }),
}));

// ── Helpers ────────────────────────────────────────────────────────────────
const SESSION = { user: { email: "test@example.com" } };

function makeRequest(url: string, options?: RequestInit): NextRequest {
    return new NextRequest(new URL(url, "http://localhost"), options);
}

function chainQuery(overrides: Record<string, unknown> = {}) {
    const chain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        upsert: vi.fn().mockResolvedValue({ error: null }),
        delete: vi.fn().mockReturnThis(),
        ...overrides,
    };
    mockFrom.mockReturnValue(chain);
    return chain;
}

// ── Tests ──────────────────────────────────────────────────────────────────
describe("GET /api/watchlist", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAuth.mockResolvedValue(SESSION);
    });

    it("returns 401 when unauthenticated", async () => {
        mockAuth.mockResolvedValue(null);
        const { GET } = await import("@/src/app/api/watchlist/route");
        const res = await GET(makeRequest("http://localhost/api/watchlist"));
        expect(res.status).toBe(401);
    });

    it("returns 400 for invalid media_id", async () => {
        const { GET } = await import("@/src/app/api/watchlist/route");
        const res = await GET(makeRequest("http://localhost/api/watchlist?media_id=abc&media_type=movie"));
        expect(res.status).toBe(400);
        const body = await res.json();
        expect(body.error).toMatch(/media_id/i);
    });

    it("returns 400 for invalid media_type", async () => {
        const { GET } = await import("@/src/app/api/watchlist/route");
        const res = await GET(makeRequest("http://localhost/api/watchlist?media_id=550&media_type=anime"));
        expect(res.status).toBe(400);
    });

    it("returns exists:false when item not in watchlist", async () => {
        chainQuery({ maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }) });
        const { GET } = await import("@/src/app/api/watchlist/route");
        const res = await GET(makeRequest("http://localhost/api/watchlist?media_id=550&media_type=movie"));
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ exists: false });
    });

    it("returns exists:true when item is in watchlist", async () => {
        chainQuery({ maybeSingle: vi.fn().mockResolvedValue({ data: { id: "uuid" }, error: null }) });
        const { GET } = await import("@/src/app/api/watchlist/route");
        const res = await GET(makeRequest("http://localhost/api/watchlist?media_id=550&media_type=movie"));
        expect(await res.json()).toEqual({ exists: true });
    });

    it("returns full watchlist when no query params", async () => {
        const items = [{ media_id: 550, title: "Fight Club" }];
        const chain = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockResolvedValue({ data: items, error: null }),
        };
        mockFrom.mockReturnValue(chain);
        const { GET } = await import("@/src/app/api/watchlist/route");
        const res = await GET(makeRequest("http://localhost/api/watchlist"));
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual(items);
    });
});

describe("POST /api/watchlist", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAuth.mockResolvedValue(SESSION);
    });

    it("returns 401 when unauthenticated", async () => {
        mockAuth.mockResolvedValue(null);
        const { POST } = await import("@/src/app/api/watchlist/route");
        const res = await POST(makeRequest("http://localhost/api/watchlist", { method: "POST", body: "{}" }));
        expect(res.status).toBe(401);
    });

    it("returns 400 for malformed JSON", async () => {
        const { POST } = await import("@/src/app/api/watchlist/route");
        const req = new NextRequest("http://localhost/api/watchlist", {
            method: "POST",
            body: "not json",
            headers: { "Content-Type": "application/json" },
        });
        const res = await POST(req);
        expect(res.status).toBe(400);
        expect((await res.json()).error).toMatch(/json/i);
    });

    it("returns 400 for invalid media_type", async () => {
        const { POST } = await import("@/src/app/api/watchlist/route");
        const res = await POST(makeRequest("http://localhost/api/watchlist", {
            method: "POST",
            body: JSON.stringify({ media_id: 550, media_type: "anime", title: "Spirited Away" }),
            headers: { "Content-Type": "application/json" },
        }));
        expect(res.status).toBe(400);
    });

    it("returns 400 when title is missing", async () => {
        const { POST } = await import("@/src/app/api/watchlist/route");
        const res = await POST(makeRequest("http://localhost/api/watchlist", {
            method: "POST",
            body: JSON.stringify({ media_id: 550, media_type: "movie" }),
            headers: { "Content-Type": "application/json" },
        }));
        expect(res.status).toBe(400);
    });

    it("saves valid item successfully", async () => {
        const chain = { upsert: vi.fn().mockResolvedValue({ error: null }) };
        mockFrom.mockReturnValue(chain);
        const { POST } = await import("@/src/app/api/watchlist/route");
        const res = await POST(makeRequest("http://localhost/api/watchlist", {
            method: "POST",
            body: JSON.stringify({ media_id: 550, media_type: "movie", title: "Fight Club", poster_path: "/abc.jpg" }),
            headers: { "Content-Type": "application/json" },
        }));
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ success: true });
        expect(chain.upsert).toHaveBeenCalledWith(expect.objectContaining({
            user_email: "test@example.com",
            media_id: 550,
            media_type: "movie",
            title: "Fight Club",
        }));
    });
});

describe("DELETE /api/watchlist", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAuth.mockResolvedValue(SESSION);
    });

    it("returns 401 when unauthenticated", async () => {
        mockAuth.mockResolvedValue(null);
        const { DELETE } = await import("@/src/app/api/watchlist/route");
        const res = await DELETE(makeRequest("http://localhost/api/watchlist?media_id=550&media_type=movie"));
        expect(res.status).toBe(401);
    });

    it("returns 400 for invalid params", async () => {
        const { DELETE } = await import("@/src/app/api/watchlist/route");
        const res = await DELETE(makeRequest("http://localhost/api/watchlist?media_id=-1&media_type=movie"));
        expect(res.status).toBe(400);
    });

    it("deletes item successfully", async () => {
        const chain = {
            delete: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            // last eq resolves the promise
        };
        let callCount = 0;
        chain.eq = vi.fn().mockImplementation(() => {
            callCount++;
            if (callCount >= 3) return Promise.resolve({ error: null });
            return chain;
        });
        mockFrom.mockReturnValue(chain);
        const { DELETE } = await import("@/src/app/api/watchlist/route");
        const res = await DELETE(makeRequest("http://localhost/api/watchlist?media_id=550&media_type=movie"));
        expect(res.status).toBe(200);
    });
});
