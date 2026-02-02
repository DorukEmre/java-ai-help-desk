import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext, type AuthContextValue } from "@/auth/AuthContext";
import type { User, LoginResponse } from "@/types/auth";


const readAuthFromStorage = (): { accessToken: string | null; user: User | null } => {
  const accessToken = localStorage.getItem("accessToken");
  const userRaw = localStorage.getItem("user");

  // If one missing, clean up
  if (!accessToken || !userRaw) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    return { accessToken: null, user: null };
  }

  try {
    const user = JSON.parse(userRaw) as User;
    return { accessToken, user };
  } catch {
    // If JSON parse fail, clean up
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    return { accessToken: null, user: null };
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const navigate = useNavigate();

  const [{ accessToken, user }, setAuth] = useState(readAuthFromStorage);

  // On user log in
  const setAuthSession = ({ accessToken, ...userData }: LoginResponse) => {

    setAuth({ accessToken: accessToken, user: userData });

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // On user log out 
  const clearAuthSession = () => {

    setAuth({ accessToken: null, user: null });

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    navigate("/login");

  };

  const isUserLoggedIn = Boolean(user && accessToken);

  const value: AuthContextValue = {
    user,
    accessToken,
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
