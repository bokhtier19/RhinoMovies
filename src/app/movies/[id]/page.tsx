import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FaPlayCircle } from "react-icons/fa";
import { BsCameraReelsFill } from "react-icons/bs";
import { HiChevronRight } from "react-icons/hi";

import { getMovieById, getMovieCredits, getMovieVideos } from "@/src/lib/tmdb/movies";
import { LikeDislike } from "@/src/components/LikeDislike";
import { WatchButton } from "@/src/components/WatchButton";
import { FavouriteButton } from "@/src/components/FavouriteButton";
import { MovieDetails, MovieCredits } from "@/src/types/movie";
import { Cast } from "@/src/types/cast";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    try {
        const { id } = await params;
        const movie = await getMovieById(id);
        return { title: `${movie.title} | RhinoMovies`, description: movie.overview || "Movie details" };
    } catch {
        return { title: "Movie | RhinoMovies", description: "Movie details" };
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

export default async function MovieDetailsPage({ params }: PageProps) {
    const { id } = await params;

    let movie: MovieDetails;
    try {
        movie = await getMovieById(id);
    } catch {
        notFound();
    }

    let credits: MovieCredits | null = null;
    let trailerKey: string | null = null;
    try {
        [credits] = await Promise.all([
            getMovieCredits(id).catch(() => null),
            getMovieVideos(id).then((v) => {
                const trailer = v.results.find((r) => r.site === "YouTube" && r.type === "Trailer") ?? v.results.find((r) => r.site === "YouTube");
                trailerKey = trailer?.key ?? null;
            }).catch(() => {}),
        ]);
    } catch {
        credits = null;
    }

    const casts: Cast[] = credits?.cast ?? [];
    const backdropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
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
                        <Link href="/movies" className="shrink-0 transition-colors hover:text-white">Movies</Link>
                        <HiChevronRight size={12} className="shrink-0" />
                        <span className="min-w-0 truncate font-medium text-white">{movie.title}</span>
                    </nav>

                    <div className="flex flex-1 items-center justify-center">
                        {movie.homepage ? (
                            <Link href={movie.homepage} target="_blank" aria-label="Watch">
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
                            {movie.poster_path ? (
                                <Image
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={`${movie.title} poster`}
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
                                        width: `${(movie.vote_average / 10) * 100}%`,
                                        backgroundColor: movie.vote_average >= 7 ? "#22c55e" : movie.vote_average >= 4 ? "#f59e0b" : "#ef4444",
                                    }}
                                />
                            </div>
                            <p className="mt-1 text-center text-xs" style={{ color: "var(--detail-muted)" }}>
                                {movie.vote_average.toFixed(1)} / 10
                            </p>
                            <LikeDislike />
                        </div>

                        {/* Row 1 col 2: title + buttons */}
                        <div className="self-start space-y-2 sm:space-y-3">
                            <h1 className="text-lg font-bold leading-tight sm:text-2xl md:text-3xl" style={{ color: "var(--detail-title)" }}>
                                {movie.title}
                            </h1>
                            <div className="flex flex-wrap gap-2">
                                <WatchButton videoKey={trailerKey} />
                                <FavouriteButton id={movie.id} type="movie" title={movie.title} poster_path={movie.poster_path} />
                            </div>
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
                                    ★ {movie.vote_average.toFixed(1)} IMDb
                                </span>
                            </div>

                            {/* Overview */}
                            <p className="text-sm leading-relaxed sm:text-base" style={{ color: "var(--detail-body)" }}>
                                {movie.overview}
                            </p>

                            {/* Metadata */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 sm:gap-x-8 md:gap-x-10 md:gap-y-4">
                                <MetaRow label="Released" value={movie.release_date} />
                                <MetaRow label="Runtime" value={movie.runtime ? `${movie.runtime} min` : "N/A"} />
                                <MetaRow
                                    label="Countries"
                                    value={movie.production_countries.map((c) => c.name).join(", ")}
                                />
                                <MetaRow label="Genres" value={movie.genres.map((g) => g.name).join(", ")} />
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
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
