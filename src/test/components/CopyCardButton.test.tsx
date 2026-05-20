import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CopyCardButton } from "@/src/components/CopyCardButton";

const writeText = vi.fn().mockResolvedValue(undefined);

beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(navigator, "clipboard", {
        value: { writeText },
        writable: true,
        configurable: true,
    });
    Object.defineProperty(window, "location", {
        value: { origin: "http://localhost:3000" },
        writable: true,
        configurable: true,
    });
});

describe("CopyCardButton", () => {
    it("renders Share button", () => {
        render(<CopyCardButton id={550} mediaType="movie" title="Fight Club" />);
        expect(screen.getByText("Share")).toBeInTheDocument();
    });

    it("copies rich text to clipboard on click", async () => {
        render(
            <CopyCardButton
                id={550}
                mediaType="movie"
                title="Fight Club"
                year="1999"
                rating={8.8}
                runtime={139}
                genres={["Drama", "Thriller"]}
                overview="An insomniac office worker and a soap salesman build a network of soldiers."
            />
        );
        fireEvent.click(screen.getByText("Share"));
        await waitFor(() => expect(writeText).toHaveBeenCalledOnce());

        const text: string = writeText.mock.calls[0][0];
        expect(text).toContain("Fight Club");
        expect(text).toContain("1999");
        expect(text).toContain("8.8/10");
        expect(text).toContain("139 min");
        expect(text).toContain("Drama");
    });

    it("includes dynamic origin in share link", async () => {
        render(<CopyCardButton id={550} mediaType="movie" title="Fight Club" />);
        fireEvent.click(screen.getByText("Share"));
        await waitFor(() => expect(writeText).toHaveBeenCalledOnce());
        expect(writeText.mock.calls[0][0]).toContain("http://localhost:3000/movies/550");
    });

    it("uses /shows path for tv media type", async () => {
        render(<CopyCardButton id={1399} mediaType="tv" title="Game of Thrones" />);
        fireEvent.click(screen.getByText("Share"));
        await waitFor(() => expect(writeText).toHaveBeenCalledOnce());
        expect(writeText.mock.calls[0][0]).toContain("/shows/1399");
    });

    it("shows Copied! feedback after clicking", async () => {
        render(<CopyCardButton id={550} mediaType="movie" title="Fight Club" />);
        fireEvent.click(screen.getByText("Share"));
        await waitFor(() => expect(screen.getByText("Copied!")).toBeInTheDocument());
    });

    it("truncates long overviews to 140 chars", async () => {
        const longOverview = "a".repeat(200);
        render(<CopyCardButton id={550} mediaType="movie" title="Test" overview={longOverview} />);
        fireEvent.click(screen.getByText("Share"));
        await waitFor(() => expect(writeText).toHaveBeenCalledOnce());
        const text: string = writeText.mock.calls[0][0];
        expect(text).toContain("...");
        const snippet = text.match(/"([^"]+)"/)?.[1] ?? "";
        expect(snippet.length).toBeLessThanOrEqual(143); // 140 + "..."
    });

    it("works without optional props", async () => {
        render(<CopyCardButton id={550} mediaType="movie" title="Fight Club" />);
        fireEvent.click(screen.getByText("Share"));
        await waitFor(() => expect(writeText).toHaveBeenCalledOnce());
        expect(writeText.mock.calls[0][0]).toContain("Fight Club");
    });

    it("does not crash when clipboard is unavailable", async () => {
        writeText.mockRejectedValue(new Error("Permission denied"));
        render(<CopyCardButton id={550} mediaType="movie" title="Fight Club" />);
        expect(() => fireEvent.click(screen.getByText("Share"))).not.toThrow();
    });
});
