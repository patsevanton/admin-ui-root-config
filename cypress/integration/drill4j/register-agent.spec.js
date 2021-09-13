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

context("Register agent flow", () => {
  const AGENT_NAME = "dev-pet-standalone";

  before(() => {
    cy.task("removeContainers");
    cy.task("startAdmin");
    cy.task("startPetclinic", { build: "0.1.0" });
    cy.wait(15000); // wait for admin to start and agent to appear
  });

  beforeEach(() => {
    login();
    cy.visit(convertUrl("/agents"));
  });

  it("should display unregistered agent", () => {
    cy.get("table").get("tr").get('a[data-test="name-column"]').then(($link) => {
      expect($link.text()).to.eq(AGENT_NAME);
      expect($link.attr("disabled")).to.eq("disabled");
    });
    cy.get("table").get("tr").get('[data-test="td-row-cell-status"]').get("input[type=checkbox]")
      .should("have.value", "false");
  });

  it("Register Java agent with only required parameters", () => {
    cy.get('[data-test="action-column:icons-register"]').click();
    cy.url().then((url) => {
      expect(url).to.eq(convertUrl(`/agents/${AGENT_NAME}/registration`));
    });
    cy.get("input[name=id]").should("have.value", AGENT_NAME);
    cy.get("input[name=name]").should("have.value", AGENT_NAME);

    cy.get('[data-test="wizard:continue-button"]').click();
    cy.get('[data-test="wizard:continue-button"]').click();

    cy.intercept("PATCH", `/api/agents/${AGENT_NAME}`, (req) => {
      req.continue((res) => {
        expect(res.statusCode).to.equal(200);
      });
    });
    cy.get('[data-test="wizard:finishng-button"]').click();
  });
});
