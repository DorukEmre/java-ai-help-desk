import { useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { AuthContext, type AuthContextValue } from "@/auth/AuthContext";
import type { User, LoginResponse } from "@/types/auth";
import { getBaseUrl } from "@/utils/globals";


export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const navigate = useNavigate();

  const [{ accessToken, user }, setAuth] = useState<{
    accessToken: string | null;
    user: User | null;
  }>({
    accessToken: null,
    user: null
  });

  // Refresh request on app load
  useEffect(() => {
    const refresh = async () => {
      try {

        const url = getBaseUrl() + "/refresh";
        const response = await axios.post(
          url,
          {},
          { withCredentials: true, }
        );

        const data: LoginResponse = response.data;
        console.debug("AuthProvider refresh: ", data)

        setAuth({
          accessToken: data.accessToken,
          user: {
            id: data.id,
            username: data.username,
            fullname: data.fullname,
            role: data.role
          }
        });
      } catch {
        setAuth({ accessToken: null, user: null });

      }
    };

    refresh();
  }, []);

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
