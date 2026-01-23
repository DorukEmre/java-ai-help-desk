import { useMemo } from "react";
import axios from "axios";

import { useAuth } from "@/auth/useAuth";
import { getBaseUrl } from "@/utils/globals";


export const useAuthApi = () => {
  const { token } = useAuth();

  const authApi = useMemo(() => {

    const instance = axios.create({ baseURL: getBaseUrl() });

    instance.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return instance;

  }, [token]);

  return authApi;
};
