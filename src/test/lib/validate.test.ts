import { describe, it, expect } from "vitest";
import { validateMediaParams } from "@/src/lib/validate";

describe("validateMediaParams", () => {
    it("returns error for null media_id", () => {
        const result = validateMediaParams(null, "movie");
        expect(result).toEqual({ error: "Invalid media_id" });
    });

    it("returns error for non-numeric media_id", () => {
        expect(validateMediaParams("abc", "movie")).toEqual({ error: "Invalid media_id" });
    });

    it("returns error for zero media_id", () => {
        expect(validateMediaParams("0", "movie")).toEqual({ error: "Invalid media_id" });
    });

    it("returns error for negative media_id", () => {
        expect(validateMediaParams("-5", "movie")).toEqual({ error: "Invalid media_id" });
    });

    it("returns error for float media_id", () => {
        expect(validateMediaParams("1.5", "movie")).toEqual({ error: "Invalid media_id" });
    });

    it("returns error for invalid media_type", () => {
        expect(validateMediaParams("123", "anime")).toEqual({ error: "media_type must be 'movie' or 'tv'" });
    });

    it("returns error for null media_type", () => {
        expect(validateMediaParams("123", null)).toEqual({ error: "media_type must be 'movie' or 'tv'" });
    });

    it("accepts valid movie params", () => {
        expect(validateMediaParams("550", "movie")).toEqual({ id: 550, type: "movie" });
    });

    it("accepts valid tv params", () => {
        expect(validateMediaParams("1399", "tv")).toEqual({ id: 1399, type: "tv" });
    });

    it("accepts large valid id", () => {
        const result = validateMediaParams("999999", "movie");
        expect(result).toEqual({ id: 999999, type: "movie" });
    });
});
