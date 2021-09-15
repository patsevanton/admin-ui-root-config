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
import { AGENT_NAME } from "../../fixtures/constants";

context("Check Associated tests", () => {
  beforeEach(() => {
    login();
    cy.visit(convertUrl("/agents"));
  });

  it('Open "Associated tests" pane with the list of tests', () => {
    const PACKAGE_NAME = "org/springframework/samples/petclinic/model";
    const ASSOCIATED_TESTS_COUNT = 1;
    cy.get('[data-test="name-column"]').contains(AGENT_NAME).click();
    cy.get('[data-test="sidebar:link:Test2Code"]').click();

    cy.get("table")
      .find("tbody")
      .contains("tr", PACKAGE_NAME)
      .find('[data-test="td-row-cell-assocTestsCount"]')
      .find("a")
      .click({ force: true });

    cy.get('[data-test="associated-test-pane:tests-count"]').should("have.text", ASSOCIATED_TESTS_COUNT);
    cy.get('[data-test="associated-test-pane:package-name"]').should("have.text", PACKAGE_NAME);
    cy.get('[data-test="associated-tests-list:item"]').should("have.length", ASSOCIATED_TESTS_COUNT);
    cy.get('[data-test="dropdown:selected-value"]').should("have.text", "All tests");
  });
});
