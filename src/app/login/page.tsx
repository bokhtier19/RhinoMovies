import { redirect } from "next/navigation";
import { auth, signIn } from "@/src/auth";
import { PiFilmReelFill } from "react-icons/pi";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { GuestLoginButton } from "@/src/components/GuestLoginButton";

export const metadata = { title: "Sign In | RhinoMovies" };

export default async function LoginPage() {
    const session = await auth();
    if (session?.user) redirect("/");

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4">
            <div
                className="w-full max-w-sm rounded-2xl p-8 shadow-2xl"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
            >
                <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center gap-2">
                        <PiFilmReelFill size={32} style={{ color: "#f5c518" }} />
                        <span className="text-xl font-extrabold uppercase tracking-wider">
                            <span style={{ color: "#f5c518" }}>Rhino</span>
                            <span style={{ color: "var(--foreground)" }}>Movies</span>
                        </span>
                    </div>

                    <div className="text-center">
                        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Welcome back</h1>
                        <p className="mt-1.5 text-sm" style={{ color: "var(--muted)" }}>
                            Sign in to sync your watchlist and ratings across devices.
                        </p>
                    </div>

                    <form
                        action={async () => {
                            "use server";
                            await signIn("google", { redirectTo: "/" });
                        }}
                        className="w-full"
                    >
                        <button
                            type="submit"
                            className="flex w-full items-center justify-center gap-3 rounded-xl px-5 py-3 text-sm font-semibold text-gray-900 transition-opacity hover:opacity-90"
                            style={{ backgroundColor: "#ffffff" }}
                        >
                            <FcGoogle size={20} />
                            Continue with Google
                        </button>
                    </form>

                    <div className="flex w-full items-center gap-3">
                        <div className="flex-1 border-t" style={{ borderColor: "var(--border)" }} />
                        <span className="text-xs" style={{ color: "var(--muted)" }}>or</span>
                        <div className="flex-1 border-t" style={{ borderColor: "var(--border)" }} />
                    </div>

                    <GuestLoginButton />

                    <p className="text-center text-[11px] leading-relaxed" style={{ color: "var(--muted)" }}>
                        Guest data lives only in your browser tab.
                        <br />
                        Closing it will erase your watchlist and ratings.
                    </p>

                    <Link href="/" className="text-xs transition-colors hover:text-[#f5c518]" style={{ color: "var(--muted)" }}>
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}
