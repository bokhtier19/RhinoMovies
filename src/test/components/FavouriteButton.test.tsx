import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FavouriteButton } from "@/src/components/FavouriteButton";

// ── Mocks ──────────────────────────────────────────────────────────────────
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

// ── Helpers ────────────────────────────────────────────────────────────────
const PROPS = { id: 550, type: "movie" as const, title: "Fight Club", poster_path: "/abc.jpg" };

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
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ exists: false }) });
});

// ── Tests ──────────────────────────────────────────────────────────────────
describe("FavouriteButton — unauthenticated visitor", () => {
    it("renders Add to Watchlist", () => {
        notLoggedIn();
        render(<FavouriteButton {...PROPS} />);
        expect(screen.getByText("Add to Watchlist")).toBeInTheDocument();
    });

    it("opens auth modal on click when not logged in or guest", () => {
        notLoggedIn();
        render(<FavouriteButton {...PROPS} />);
        fireEvent.click(screen.getByRole("button"));
        expect(mockOpen).toHaveBeenCalledOnce();
    });
});

describe("FavouriteButton — guest mode", () => {
    it("toggles watchlist in localStorage", async () => {
        asGuest();
        render(<FavouriteButton {...PROPS} />);
        fireEvent.click(screen.getByRole("button"));
        await waitFor(() => expect(screen.getByText("In Watchlist")).toBeInTheDocument());
        const stored = JSON.parse(localStorage.getItem("rhino_guest_watchlist") ?? "[]");
        expect(stored).toHaveLength(1);
        expect(stored[0].id).toBe(550);
    });

    it("removes from localStorage when toggling off", async () => {
        asGuest();
        localStorage.setItem("rhino_guest_watchlist", JSON.stringify([{ id: 550, type: "movie", title: "Fight Club", poster_path: null }]));
        render(<FavouriteButton {...PROPS} />);
        await waitFor(() => expect(screen.getByText("In Watchlist")).toBeInTheDocument());
        fireEvent.click(screen.getByRole("button"));
        await waitFor(() => expect(screen.getByText("Add to Watchlist")).toBeInTheDocument());
        const stored = JSON.parse(localStorage.getItem("rhino_guest_watchlist") ?? "[]");
        expect(stored).toHaveLength(0);
    });
});

describe("FavouriteButton — logged-in user", () => {
    it("calls API to add to watchlist", async () => {
        asUser();
        mockFetch
            .mockResolvedValueOnce({ ok: true, json: async () => ({ exists: false }) }) // initial check
            .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) }); // POST
        render(<FavouriteButton {...PROPS} />);
        await waitFor(() => expect(screen.getByText("Add to Watchlist")).toBeInTheDocument());
        fireEvent.click(screen.getByRole("button"));
        await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2));
        expect(mockFetch).toHaveBeenLastCalledWith("/api/watchlist", expect.objectContaining({ method: "POST" }));
    });

    it("rolls back optimistic update on API failure", async () => {
        asUser();
        mockFetch
            .mockResolvedValueOnce({ ok: true, json: async () => ({ exists: false }) })
            .mockResolvedValueOnce({ ok: false }); // POST fails
        render(<FavouriteButton {...PROPS} />);
        await waitFor(() => expect(screen.getByText("Add to Watchlist")).toBeInTheDocument());
        fireEvent.click(screen.getByRole("button"));
        // After rollback, should show Add to Watchlist again
        await waitFor(() => expect(screen.getByText("Add to Watchlist")).toBeInTheDocument());
    });

    it("calls DELETE when removing from watchlist", async () => {
        asUser();
        mockFetch
            .mockResolvedValueOnce({ ok: true, json: async () => ({ exists: true }) })
            .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });
        render(<FavouriteButton {...PROPS} />);
        await waitFor(() => expect(screen.getByText("In Watchlist")).toBeInTheDocument());
        fireEvent.click(screen.getByRole("button"));
        await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2));
        expect(mockFetch).toHaveBeenLastCalledWith(
            expect.stringContaining("/api/watchlist?media_id=550"),
            expect.objectContaining({ method: "DELETE" }),
        );
    });

    it("is disabled while a request is in flight", async () => {
        asUser();
        let resolvePost: (v: unknown) => void;
        const pending = new Promise((res) => { resolvePost = res; });
        mockFetch
            .mockResolvedValueOnce({ ok: true, json: async () => ({ exists: false }) })
            .mockReturnValueOnce(pending);
        render(<FavouriteButton {...PROPS} />);
        await waitFor(() => screen.getByText("Add to Watchlist"));
        fireEvent.click(screen.getByRole("button"));
        expect(screen.getByRole("button")).toBeDisabled();
        resolvePost!({ ok: true, json: async () => ({}) });
    });
});
