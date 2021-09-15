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
import {
  convertUrl, login, manualRegisterAgent, waitFotAgentInitialized,
} from "../../utils";

context("Check Risks", () => {
  const NEW_BUILD = "0.5.0";

  beforeEach(() => {
    cy.task("removeContainers");
    cy.task("startAdmin");
    cy.task("startPetclinic", { build: "0.1.0" });
    cy.wait(15000);
    login();
    cy.visit(convertUrl("/agents"));
    waitFotAgentInitialized();
    manualRegisterAgent();
    cy.task("startPetclinicAutoTests");
  });

  it("Risks are reduced after the New or Modified method has been covered", () => {
    const INITIAL_TESTS_TO_RUN = 1;
    const TESTS_TO_RUN_AFTER_COLLECT_COVERAGE = 0;

    cy.contains('[data-test="active-scope-info:scope-coverage"]', /1[1-9]/, { timeout: 200000 }).should("exist");

    cy.get('button[data-test="active-scope-info:finish-scope-button"]').click();
    cy.get('button[data-test="finish-scope-modal:finish-scope-button"]').click();

    cy.task("startPetclinic", { build: "0.5.0" });

    cy.get("a").contains("builds").click();
    cy.contains("a", NEW_BUILD, { timeout: 120000 }).click({ force: true });
    cy.contains("div", "Online", { timeout: 120000 }); // agent is not BUSY
    cy.get('[data-test="sidebar:link:Test2Code"]').click();

    cy.get('[data-test="action-section:count:tests-to-run"]').should("have.text", INITIAL_TESTS_TO_RUN);

    cy.task("startPetclinicAutoTests");

    cy.contains('[data-test="active-scope-info:scope-coverage"]', /1[1-9]/, { timeout: 200000 }).should("exist");

    cy.get('button[data-test="active-scope-info:finish-scope-button"]').click();
    cy.get('button[data-test="finish-scope-modal:finish-scope-button"]').click();

    cy.get('[data-test="action-section:count:tests-to-run"]').should("have.text", TESTS_TO_RUN_AFTER_COLLECT_COVERAGE);
  });
});
