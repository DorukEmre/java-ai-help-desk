import { useMemo } from "react";
import axios from "axios";

import { useAuth } from "@/auth/useAuth";
import { getBaseUrl } from "@/utils/globals";


export const useAuthApi = () => {
  const { accessToken } = useAuth();

  const authApi = useMemo(() => {

    const instance = axios.create({
      baseURL: getBaseUrl(),
      withCredentials: true,
    });

    // Request interceptor
    instance.interceptors.request.use((config) => {

      // Add Authorization if accessToken exists
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      // Add Content-Type only if there is a body (data)
      if (config.data && !config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "application/json";
      }

      return config;
    });

    return instance;

  }, [accessToken]);

  return authApi;
};
