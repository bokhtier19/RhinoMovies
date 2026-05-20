import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
    usePathname: () => "/",
    useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/image", () => ({
    default: ({ src, alt, width, height, ...rest }: { src: string; alt: string; width: number; height: number; [k: string]: unknown }) =>
        React.createElement("img", { src, alt, width, height, ...rest }),
}));

vi.mock("next/link", () => ({
    default: ({ href, children, ...rest }: { href: string; children: React.ReactNode; [k: string]: unknown }) =>
        React.createElement("a", { href, ...rest }, children),
}));
