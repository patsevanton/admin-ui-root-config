import axios from "axios";
import { BASE_URL } from "../constants";

export const TOKEN_HEADER = "Authorization";
export const TOKEN_KEY = "auth_token";

export function configureAxios() {
  axios.defaults.baseURL = `${BASE_URL}/api`;

  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(TOKEN_KEY);

      if (token) {
        // eslint-disable-next-line no-param-reassign
        config.headers[TOKEN_HEADER] = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.setItem(TOKEN_KEY, "");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    },
  );
}
configureAxios();

export const login = () => {
  cy.wrap(null).then(async () => {
    const response = await axios.post("/login");
    const authToken = response.headers[TOKEN_HEADER.toLowerCase()];
    if (authToken) {
      localStorage.setItem(TOKEN_KEY, authToken);
    }
  });
};
