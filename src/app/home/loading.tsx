function CardSkeleton() {
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

function SectionSkeleton() {
    return (
        <div>
            <div className="flex items-center justify-between my-4">
                <div className="h-5 w-56 animate-pulse rounded" style={{ backgroundColor: "var(--surface)" }} />
                <div className="h-4 w-24 animate-pulse rounded" style={{ backgroundColor: "var(--surface)" }} />
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
                {Array.from({ length: 7 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
        </div>
    );
}

export default function Loading() {
    return (
        <div className="px-2 md:px-8 lg:px-16 py-8 min-h-screen flex flex-col gap-10">
            <SectionSkeleton />
            <SectionSkeleton />
            <SectionSkeleton />
            <SectionSkeleton />
        </div>
    );
}
