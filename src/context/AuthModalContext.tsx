"use client";
import { createContext, useContext, useState } from "react";

type AuthModalContextType = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
};

const AuthModalContext = createContext<AuthModalContextType>({
    isOpen: false,
    open: () => {},
    close: () => {},
});

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <AuthModalContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
            {children}
        </AuthModalContext.Provider>
    );
}

export const useAuthModal = () => useContext(AuthModalContext);
