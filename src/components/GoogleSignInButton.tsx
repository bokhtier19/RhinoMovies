"use client";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export function GoogleSignInButton() {
    return (
        <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="flex w-full items-center justify-center gap-3 rounded-xl px-5 py-3 text-sm font-semibold text-gray-900 transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#ffffff" }}
        >
            <FcGoogle size={20} />
            Continue with Google
        </button>
    );
}
