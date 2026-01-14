"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie"

interface AuthContextType {
    isLoggedIn: boolean;
    alias: string | null;
    mid: string | null;
    updateAuthState: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [alias, setAlias] = useState<string | null>(null);
    const [mid, setMid] = useState<string | null>(null);

    const updateAuthState = () => {
        const savedAlias = Cookies.get("alias");
        const savedMid = Cookies.get("mid");
        if (savedAlias && savedMid) {
            setIsLoggedIn(true);
            setAlias(decodeURIComponent(savedAlias));
            setMid(decodeURIComponent(savedMid));
        } else {
            setIsLoggedIn(false);
            setAlias(null);
            setMid(null);
        }
    };

    useEffect(() => {
        updateAuthState();
    }, []);

    const login = () => {
        const token = Cookies.get("token");
        const savedAlias = Cookies.get("alias");
        const savedMid = Cookies.get("mid");
        if (token) {
            setIsLoggedIn(true);
            setAlias(savedAlias || "게스트");
            setMid(savedMid || "")
        }
    };

    const logout = () => {
        Cookies.remove("alias");
        Cookies.remove("mid");
        updateAuthState();
        window.location.href = "/";
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, alias, mid, updateAuthState, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth는 AuthProvider 내에서 사용해야 합니다");
    return context;
};