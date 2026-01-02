import Image from "next/image";
import Link from "next/link";
import {notFound} from "next/navigation";

import {FaPlay, FaPlayCircle} from "react-icons/fa";
import {IoMdAdd} from "react-icons/io";
import {BsCameraReelsFill} from "react-icons/bs";

import {getMovieById, getMovieCredits} from "@/src/lib/tmdb/movies";
import {MovieDetails} from "@/src/types/movie";
import {Cast} from "@/src/types/cast";
import {MovieCredits} from "@/src/types/movie";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

/* SEO */
export async function generateMetadata({params}: PageProps) {
    try {
        const {id} = await params;
        const movie = await getMovieById(id);

        return {
            title: `${movie.title} | RhinoMovies`,
            description: movie.overview || "Movie details"
        };
    } catch {
        return {
            title: "Movie | RhinoMovies",
            description: "Movie details"
        };
    }
}

export default async function MovieDetailsPage({params}: PageProps) {
    // ✅ UNWRAP PARAMS FIRST
    const {id} = await params;

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
        <div className=" w-full ">
            {/* Breadcrumb */}
            <nav className="relative z-20 px-6 py-4 text-sm flex gap-2 text-white">
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
            {backdropUrl && <Image src={backdropUrl} alt="" fill priority className="object-cover blur-2xl scale-110 opacity-40" />}

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />

            {/* Foreground image (main visual focus) */}
            {backdropUrl && <Image src={backdropUrl} alt="Backdrop" fill priority className="object-contain" />}

            {/* soft background blur */}
            {backdropUrl && <Image src={backdropUrl} alt="" fill className="object-cover blur-2xl opacity-40" />}

            {/* Play */}
            <div className="h-[80vh] flex items-center justify-center relative z-20">
                {movie.homepage && (
                    <Link href={movie.homepage} target="_blank" aria-label="Official movie site">
                        <FaPlayCircle size={120} className="text-imdb-lightgray hover:text-imdb-yellow transition" />
                    </Link>
                )}
            </div>

            {/* -----------------------------------Details section---------------------------- */}
            <section className="relative z-20 px-10 pb-10 bg-imdb-black/80 ">
                <div className="flex gap-8 mt-20 pt-10 flex-wrap lg:flex-nowrap">
                    {/* Poster */}
                    <div className="w-1/5 min-w-[200px]">
                        <Image
                            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/no-image-available.png"}
                            alt={`${movie.title} poster`}
                            width={225}
                            height={340}
                            priority
                        />

                        {/* Rating */}
                        <div className="w-full bg-gray-700 h-2 rounded mt-3">
                            <div className="bg-green-500 h-2 rounded" style={{width: `${(movie.vote_average / 10) * 100}%`}} />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-white text-sm space-y-4">
                        <div className="flex gap-4">
                            <button className="flex items-center gap-2 bg-imdb-yellow text-black py-2 px-4 rounded-full">
                                <FaPlay /> Watch Now
                            </button>
                            <button className="flex items-center gap-2 bg-imdb-lightgray text-black py-2 px-4 rounded-full">
                                <IoMdAdd /> Add to Favourites
                            </button>
                        </div>

                        <h1 className="text-3xl font-bold">{movie.title}</h1>

                        <div className="flex gap-4 items-center">
                            <span className="flex items-center gap-2 bg-white text-black px-2 py-1 rounded">
                                <BsCameraReelsFill /> Trailer
                            </span>
                            <span className="border px-2 py-1 rounded">HD</span>
                            <span className="text-imdb-yellow font-bold">IMDb {movie.vote_average.toFixed(1)}</span>
                        </div>

                        <p className="text-gray-300 max-w-3xl">{movie.overview}</p>

                        <div className="space-y-1">
                            <p>Released: {movie.release_date}</p>
                            <p>Duration: {movie.runtime ? `${movie.runtime} min` : "N/A"}</p>
                            <p>Countries: {movie.production_countries.map((c) => c.name).join(", ")}</p>
                            <p>Genres: {movie.genres.map((g) => g.name).join(", ")}</p>
                        </div>

                        {/* Cast */}
                        {casts.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-2">Top Cast</h2>
                                <div className="flex gap-4 overflow-x-auto pb-2">
                                    {casts.slice(0, 8).map((cast) => (
                                        <div key={cast.id} className="w-28 text-center">
                                            <Image
                                                src={cast.profile_path ? `https://image.tmdb.org/t/p/w200${cast.profile_path}` : "/no-image-available.png"}
                                                alt={cast.name}
                                                width={100}
                                                height={150}
                                            />
                                            <p className="text-sm font-medium mt-1">{cast.name}</p>
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
