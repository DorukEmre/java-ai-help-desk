import { useState, type ReactNode } from "react";

import { AuthContext, type AuthContextValue } from "@/auth/AuthContext";
import type { User, LoginResponse } from "@/types/auth";

const readAuthFromStorage = (): { token: string | null; user: User | null } => {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  // If one missing, clean up
  if (!token || !userRaw) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return { token: null, user: null };
  }

  try {
    const user = JSON.parse(userRaw) as User;
    return { token, user };
  } catch {
    // If JSON parse fail, clean up
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return { token: null, user: null };
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [{ token, user }, setAuth] = useState(readAuthFromStorage);

  // On user log in
  const setAuthSession = ({ accessToken, ...userData }: LoginResponse) => {

    setAuth({ token: accessToken, user: userData });

    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // On user log out 
  const clearAuthSession = () => {

    setAuth({ token: null, user: null });

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const isUserLoggedIn = Boolean(user && token);

  const value: AuthContextValue = {
    user,
    token,
    setAuthSession,
    clearAuthSession,
    isUserLoggedIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
