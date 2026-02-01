import { createContext } from "react";

import type { User, LoginResponse } from "@/types/auth";

export interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  setAuthSession: (data: LoginResponse) => void;
  clearAuthSession: () => void;
  isUserLoggedIn: boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
