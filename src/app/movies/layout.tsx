import {SearchProvider} from "@/src/context/SearchContext";

export default function MoviesLayout({children}: {children: React.ReactNode}) {
    return (
        <SearchProvider>
            <section className="movies-layout">
                <main>{children}</main>
            </section>
        </SearchProvider>
    );
}
