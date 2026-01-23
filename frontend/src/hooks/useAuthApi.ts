import { useMemo } from "react";
import axios from "axios";

import { useAuth } from "@/auth/useAuth";
import { getBaseUrl } from "@/utils/globals";


export const useAuthApi = () => {
  const { token } = useAuth();

  const authApi = useMemo(() => {

    const instance = axios.create({
      baseURL: getBaseUrl()
    });

    instance.interceptors.request.use((config) => {

      // Add Authorization if token exists
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add Content-Type only if there is a body (data)
      if (config.data && !config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "application/json";
      }

      return config;
    });

    return instance;

  }, [token]);

  return authApi;
};
