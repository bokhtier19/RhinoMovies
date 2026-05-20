"use client";
import { useRouter } from "next/navigation";
import { useGuest } from "@/src/context/GuestContext";

export function GuestLoginButton() {
    const { enterGuestMode } = useGuest();
    const router = useRouter();

    const handleGuest = () => {
        enterGuestMode();
        router.push("/");
    };

    return (
        <button
            onClick={handleGuest}
            className="w-full rounded-xl border px-5 py-3 text-sm font-medium transition-colors hover:border-gray-400"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
            Continue as Guest
        </button>
    );
}
