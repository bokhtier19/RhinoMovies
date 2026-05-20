export default function Loading() {
    return (
        <div className="min-h-screen px-4 py-8 md:px-8 lg:px-16">
            <div className="mb-6 h-10 w-64 animate-pulse rounded-lg" style={{ backgroundColor: "var(--surface)" }} />
            <div className="mb-8 h-8 w-48 animate-pulse rounded" style={{ backgroundColor: "var(--surface)" }} />
            <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="overflow-hidden rounded-sm" style={{ backgroundColor: "var(--surface)" }}>
                        <div className="h-64 w-full animate-pulse" style={{ backgroundColor: "var(--card)" }} />
                        <div className="p-2 space-y-2">
                            <div className="h-3 w-3/4 animate-pulse rounded" style={{ backgroundColor: "var(--card)" }} />
                            <div className="h-3 w-1/2 animate-pulse rounded" style={{ backgroundColor: "var(--card)" }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
