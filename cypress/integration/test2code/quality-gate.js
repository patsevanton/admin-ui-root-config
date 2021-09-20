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
import { convertUrl } from "../../utils";
import { AGENT_NAME } from "../../fixtures/constants";

context("Check Quality Gate statuses", () => {
  it('Сlick on the "Configure" button in the "Quality Gate" by "Test2code" plugin header', () => {
    cy.visit(convertUrl("/login"));
    cy.contains("Continue as a guest (with admin rights)").click();
    cy.get('[data-test="name-column"]').contains(AGENT_NAME).click();
    cy.get('[data-test="sidebar:link:Test2Code"]').click();
    cy.get('[data-test="coverage-plugin-header:configure-button"]').click();
    cy.get('input[name="coverage.enabled"]').click();
    cy.get('input[name="coverage.condition.value"]').type("{backspace}").type("17");
    cy.get('input[name="risks.enabled"]').click();
    cy.get('input[name="risks.condition.value"]').type("1");
    cy.get('input[name="tests.enabled"]').click();
    cy.get('button[type="submit"]').click();
    cy.get('[data-test="modal:close-button"]').click();
    cy.get('[data-test="coverage-plugin-header:quality-gate-status"]').contains("PASSED");
  });
});
