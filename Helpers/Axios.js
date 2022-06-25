import axios from "axios";

const _getToken = () => {};
const saveToken = () => {};
const destroyToken = () => {};
let interceptor;
export function createAxiosResponseInterceptor() {
  interceptor && axios.interceptors.response.eject(interceptor);
  interceptor = axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // Reject promise if usual error
      if (error.response.status !== 401) {
        return Promise.reject(error);
      }

      /*
       * When response code is 401, try to refresh the token.
       * Eject the interceptor so it doesn't loop in case
       * token refresh causes the 401 response
       */
      axios.interceptors.response.eject(interceptor);

      return axios
        .post("/api/tokens/refreshToken", {
          refresh_token: _getToken("refresh_token"),
        })
        .then((response) => {
          saveToken();
          error.response.config.headers["Authorization"] =
            "Bearer " + response.data.access_token;
          return axios(error.response.config);
        })
        .catch((error) => {
          destroyToken();
          return Promise.reject(error);
        })
        .finally(createAxiosResponseInterceptor);
    }
  );
}
// createAxiosResponseInterceptor();
export default axios;
