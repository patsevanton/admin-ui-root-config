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
import { convertUrl, login } from "../../utils";
import { AGENT_NAME, TEST_2_CODE_ID } from "../../fixtures/constants";

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

context("test session", () => {
  const startSessionUrl = `/api/agents/${AGENT_NAME}/plugins/${TEST_2_CODE_ID}/dispatch-action`;
  const payload = {
    sessionId: "sessionId",
    isGlobal: false,
    isRealtime: false,
  };

  beforeEach(() => {
    login();
    cy.visit(convertUrl("/agents"));

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

  it("Finish the active scope when test session are NOT complete", () => {
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
    cy.get('[data-test="general-alert:content"]').then(($alert) => {
      expect($alert.text()).to.be.eq("Sessions have been finished successfully. All your progress has been added to the active scope.");
    });
    cy.get('[data-test="modal:close-button"]').click();

    cy.intercept("POST", `/api/agents/${AGENT_NAME}/plugins/${TEST_2_CODE_ID}/dispatch-action`, (req) => {
      req.continue((res) => {
        expect(res.statusCode).to.be.eq(200);
      });
    }).as("finishScope");
    cy.get('button[data-test="active-scope-info:finish-scope-button"]').click();
    cy.get('button[data-test="finish-scope-modal:finish-scope-button"]').click();
    cy.get('[data-test="message-panel:text"]').then(($alert) => {
      expect($alert.text()).to.be.eq("Scope has been finished");
    });
  });
});
