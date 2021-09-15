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
import axios from "axios";
import { AGENT_NAME, TEST_2_CODE_ID } from "../../fixtures/constants";
import { convertUrl, login } from "../../utils";

context("Finish the active scope when test session are NOT complete", () => {
  const startSessionUrl = `/api/agents/${AGENT_NAME}/plugins/${TEST_2_CODE_ID}/dispatch-action`;
  const payload = {
    sessionId: "sessionId",
    isGlobal: false,
    isRealtime: false,
  };

  beforeEach(() => {
    login();
    cy.visit(convertUrl("/agents"));
  });

  beforeEach(() => {
    cy.intercept("POST", startSessionUrl, (req) => {
      req.continue((res) => {
        expect(res.statusCode).to.be.eq(200);
      });
    }).as("startTestSession");

    cy.wrap(null).then(() => {
      axios.post(startSessionUrl, { type: "START", payload });
    });

    cy.wait("@startTestSession");
  });
  it("should can finish scope", () => {
    cy.intercept("POST", `/api/agents/${AGENT_NAME}/plugins/${TEST_2_CODE_ID}/dispatch-action`, (req) => {
      req.continue((res) => {
        expect(res.statusCode).to.be.eq(200);
      });
    }).as("finishAllTestSession");

    cy.get('[data-test="name-column"]').contains(AGENT_NAME).click();
    cy.get('[data-test="sidebar:link:Test2Code"]').click();
    cy.get('button[data-test="active-scope-info:finish-scope-button"]').click();
    cy.get('[data-test="finish-scope-modal:general-alert:session-management-link"').click();

    cy.get('[data-test="management-active-sessions:finish-all"').click();
    cy.get('[data-test="operation-action-warning:yes-button"').click();
    cy.wait("@finishAllTestSession");
    cy.get('[data-test="general-alert:content"]').should("have.text",
      "Sessions have been finished successfully. All your progress has been added to the active scope.");
    cy.get('[data-test="modal:close-button"]').click();

    cy.intercept("POST", `/api/agents/${AGENT_NAME}/plugins/${TEST_2_CODE_ID}/dispatch-action`, (req) => {
      req.continue((res) => {
        expect(res.statusCode).to.be.eq(200);
      });
    }).as("finishScope");
    cy.get('button[data-test="active-scope-info:finish-scope-button"]').click();
    cy.get('button[data-test="finish-scope-modal:finish-scope-button"]').click();
    cy.get('[data-test="message-panel:text"]').should("have.text", "Scope has been finished");
  });
});
