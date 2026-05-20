import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LikeDislike } from "@/src/components/LikeDislike";

const { mockUseSession, mockUseGuest, mockOpen } = vi.hoisted(() => ({
    mockUseSession: vi.fn(),
    mockUseGuest: vi.fn(),
    mockOpen: vi.fn(),
}));

vi.mock("next-auth/react", () => ({ useSession: mockUseSession }));
vi.mock("@/src/context/GuestContext", () => ({ useGuest: mockUseGuest }));
vi.mock("@/src/context/AuthModalContext", () => ({ useAuthModal: () => ({ open: mockOpen }) }));

const mockFetch = vi.fn();
global.fetch = mockFetch;

const PROPS = { id: 550, type: "movie" as const, title: "Fight Club", poster_path: null };

function notLoggedIn() {
    mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });
    mockUseGuest.mockReturnValue({ isGuest: false });
}
function asGuest() {
    mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });
    mockUseGuest.mockReturnValue({ isGuest: true });
}
function asUser() {
    mockUseSession.mockReturnValue({ data: { user: { email: "u@e.com" } }, status: "authenticated" });
    mockUseGuest.mockReturnValue({ isGuest: false });
}

beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ rating: null }) });
});

describe("LikeDislike — unauthenticated", () => {
    it("renders Like and Dislike buttons", () => {
        notLoggedIn();
        render(<LikeDislike {...PROPS} />);
        expect(screen.getByText("Like")).toBeInTheDocument();
        expect(screen.getByText("Dislike")).toBeInTheDocument();
    });

    it("opens auth modal when clicking Like without auth", () => {
        notLoggedIn();
        render(<LikeDislike {...PROPS} />);
        fireEvent.click(screen.getByText("Like"));
        expect(mockOpen).toHaveBeenCalledOnce();
    });
});

describe("LikeDislike — guest mode", () => {
    it("saves like to localStorage", async () => {
        asGuest();
        render(<LikeDislike {...PROPS} />);
        fireEvent.click(screen.getByText("Like"));
        await waitFor(() => {
            const stored = JSON.parse(localStorage.getItem("rhino_guest_ratings") ?? "[]");
            expect(stored).toHaveLength(1);
            expect(stored[0]).toMatchObject({ id: 550, type: "movie", rating: "like" });
        });
    });

    it("toggles like off on second click", async () => {
        asGuest();
        render(<LikeDislike {...PROPS} />);
        fireEvent.click(screen.getByText("Like"));
        await waitFor(() => expect(JSON.parse(localStorage.getItem("rhino_guest_ratings") ?? "[]")).toHaveLength(1));
        fireEvent.click(screen.getByText("Like"));
        await waitFor(() => expect(JSON.parse(localStorage.getItem("rhino_guest_ratings") ?? "[]")).toHaveLength(0));
    });

    it("switches from like to dislike", async () => {
        asGuest();
        render(<LikeDislike {...PROPS} />);
        fireEvent.click(screen.getByText("Like"));
        fireEvent.click(screen.getByText("Dislike"));
        await waitFor(() => {
            const stored = JSON.parse(localStorage.getItem("rhino_guest_ratings") ?? "[]");
            expect(stored[0].rating).toBe("dislike");
        });
    });
});

describe("LikeDislike — logged-in user", () => {
    it("calls POST API with correct rating", async () => {
        asUser();
        mockFetch
            .mockResolvedValueOnce({ ok: true, json: async () => ({ rating: null }) })
            .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });
        render(<LikeDislike {...PROPS} />);
        await waitFor(() => screen.getByText("Like"));
        fireEvent.click(screen.getByText("Like"));
        await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2));
        const [, options] = mockFetch.mock.calls[1];
        expect(JSON.parse(options.body)).toMatchObject({ rating: "like", media_id: 550 });
    });

    it("rolls back vote on API failure", async () => {
        asUser();
        mockFetch
            .mockResolvedValueOnce({ ok: true, json: async () => ({ rating: "like" }) })
            .mockResolvedValueOnce({ ok: false });
        render(<LikeDislike {...PROPS} />);
        // Wait for initial state to load (like)
        await waitFor(() => {
            const btn = screen.getByText("Like").closest("button");
            expect(btn).toHaveStyle("background-color: rgb(22, 163, 74)");
        });
        // Click to toggle off (should fail and rollback)
        fireEvent.click(screen.getByText("Like"));
        await waitFor(() => {
            const btn = screen.getByText("Like").closest("button");
            expect(btn).toHaveStyle("background-color: rgb(22, 163, 74)");
        });
    });

    it("calls DELETE when deselecting a vote", async () => {
        asUser();
        mockFetch
            .mockResolvedValueOnce({ ok: true, json: async () => ({ rating: "like" }) })
            .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });
        render(<LikeDislike {...PROPS} />);
        await waitFor(() => screen.getByText("Like"));
        fireEvent.click(screen.getByText("Like"));
        await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2));
        const [url, options] = mockFetch.mock.calls[1];
        expect(options.method).toBe("DELETE");
        expect(url).toContain("media_id=550");
    });
});
