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

context("Check coverage percentage", () => {
  beforeEach(() => {
    login();
    cy.visit(convertUrl("/agents"));
  });

  beforeEach(() => {
    cy.task("startPetclinicAutoTests");
  });

  it("Check the coverage percentage when only one test session is finished", () => {
    const EXPECTED_COVERAGE = "15.1%";
    const EXPECTED_TEST_COUNT = 12;
    cy.get('[data-test="name-column"]').contains(AGENT_NAME).click();
    cy.get('[data-test="sidebar:link:Test2Code"]').click();

    cy.get('[data-test="active-build-coverage-info:build-coverage-percentage"]').should("have.text", "0%");
    cy.get('[data-test="active-scope-info:scope-coverage"]').should("have.text", "0%");

    cy.get('[data-test="active-scope-info:scope-coverage"]').contains(EXPECTED_COVERAGE, { timeout: 200000 }).should("exist");

    cy.get('[data-test="active-scope-info:finish-scope-button"]').click();
    cy.get('[data-test="finish-scope-modal:scope-summary:code-coverage"]').should("have.text", EXPECTED_COVERAGE);
    cy.get('[data-test="finish-scope-modal:scope-summary:tests-count"]').should("have.text", EXPECTED_TEST_COUNT);
    cy.get('[data-test="finish-scope-modal:finish-scope-button"]').click();
    cy.get('[data-test="message-panel:text"]').should("have.text", "Scope has been finished");

    cy.get('[data-test="active-build-coverage-info:build-coverage-percentage"]').should("have.text", EXPECTED_COVERAGE);
    cy.get('[data-test="active-scope-info:scope-coverage"]').should("have.text", "0%");
  });
});
