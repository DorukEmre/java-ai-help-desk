import { useMemo } from "react";
import axios from "axios";

import { useAuth } from "@/auth/useAuth";
import { getBaseUrl } from "@/utils/globals";


export const useAuthApi = () => {
  const { accessToken, user, setAuthSession, clearAuthSession } = useAuth();

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

      // Add Content-Type json only if there is a body (data)
      if (config.data && !config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "application/json";
      }

      return config;
    });


    // Response interceptor for handling expired tokens
    instance.interceptors.response.use(
      response => response,
      async (error) => {
        const prevRequest = error?.config;

        // If refresh request has failed, clear session data
        if (prevRequest?.url === "/refresh") {
          console.debug("failed refresh: ", error.response)
          clearAuthSession();
          return Promise.reject(error);
        }

        // console.log("error.response: ", error.response)

        if (error.response?.status === 401
          && error.response?.data?.code === "ACCESS_TOKEN_EXPIRED"
          && !prevRequest?.sent
          && user
        ) {

          prevRequest.sent = true

          try {
            // Call refresh endpoint
            const refreshResponse = await instance.post("/refresh");

            // Update access token in memory with new token
            const { accessToken: newAccessToken } = refreshResponse.data;
            setAuthSession({ accessToken: newAccessToken, ...user });

            // Retry original request with new config
            const newConfig = {
              ...prevRequest,
              headers: {
                ...prevRequest.headers,
                Authorization: `Bearer ${newAccessToken}`
              }
            };
            delete newConfig.sent;
            return axios.request(newConfig);

          } catch (error) {
            console.debug(error);
            clearAuthSession();
            return Promise.reject(error);
          }
        }

        // Any other auth-related failure (invalid tokens...)
        if (error.response?.status === 401
          && (error.response?.data?.code === "INVALID_ACCESS_TOKEN"
            || error.response?.data?.code === "REFRESH_TOKEN_EXPIRED"
            || error.response?.data?.code === "INVALID_REFRESH_TOKEN"
          )) {
          console.debug(error.response)
          clearAuthSession();
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }, [accessToken, user, setAuthSession, clearAuthSession]);

  return authApi;
};
