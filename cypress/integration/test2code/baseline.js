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
  checkSystemMessage,
  convertUrl, login, manualRegisterAgent, startAutotestsAndWait, startNewBuildAndGoToTest2Code, waitFotAgentInitialized,
} from "../../utils";
import { configureAxios } from "../../support/configure-axios";

context("Check Baseline", () => {
  beforeEach(() => {
    cy.task("removeContainers");
    cy.task("startAdmin");
    cy.task("startPetclinic", { build: "0.1.0" });
    cy.wait(15000);
    configureAxios();
    login();
    cy.visit(convertUrl("/agents"));
    waitFotAgentInitialized();
    manualRegisterAgent();
  });

  it("All new builds are compared with the Baseline build", () => {
    cy.get('[data-test="action-section:no-value:tests-to-run"]').should("exist");
    cy.get('[data-test="action-section:no-value:risks"]').should("exist");

    startAutotestsAndWait();
    cy.get('button[data-test="active-scope-info:finish-scope-button"]').click();
    cy.get('button[data-test="finish-scope-modal:finish-scope-button"]').click();

    startNewBuildAndGoToTest2Code("0.2.0");
    cy.get('[data-test="header:parent-build-version"]').should("have.text", "0.1.0");
    cy.get('[data-test="header:current-build-version"]').should("have.text", "0.2.0");

    cy.get('[data-test="action-section:count:tests-to-run"]').should("have.text", 0);
    cy.get('[data-test="action-section:count:risks"]').should("have.text", 1);
    cy.get('[data-test="action-section:count:risks"]').click();
    cy.get('[data-test="risks-pane:risk-name"]').should("have.text", "newMethod");
    cy.get('[data-test="modal:close-button"]').click();

    cy.get('[data-test="mark-as-baseline-flag"]').click();
    cy.get('button[data-test="baseline-build-modal:set-as-baseline-button"]').should("be.disabled");
    cy.get("input[type=checkbox]").click();
    cy.get('button[data-test="baseline-build-modal:set-as-baseline-button"]').should("not.be.disabled");
    cy.get('button[data-test="baseline-build-modal:set-as-baseline-button"]').click();
    checkSystemMessage("Current build has been set as baseline successfully. All subsequent builds will be compared to it.");
    startAutotestsAndWait();
    cy.get('button[data-test="active-scope-info:finish-scope-button"]').click();
    cy.get('button[data-test="finish-scope-modal:finish-scope-button"]').click();

    startNewBuildAndGoToTest2Code("0.3.0");
    cy.get('[data-test="header:parent-build-version"]').should("have.text", "0.2.0");
    cy.get('[data-test="header:current-build-version"]').should("have.text", "0.3.0");

    cy.get('[data-test="action-section:count:tests-to-run"]').should("have.text", 0);
    cy.get('[data-test="action-section:count:risks"]').should("have.text", 0);

    startNewBuildAndGoToTest2Code("0.5.0");
    cy.get('[data-test="header:parent-build-version"]').should("have.text", "0.2.0");
    cy.get('[data-test="header:current-build-version"]').should("have.text", "0.5.0");

    cy.get('[data-test="action-section:count:tests-to-run"]').should("have.text", 2);
    cy.get('[data-test="action-section:count:risks"]').should("have.text", 5);
  });
});
