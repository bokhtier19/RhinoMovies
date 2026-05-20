import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FaPlayCircle } from "react-icons/fa";
import { BsCameraReelsFill } from "react-icons/bs";
import { HiChevronRight } from "react-icons/hi";

import { getTVShowById, getTVCredits, getTVVideos, getTVRecommendations, getTVSimilar, getTVWatchProviders } from "@/src/lib/tmdb/tv";
import { LikeDislike } from "@/src/components/LikeDislike";
import { WatchButton } from "@/src/components/WatchButton";
import { FavouriteButton } from "@/src/components/FavouriteButton";
import { CopyCardButton } from "@/src/components/CopyCardButton";
import { HistoryTracker } from "@/src/components/HistoryTracker";
import { StreamingProviders } from "@/src/components/StreamingProviders";
import { MediaRow } from "@/src/components/MediaRow";
import { TVShowDetails, TVShowCredits, TVShow } from "@/src/types/tv";
import { WatchProvider } from "@/src/types/common";
import { Cast } from "@/src/types/cast";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    try {
        const { id } = await params;
        const show = await getTVShowById(id);
        return { title: `${show.name} | RhinoMovies`, description: show.overview || "TV show details" };
    } catch {
        return { title: "TV Show | RhinoMovies", description: "TV show details" };
    }
}

function MetaRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--detail-accent)" }}>
                {label}
            </span>
            <span className="text-sm" style={{ color: "var(--detail-meta-value)" }}>
                {value || "N/A"}
            </span>
        </div>
    );
}

