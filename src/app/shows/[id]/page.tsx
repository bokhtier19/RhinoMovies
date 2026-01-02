import Image from "next/image";
import Link from "next/link";
import {notFound} from "next/navigation";

import {FaPlay, FaPlayCircle} from "react-icons/fa";
import {IoMdAdd} from "react-icons/io";
import {BsCameraReelsFill} from "react-icons/bs";

import {getTVShowById, getTVCredits} from "@/src/lib/tmdb/tv";
import {TVShowDetails, TVShowCredits} from "@/src/types/tv";
import {Cast} from "@/src/types/cast";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

/* -------------------------------
   SEO (must never throw)
-------------------------------- */
export async function generateMetadata({params}: PageProps) {
    try {
        const {id} = await params;
        const show = await getTVShowById(id);

        return {
            title: `${show.name} | RhinoMovies`,
            description: show.overview || "TV show details"
        };
    } catch {
        return {
            title: "TV Show | RhinoMovies",
            description: "TV show details"
        };
    }
}

export default async function TVShowDetailsPage({params}: PageProps) {
    // ✅ unwrap async params
    const {id} = await params;

    /* -------------------------------
       REQUIRED DATA (controls 404)
    -------------------------------- */
    let show: TVShowDetails;

    try {
        show = await getTVShowById(id);
    } catch {
        notFound();
    }

    /* -------------------------------
       OPTIONAL DATA (never 404s)
    -------------------------------- */
    let casts: Cast[] = [];

    try {
        const credits: TVShowCredits = await getTVCredits(id);
        casts = credits.cast ?? [];
    } catch {
        casts = [];
    }

    const backdropUrl = show.backdrop_path ? `https://image.tmdb.org/t/p/original${show.backdrop_path}` : show.poster_path ? `https://image.tmdb.org/t/p/original${show.poster_path}` : null;

    return (
        <div className="w-full">
            {/* Blurred background (fills screen) */}
            {backdropUrl && <Image src={backdropUrl} alt="" fill priority className="object-cover blur-2xl scale-110 opacity-40" />}

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />

            {/* Foreground image (main visual focus) */}
            {backdropUrl && <Image src={backdropUrl} alt="Backdrop" fill priority className="object-contain" />}

            {/* soft background blur */}
            {backdropUrl && <Image src={backdropUrl} alt="" fill className="object-cover blur-2xl opacity-40" />}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-imdb-black via-imdb-black/90 to-transparent" />

            {/* Breadcrumb */}
            <nav className="relative z-20 px-6 py-4 text-sm flex gap-2 text-white">
                <Link href="/" className="hover:text-imdb-yellow">
                    Home
                </Link>
                <span>/</span>
                <Link href="/shows" className="hover:text-imdb-yellow">
                    Shows
                </Link>
                <span>/</span>
                <span className="truncate">{show.name}</span>
            </nav>

            {/* Play */}
            <div className="h-[80vh] flex items-center justify-center relative z-20">
                {show.homepage && (
                    <Link href={show.homepage} target="_blank" aria-label="Official show site">
                        <FaPlayCircle size={120} className="text-imdb-lightgray hover:text-imdb-yellow transition" />
                    </Link>
                )}
            </div>

            {/* Content */}
            <section className=" z-20 px-10 pb-10 bg-imdb-black/80">
                <div className="flex gap-8 mt-20 pt-10 flex-wrap lg:flex-nowrap justify-center items-center">
                    {/* Poster */}
                    <div className="w-1/5 min-w-[200px] flex items-center flex-col justify-center">
                        <Image
                            src={show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : "/no-image-available.png"}
                            alt={`${show.name} poster`}
                            width={225}
                            height={340}
                            priority
                        />

                        {/* Rating */}
                        <div className="w-full bg-gray-700 h-2 rounded mt-3">
                            <div
                                className="bg-green-500 h-2 rounded"
                                style={{
                                    width: `${(show.vote_average / 10) * 100}%`
                                }}
                            />
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

                        <h1 className="text-3xl font-bold">{show.name}</h1>

                        <div className="flex gap-4 items-center">
                            <span className="flex items-center gap-2 bg-white text-black px-2 py-1 rounded">
                                <BsCameraReelsFill /> Trailer
                            </span>
                            <span className="border px-2 py-1 rounded">HD</span>
                            <span className="text-imdb-yellow font-bold">IMDb {show.vote_average.toFixed(1)}</span>
                        </div>

                        <p className="text-gray-300 max-w-3xl">{show.overview}</p>

                        <div className="space-y-1">
                            <p>Seasons: {show.number_of_seasons}</p>
                            <p>Episodes: {show.number_of_episodes}</p>
                            <p>First Air Date: {show.first_air_date}</p>
                            <p>Genres: {show.genres.map((g) => g.name).join(", ")}</p>
                            <p>Production Companies: {show.production_companies.map((c) => c.name).join(", ")}</p>
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
