import Image from "next/image";
import { WatchProvider } from "@/src/types/common";

interface Props {
    flatrate?: WatchProvider[];
    rent?: WatchProvider[];
    buy?: WatchProvider[];
    link?: string;
    /** Compact inline mode: label + all logos on one line, for desktop sidebar use */
    compact?: boolean;
}

function ProviderLogo({ p, small }: { p: WatchProvider; small?: boolean }) {
    return (
        <div className="group flex flex-col items-center gap-1">
            <div
                className={`relative overflow-hidden rounded-lg shadow-md ring-1 ring-white/10 transition-transform group-hover:scale-110 ${
                    small ? "h-9 w-9" : "h-10 w-10 sm:h-12 sm:w-12"
                }`}
            >
                <Image
                    src={`https://image.tmdb.org/t/p/original${p.logo_path}`}
                    alt={p.provider_name}
                    fill
                    className="object-cover"
                    sizes={small ? "36px" : "48px"}
                />
            </div>
            <span
                className={`truncate text-center leading-tight ${small ? "w-9 text-[8px]" : "w-12 text-[9px] sm:w-14 sm:text-[10px]"}`}
                style={{ color: "var(--detail-muted)" }}
            >
                {p.provider_name}
            </span>
        </div>
    );
}

function ProviderGroup({ label, providers }: { label: string; providers: WatchProvider[] }) {
    if (!providers.length) return null;
    return (
        <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
            <span className="mt-1 w-10 shrink-0 text-[10px] font-semibold uppercase tracking-widest sm:w-12" style={{ color: "var(--detail-accent)" }}>
                {label}
            </span>
            <div className="flex flex-wrap gap-3">
                {providers.map((p) => <ProviderLogo key={p.provider_id} p={p} />)}
            </div>
        </div>
    );
}

export function StreamingProviders({ flatrate, rent, buy, link, compact }: Props) {
    const hasAny = (flatrate?.length ?? 0) + (rent?.length ?? 0) + (buy?.length ?? 0) > 0;
    if (!hasAny) return null;

    if (compact) {
        const seen = new Set<number>();
        const unique = [...(flatrate ?? []), ...(rent ?? []), ...(buy ?? [])].filter((p) => {
            if (seen.has(p.provider_id)) return false;
            seen.add(p.provider_id);
            return true;
        });

        return (
            <div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="shrink-0 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--detail-accent)" }}>
                        Where to Watch
                    </span>
                    {unique.map((p) => <ProviderLogo key={p.provider_id} p={p} small />)}
                </div>
                {link && (
                    <p className="mt-2 text-[9px]" style={{ color: "var(--detail-muted)" }}>
                        via{" "}
                        <a href={link} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">
                            JustWatch
                        </a>
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 md:py-8">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest sm:mb-5" style={{ color: "var(--detail-accent)" }}>
                Where to Watch
            </h2>
            <div className="flex flex-col gap-4">
                {flatrate?.length ? <ProviderGroup label="Stream" providers={flatrate} /> : null}
                {rent?.length ? <ProviderGroup label="Rent" providers={rent} /> : null}
                {buy?.length ? <ProviderGroup label="Buy" providers={buy} /> : null}
            </div>
            {link && (
                <p className="mt-4 text-[10px]" style={{ color: "var(--detail-muted)" }}>
                    Availability data via{" "}
                    <a href={link} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">
                        JustWatch
                    </a>
                </p>
            )}
        </div>
    );
}
