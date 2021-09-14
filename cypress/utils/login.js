/*
 * Copyright 2020 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import axios from "axios";
import { BASE_URL } from "../fixtures/constants.js";

export const TOKEN_HEADER = "Authorization";
export const TOKEN_KEY = "auth_token";

export function configureAxios() {
  axios.defaults.baseURL = `${BASE_URL}`;

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
  cy.intercept("/api/login", (req) => {
    req.continue((res) => {
      expect(res.statusCode).to.be.eq(200);
    });
  }).as("login");

  cy.wrap(null).then(async () => {
    const response = await axios.post("/api/login");
    const authToken = response.headers[TOKEN_HEADER.toLowerCase()];
    if (authToken) {
      localStorage.setItem(TOKEN_KEY, authToken);
    }
  });
  cy.wait(["@login"]);
};
