import { createContext } from "react";

import type { User, LoginResponse } from "@/types/auth";

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  setAuthSession: (data: LoginResponse) => void;
  clearAuthSession: () => void;
  isUserLoggedIn: boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
