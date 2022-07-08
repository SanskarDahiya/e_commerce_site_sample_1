import axios from "axios";
import { configure } from "axios-hooks";
import { useEffect, useState } from "react";
import { useAuthStore } from "@store/auth";

configure({ axios: axios });

export const useAxiosInterceptior = () => {
  const [interceptor, setInterceptor] = useState();
  const { setRefreshToken, setAccessToken, accessToken, refreshToken } =
    useAuthStore();

  useEffect(() => {
    if (refreshToken) {
      createAxiosResponseInterceptor({ refreshToken });
      return () => {
        axios.interceptors.response.eject(interceptor);
      };
    } else if (interceptor) {
      axios.interceptors.response.eject(interceptor);
      setInterceptor(null);
    }
  }, [refreshToken]);

  useEffect(() => {
    setAccessToken(localStorage.getItem("access-token"));
    setRefreshToken(localStorage.getItem("refresh-token"));
  }, []);

  const destroyToken = () => {
    setAccessToken(null);
    setRefreshToken(null);
  };

  const createAxiosResponseInterceptor = ({ refreshToken }) => {
    const _interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Reject promise if usual error
        if (error.response.status !== 401) {
          return Promise.reject(error);
        }

        /*
         * When response code is 401, try to refresh the token.
         * Eject the interceptor so it doesn't loop in case
         * token refresh causes the 401 response
         */
        axios.interceptors.response.eject(_interceptor);
        try {
          const response = await axios({
            url: "/api/tokens/refreshToken",
            method: "POST",
            headers: {
              "x-refresh-token": refreshToken,
            },
          });
          const headers = response?.headers || {};
          const AccessToken = headers["x-access-token"];
          setAccessToken(AccessToken);
          return axios(error.response.config);
        } catch (error) {
          destroyToken();
          return Promise.reject(error);
        } finally {
          console.log("Finally");
          createAxiosResponseInterceptor({ refreshToken });
        }
      }
    );
    setInterceptor(_interceptor);
  };
};
export default axios;
