import type { Metadata } from "next";
import { SearchProvider } from "@/src/context/SearchContext";

export const metadata: Metadata = {
    title: "TV Shows | RhinoMovies",
    description: "Browse and search the latest TV shows, top rated series, and discover new favourites.",
};

export default function ShowsLayout({ children }: { children: React.ReactNode }) {
    return (
        <SearchProvider>
            <section>
                <main>{children}</main>
            </section>
        </SearchProvider>
    );
}
