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
import { BASE_URL } from "../fixtures/constants";

export const TOKEN_HEADER = "Authorization";
export const TOKEN_KEY = "auth_token";

export const login = () => {
  cy.intercept("/api/login", (req) => {
    req.continue((res) => {
      expect(res.statusCode).to.be.eq(200);
    });
  }).as("login");

  cy.wrap(null).then(async () => {
    const response = await axios.post("/api/login", {
      BASE_URL,
    });
    const authToken = response.headers[TOKEN_HEADER.toLowerCase()];
    if (authToken) {
      localStorage.setItem(TOKEN_KEY, authToken);
    }
  });
  cy.wait(["@login"]);
};
