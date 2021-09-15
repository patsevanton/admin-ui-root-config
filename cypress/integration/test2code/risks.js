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

context("Check Risks", () => {
  const NEW_BUILD = "0.5.0";

  beforeEach(() => {
    login();
    cy.visit(convertUrl("/agents"));
  });

  beforeEach(() => {
    cy.task("startPetclinic", { build: NEW_BUILD });
    cy.task("startPetclinicAutoTests");

    cy.get('[data-test="name-column"]').contains(AGENT_NAME).click();
    cy.get("a").contains("builds").click();
  });

  it("Risks are reduced after the New or Modified method has been covered", () => {
    const INITIAL_RISKS = 5;
    const RISKS_AFTER_COLLECT_COVERAGE = 4;

    cy.contains("a", NEW_BUILD, { timeout: 120000 }).click({ force: true });
    cy.get('[data-test="sidebar:link:Test2Code"]').click();

    cy.get('[data-test="action-section:count:risks"]').should("have.text", INITIAL_RISKS);

    // tests are done
    cy.contains('[data-test="active-scope-info:scope-coverage"]', "15.4%", { timeout: 200000 }).should("exist");

    cy.get('button[data-test="active-scope-info:finish-scope-button"]').click();
    cy.get('button[data-test="finish-scope-modal:finish-scope-button"]').click();

    cy.get('[data-test="action-section:count:risks"]').should("have.text", RISKS_AFTER_COLLECT_COVERAGE);
  });
});
