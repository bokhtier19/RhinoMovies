function MovieCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-sm animate-pulse" style={{ backgroundColor: "var(--surface)" }}>
            <div className="h-64 w-full" style={{ backgroundColor: "var(--card)" }} />
            <div className="p-2 space-y-2">
                <div className="h-3 w-3/4 rounded" style={{ backgroundColor: "var(--card)" }} />
                <div className="h-3 w-1/2 rounded" style={{ backgroundColor: "var(--card)" }} />
            </div>
        </div>
    );
}

export default function MovieGridSkeleton({ count = 20 }: { count?: number }) {
    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <MovieCardSkeleton key={i} />
            ))}
        </div>
    );
}
