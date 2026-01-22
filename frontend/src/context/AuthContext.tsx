import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import type { User, LoginResponse } from "@/types/auth";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  setAuthSession: (data: LoginResponse) => void;
  clearAuthSession: () => void;
  isUserLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Rehydrate auth state on refresh
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // On user log in
  const setAuthSession = ({ accessToken, ...userData }: LoginResponse) => {
    setToken(accessToken);
    setUser(userData);

    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // On user log out 
  const clearAuthSession = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // User is logged in if user && token
  const isUserLoggedIn = (user && token) ? true : false;

  return (
    <AuthContext.Provider value={{ user, token, setAuthSession, clearAuthSession, isUserLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
