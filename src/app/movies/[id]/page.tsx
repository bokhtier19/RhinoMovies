import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FaPlay, FaPlayCircle } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { BsCameraReelsFill } from "react-icons/bs";

import { getMovieById, getMovieCredits } from "@/src/lib/tmdb/movies";
import { MovieDetails } from "@/src/types/movie";
import { Cast } from "@/src/types/cast";
import { MovieCredits } from "@/src/types/movie";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

/* SEO */
export async function generateMetadata({ params }: PageProps) {
    try {
        const { id } = await params;
        const movie = await getMovieById(id);

        return {
            title: `${movie.title} | RhinoMovies`,
            description: movie.overview || "Movie details",
        };
    } catch {
        return {
            title: "Movie | RhinoMovies",
            description: "Movie details",
        };
    }
}

export default async function MovieDetailsPage({ params }: PageProps) {
    // ✅ UNWRAP PARAMS FIRST
    const { id } = await params;

    /* -------------------------------
       REQUIRED DATA (controls 404)
    -------------------------------- */
    let movie: MovieDetails;

    try {
        movie = await getMovieById(id);
    } catch {
        notFound();
    }

    /* -------------------------------
       OPTIONAL DATA (never 404s)
    -------------------------------- */
    let credits: MovieCredits | null = null;

    try {
        credits = await getMovieCredits(id);
    } catch {
        credits = null;
    }

    const casts: Cast[] = credits?.cast ?? [];

    const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null;

    return (
        <div className="w-full">
            {/* Breadcrumb */}
            <nav className="relative z-20 flex gap-2 px-6 py-4 text-sm text-white">
                <Link href="/" className="hover:text-imdb-yellow">
                    Home
                </Link>
                <span>/</span>
                <Link href="/movies" className="hover:text-imdb-yellow">
                    Movies
                </Link>
                <span>/</span>
                <span className="truncate">{movie.title}</span>
            </nav>

            {/* Blurred background (fills screen) */}
            {backdropUrl && (
                <Image src={backdropUrl} alt="" fill priority className="scale-110 object-cover opacity-40 blur-2xl" />
            )}

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />

            {/* Foreground image (main visual focus) */}
            {backdropUrl && <Image src={backdropUrl} alt="Backdrop" fill priority className="object-contain" />}

            {/* soft background blur */}
            {backdropUrl && <Image src={backdropUrl} alt="" fill className="object-cover opacity-40 blur-2xl" />}

            {/* Play */}
            <div className="relative z-20 flex h-[80vh] items-center justify-center">
                {movie.homepage && (
                    <Link href={movie.homepage} target="_blank" aria-label="Official movie site">
                        <FaPlayCircle size={120} className="text-imdb-lightgray hover:text-imdb-yellow transition" />
                    </Link>
                )}
            </div>

            {/* -----------------------------------Details section---------------------------- */}
            <section className="bg-imdb-black/80 relative z-20 px-10 pb-10">
                <div className="mt-20 flex flex-wrap gap-8 pt-10 lg:flex-nowrap">
                    {/* Poster */}
                    <div className="w-1/5 min-w-[200px]">
                        <Image
                            src={
                                movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                    : "/no-image-available.png"
                            }
                            alt={`${movie.title} poster`}
                            width={225}
                            height={340}
                            priority
                        />

                        {/* Rating */}
                        <div className="mt-3 h-2 w-full rounded bg-gray-700">
                            <div
                                className="h-2 rounded bg-green-500"
                                style={{ width: `${(movie.vote_average / 10) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-4 text-sm text-white">
                        <div className="flex gap-4">
                            <button className="bg-imdb-yellow flex items-center gap-2 rounded-full px-4 py-2 text-black">
                                <FaPlay /> Watch Now
                            </button>
                            <button className="bg-imdb-lightgray flex items-center gap-2 rounded-full px-4 py-2 text-black">
                                <IoMdAdd /> Add to Favourites
                            </button>
                        </div>

                        <h1 className="text-3xl font-bold">{movie.title}</h1>

                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-2 rounded bg-white px-2 py-1 text-black">
                                <BsCameraReelsFill /> Trailer
                            </span>
                            <span className="rounded border px-2 py-1">HD</span>
                            <span className="text-imdb-yellow font-bold">IMDb {movie.vote_average.toFixed(1)}</span>
                        </div>

                        <p className="max-w-3xl text-gray-300">{movie.overview}</p>

                        <div className="space-y-1">
                            <p>Released: {movie.release_date}</p>
                            <p>Duration: {movie.runtime ? `${movie.runtime} min` : "N/A"}</p>
                            <p>Countries: {movie.production_countries.map((c) => c.name).join(", ")}</p>
                            <p>Genres: {movie.genres.map((g) => g.name).join(", ")}</p>
                        </div>

                        {/* Cast */}
                        {casts.length > 0 && (
                            <div>
                                <h2 className="mb-2 text-xl font-semibold">Top Cast</h2>
                                <div className="flex gap-4 overflow-x-auto pb-2">
                                    {casts.slice(0, 8).map((cast) => (
                                        <div key={cast.id} className="w-28 text-center">
                                            <Image
                                                src={
                                                    cast.profile_path
                                                        ? `https://image.tmdb.org/t/p/w200${cast.profile_path}`
                                                        : "/no-image-available.png"
                                                }
                                                alt={cast.name}
                                                width={100}
                                                height={150}
                                            />
                                            <p className="mt-1 text-sm font-medium">{cast.name}</p>
                                            <p className="text-xs text-gray-400">{cast.character}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
