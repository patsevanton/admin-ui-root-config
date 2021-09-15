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

context("Check Covered Methods", () => {
  beforeEach(() => {
    login();
    cy.visit(convertUrl("/agents"));
  });

  it('Open the "Covered Methods" pane with a list of methods', () => {
    const TEST_NAME = "[engine:testng]/[class:api.standalone.StandaloneApiTest]/[method:testNgGetHomePage()]";
    const TEST_TYPE = "Auto";
    const COVERED_METHODS_COUNT = 1;
    cy.get('[data-test="name-column"]').contains(AGENT_NAME).click();
    cy.get('[data-test="sidebar:link:Test2Code"]').click();
    cy.get('[data-test="build-overview:tab:build-tests"]').click();

    cy.get('[data-test="test-details:table-wrapper"]')
      .find("table")
      .find("tbody")
      .contains("tr", TEST_NAME)
      .find('[data-test="td-row-coverage.methodCount.covered"]')
      .find("a")
      .click({ force: true });

    cy.get("header").should("have.text", `Covered methods${COVERED_METHODS_COUNT}`);
    cy.get('[data-test="covered-methods-by-test-sidebar:test-name"]').should("have.text", TEST_NAME);
    cy.get('[data-test="covered-methods-by-test-sidebar:test-type"]').should("have.text", TEST_TYPE);
    cy.get('[data-test="covered-methods-list:item"]').should("have.length", COVERED_METHODS_COUNT);
    cy.get('[data-test="dropdown:selected-value"]').should("have.text", "All methods");
  });
});