export default async function TVShowDetailsPage({ params }: PageProps) {
    const { id } = await params;

    let show: TVShowDetails;
    try {
        show = await getTVShowById(id);
    } catch {
        notFound();
    }

    let credits: TVShowCredits | null = null;
    let trailerKey: string | null = null;
    let relatedItems: TVShow[] = [];
    let providerData: { link: string; flatrate?: WatchProvider[]; rent?: WatchProvider[]; buy?: WatchProvider[] } | undefined;

    try {
        const [c, , recsResult, similarResult, providersResult] = await Promise.all([
            getTVCredits(id).catch(() => null),
            getTVVideos(id).then((v) => {
                const trailer = v.results.find((r) => r.site === "YouTube" && r.type === "Trailer") ?? v.results.find((r) => r.site === "YouTube");
                trailerKey = trailer?.key ?? null;
            }).catch(() => null),
            getTVRecommendations(id).catch(() => null),
            getTVSimilar(id).catch(() => null),
            getTVWatchProviders(id).catch(() => null),
        ]);
        credits = c;

        const seen = new Set<number>();
        for (const item of [...(recsResult?.results ?? []), ...(similarResult?.results ?? [])]) {
            if (!seen.has(item.id)) { seen.add(item.id); relatedItems.push(item); }
        }
        relatedItems = relatedItems.slice(0, 12);

        const pr = providersResult?.results;
        providerData = pr?.["US"] ?? (pr ? Object.values(pr)[0] : undefined);
    } catch {
        credits = null;
    }

    const casts: Cast[] = credits?.cast ?? [];
    const backdropUrl = show.backdrop_path
        ? `https://image.tmdb.org/t/p/original${show.backdrop_path}`
        : show.poster_path
        ? `https://image.tmdb.org/t/p/original${show.poster_path}`
        : null;

    return (
        <div>
            {/* ── HERO ── */}
            <div className="relative h-[50vh] w-full overflow-hidden sm:h-[65vh] md:h-[82vh]">
                {backdropUrl && (
                    <Image src={backdropUrl} alt="Backdrop" fill priority className="object-cover object-top" />
                )}
                <div
                    className="absolute inset-0"
                    style={{
                        background: "linear-gradient(to top, var(--detail-bg) 0%, var(--detail-bg-transparent) 15%, rgba(0,0,0,0.3) 60%, transparent 100%)",
                    }}
                />

                <div className="relative z-10 flex h-full flex-col">
                    <nav className="flex min-w-0 items-center gap-1 px-4 py-3 text-xs text-white/70 sm:gap-1.5 sm:px-6 sm:py-4 sm:text-sm">
                        <Link href="/" className="shrink-0 transition-colors hover:text-white">Home</Link>
                        <HiChevronRight size={12} className="shrink-0" />
                        <Link href="/shows" className="shrink-0 transition-colors hover:text-white">TV Shows</Link>
                        <HiChevronRight size={12} className="shrink-0" />
                        <span className="min-w-0 truncate font-medium text-white">{show.name}</span>
                    </nav>

                    <div className="flex flex-1 items-center justify-center">
                        {show.homepage ? (
                            <Link href={show.homepage} target="_blank" aria-label="Watch">
                                <FaPlayCircle
                                    size={96}
                                    className="h-16 w-16 text-white/75 transition-colors hover:text-[#f5c518] sm:h-20 sm:w-20 md:h-24 md:w-24"
                                />
                            </Link>
                        ) : (
                            <FaPlayCircle
                                size={96}
                                className="h-16 w-16 text-white/20 sm:h-20 sm:w-20 md:h-24 md:w-24"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* ── DETAILS ── */}
            <section style={{ backgroundColor: "var(--detail-bg)" }}>
                <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 md:py-10">
                    <div className="grid grid-cols-[110px_1fr] gap-x-4 gap-y-4 sm:grid-cols-[180px_1fr] sm:gap-x-6 sm:gap-y-5 md:grid-cols-[200px_1fr] md:gap-x-8 md:gap-y-6">

                        {/* Poster + rating */}
                        <div className="self-start sm:row-span-2">
                            {show.poster_path ? (
                                <Image
                                    src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                                    alt={`${show.name} poster`}
                                    width={200}
                                    height={300}
                                    priority
                                    className="w-full rounded-lg shadow-xl"
                                />
                            ) : (
                                <div className="flex w-full aspect-[2/3] flex-col items-center justify-center gap-3 rounded-lg shadow-xl" style={{ backgroundColor: "var(--surface)", color: "var(--muted)" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                                    <span className="text-xs font-medium text-center px-4 leading-snug">Poster Not Available</span>
                                </div>
                            )}
                            <div className="mt-2 h-1.5 w-full rounded-full" style={{ backgroundColor: "var(--detail-track-bg)" }}>
                                <div
                                    className="h-1.5 rounded-full"
                                    style={{
                                        width: `${(show.vote_average / 10) * 100}%`,
                                        backgroundColor: show.vote_average >= 7 ? "#22c55e" : show.vote_average >= 4 ? "#f59e0b" : "#ef4444",
                                    }}
                                />
                            </div>
                            <p className="mt-1 text-center text-xs" style={{ color: "var(--detail-muted)" }}>
                                {show.vote_average.toFixed(1)} / 10
                            </p>
                            <LikeDislike id={show.id} type="tv" title={show.name} poster_path={show.poster_path} />
                        </div>

                        {/* Row 1 col 2: title + buttons */}
                        <div className="self-start space-y-2 sm:space-y-3">
                            <h1 className="text-lg font-bold leading-tight sm:text-2xl md:text-3xl" style={{ color: "var(--detail-title)" }}>
                                {show.name}
                            </h1>
                            <div className="flex flex-wrap gap-2">
                                <WatchButton videoKey={trailerKey} />
                                <FavouriteButton id={show.id} type="tv" title={show.name} poster_path={show.poster_path} />
                                <CopyCardButton
                                    id={show.id}
                                    mediaType="tv"
                                    title={show.name}
                                    year={show.first_air_date?.split("-")[0] ?? ""}
                                    rating={show.vote_average}
                                    seasons={show.number_of_seasons}
                                    genres={show.genres.map((g) => g.name)}
                                    overview={show.overview}
                                />
                            </div>
                            <HistoryTracker id={show.id} type="tv" title={show.name} poster_path={show.poster_path} />
                        </div>

                        {/* Row 2: full-width on mobile, col-2-only on sm+ */}
                        <div className="col-span-2 space-y-3 sm:col-span-1 sm:space-y-4 md:space-y-5">

                            {/* Tags */}
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                <span
                                    className="flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium"
                                    style={{ backgroundColor: "var(--detail-tag-bg)", color: "var(--detail-title)" }}
                                >
                                    <BsCameraReelsFill /> Trailer
                                </span>
                                <span
                                    className="rounded border px-2 py-1 text-xs font-medium"
                                    style={{ borderColor: "var(--detail-tag-border)", color: "var(--detail-muted)" }}
                                >
                                    HD
                                </span>
                                <span className="text-sm font-bold" style={{ color: "var(--detail-accent)" }}>
                                    ★ {show.vote_average.toFixed(1)} IMDb
                                </span>
                            </div>

                            {/* Overview */}
                            <p className="text-sm leading-relaxed sm:text-base" style={{ color: "var(--detail-body)" }}>
                                {show.overview}
                            </p>

                            {/* Metadata */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 sm:gap-x-8 md:gap-x-10 md:gap-y-4">
                                <MetaRow label="First Aired" value={show.first_air_date} />
                                <MetaRow label="Seasons" value={show.number_of_seasons ? `${show.number_of_seasons}` : "N/A"} />
                                <MetaRow label="Episodes" value={show.number_of_episodes ? `${show.number_of_episodes}` : "N/A"} />
                                <MetaRow label="Genres" value={show.genres.map((g) => g.name).join(", ")} />
                                <MetaRow
                                    label="Studios"
                                    value={show.production_companies.map((c) => c.name).join(", ")}
                                />
                            </div>

                            {/* Cast */}
                            {casts.length > 0 && (
                                <div>
                                    <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest sm:mb-3" style={{ color: "var(--detail-accent)" }}>
                                        Top Cast
                                    </h2>
                                    <div className="flex flex-wrap gap-3 sm:gap-4">
                                        {casts.slice(0, 10).map((cast) => (
                                            <div key={cast.id} className="w-14 text-center sm:w-20">
                                                {cast.profile_path ? (
                                                    <Image
                                                        src={`https://image.tmdb.org/t/p/w200${cast.profile_path}`}
                                                        alt={cast.name}
                                                        width={80}
                                                        height={110}
                                                        className="w-full rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div
                                                        className="flex w-full items-center justify-center rounded-lg aspect-[8/11] text-center"
                                                        style={{ backgroundColor: "var(--detail-tag-bg)", color: "var(--detail-muted)", fontSize: "8px", lineHeight: 1.3 }}
                                                    >
                                                        Image not available
                                                    </div>
                                                )}
                                                <p className="mt-1 text-[10px] font-semibold leading-tight sm:text-xs" style={{ color: "var(--detail-title)" }}>
                                                    {cast.name}
                                                </p>
                                                <p className="text-[9px] leading-tight sm:text-[10px]" style={{ color: "var(--detail-muted)" }}>
                                                    {cast.character}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Where to Watch — same column as cast, below */}
                            {providerData && (
                                <StreamingProviders
                                    flatrate={providerData.flatrate}
                                    rent={providerData.rent}
                                    buy={providerData.buy}
                                    link={providerData.link}
                                    compact
                                />
                            )}
                        </div>

                    </div>
                </div>
            </section>

            <div style={{ backgroundColor: "var(--detail-bg)" }}>
                <MediaRow title="You Might Also Like" items={relatedItems} mediaType="tv" />
            </div>
        </div>
    );
}
