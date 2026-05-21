export default function Loading() {
    return (
        <div className="bg-imdb-black min-h-screen px-4 py-8 md:px-8 lg:px-16">
            {/* Searchbar skeleton */}
            <div
                className="flex items-center max-w-3xl mx-auto mt-6 rounded-full h-[56px] animate-pulse"
                style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
                <div className="ml-6 h-5 w-5 rounded-full shrink-0" style={{ backgroundColor: "var(--card)" }} />
                <div className="flex-1 mx-4 h-3 rounded" style={{ backgroundColor: "var(--card)" }} />
                <div className="w-px self-stretch" style={{ backgroundColor: "var(--border)" }} />
                <div className="mx-3 h-5 w-5 rounded shrink-0" style={{ backgroundColor: "var(--card)" }} />
                <div className="h-full w-28 rounded-r-full" style={{ backgroundColor: "var(--card)" }} />
            </div>

            {/* Title skeleton */}
            <div className="mt-6 mb-6 h-8 w-52 animate-pulse rounded" style={{ backgroundColor: "var(--surface)" }} />

            {/* Grid skeleton */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="overflow-hidden rounded-sm animate-pulse" style={{ backgroundColor: "var(--surface)" }}>
                        <div className="h-64 w-full" style={{ backgroundColor: "var(--card)" }} />
                        <div className="p-2 space-y-2">
                            <div className="h-3 w-3/4 rounded" style={{ backgroundColor: "var(--card)" }} />
                            <div className="h-3 w-1/2 rounded" style={{ backgroundColor: "var(--card)" }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
