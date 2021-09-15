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
/// <reference types="cypress" />
import { convertUrl, login } from "../../utils";

context("Check coverage", () => {
  beforeEach(() => {
    login();
    cy.visit(convertUrl("/agents"));
  });

  // it("Check the coverage percentage when only one test session is finished", () => {
  //   cy.get('[data-test="name-column"]').contains(AGENT_NAME).click();
  //   cy.get(`[data-test="sidebar:link:${TEST_2_CODE_ID}"]`).click();
  // });
});
