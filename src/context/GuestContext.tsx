"use client";
import { createContext, useContext, useState, useEffect } from "react";

type GuestContextType = {
    isGuest: boolean;
    enterGuestMode: () => void;
    exitGuestMode: () => void;
};

const GuestContext = createContext<GuestContextType>({
    isGuest: false,
    enterGuestMode: () => {},
    exitGuestMode: () => {},
});

export function GuestProvider({ children }: { children: React.ReactNode }) {
    const [isGuest, setIsGuest] = useState(false);

    useEffect(() => {
        setIsGuest(localStorage.getItem("rhino_guest") === "true");
    }, []);

    const enterGuestMode = () => {
        localStorage.setItem("rhino_guest", "true");
        setIsGuest(true);
    };

    const exitGuestMode = () => {
        localStorage.removeItem("rhino_guest");
        localStorage.removeItem("rhino_guest_watchlist");
        localStorage.removeItem("rhino_guest_ratings");
        localStorage.removeItem("rhino_guest_history");
        setIsGuest(false);
    };

    return (
        <GuestContext.Provider value={{ isGuest, enterGuestMode, exitGuestMode }}>
            {children}
        </GuestContext.Provider>
    );
}

export const useGuest = () => useContext(GuestContext);
