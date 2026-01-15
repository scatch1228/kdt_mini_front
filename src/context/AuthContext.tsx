"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
    isLoggedIn: boolean;
    userInfo: { alias: string; mid: string } | null;
    accessToken: string | null;
    login: (alias: string, mid: string, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{ alias: string; mid: string } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user_info");
    if (savedUser) {
      setUserInfo(JSON.parse(savedUser));
    }
  }, []);

  const isLoggedIn = !!userInfo; 

  const login = (alias: string, mid: string, token: string) => {
    localStorage.setItem("user_info", JSON.stringify({ alias, mid }));
    setAccessToken(token);
    setUserInfo({ alias, mid });
  };

  const logout = () => {
    localStorage.removeItem("user_info");
    setAccessToken(null);
    setUserInfo(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userInfo, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth는 AuthProvider 내에서 사용해야 합니다");
    return context;
};
