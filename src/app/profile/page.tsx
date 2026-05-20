import { auth, signOut } from "@/src/auth";
import Image from "next/image";
import Link from "next/link";
import { createSupabaseClient } from "@/src/lib/supabase";
import { ProfileTabs } from "@/src/components/ProfileTabs";
import { GuestProfile } from "@/src/components/GuestProfile";

export const metadata = { title: "Profile | RhinoMovies" };

interface PageProps {
    searchParams: Promise<{ tab?: string }>;
}

async function getProfileData(email: string) {
    const db = createSupabaseClient();
    const [watchlistRes, ratingsRes, historyRes] = await Promise.all([
        db.from("watchlist").select("*").eq("user_email", email).order("created_at", { ascending: false }),
        db.from("ratings").select("*").eq("user_email", email).order("created_at", { ascending: false }),
        db.from("watch_history").select("*").eq("user_email", email).order("viewed_at", { ascending: false }).limit(50),
    ]);
    return {
        watchlist: watchlistRes.data ?? [],
        ratings: ratingsRes.data ?? [],
        history: historyRes.data ?? [],
    };
}

export default async function ProfilePage({ searchParams }: PageProps) {
    const { tab } = await searchParams;
    const session = await auth();

    if (!session?.user?.email) {
        return <GuestProfile defaultTab={tab} />;
    }

    const { watchlist, ratings, history } = await getProfileData(session.user.email);

    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
            <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">

                {/* Header */}
                <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
                    {session.user.image ? (
                        <Image
                            src={session.user.image}
                            alt="Avatar"
                            width={80}
                            height={80}
                            className="rounded-full ring-2 ring-[#f5c518]"
                        />
                    ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-black ring-2 ring-[#f5c518]" style={{ backgroundColor: "#f5c518" }}>
                            {session.user.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                    )}
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
                            {session.user.name ?? "User"}
                        </h1>
                        <p className="text-sm" style={{ color: "var(--muted)" }}>{session.user.email}</p>
                        <div className="mt-2 flex flex-wrap justify-center gap-4 text-sm sm:justify-start" style={{ color: "var(--muted)" }}>
                            <span><strong style={{ color: "var(--foreground)" }}>{watchlist.length}</strong> saved</span>
                            <span><strong style={{ color: "var(--foreground)" }}>{ratings.length}</strong> rated</span>
                            <span><strong style={{ color: "var(--foreground)" }}>{history.length}</strong> watched</span>
                        </div>
                    </div>
                    <form
                        action={async () => {
                            "use server";
                            await signOut({ redirectTo: "/" });
                        }}
                        className="sm:ml-auto"
                    >
                        <button
                            type="submit"
                            className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:border-red-500 hover:text-red-500"
                            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                        >
                            Sign out
                        </button>
                    </form>
                </div>

                <ProfileTabs watchlist={watchlist} ratings={ratings} history={history} defaultTab={tab} />
            </div>
        </div>
    );
}
