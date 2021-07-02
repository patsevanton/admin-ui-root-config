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
import React from "react";
import {
  BrowserRouter, Route, Switch,
} from "react-router-dom";
import { Icons } from "@drill4j/ui-kit";

import {
  LoginPage, AgentsPage, AgentPage,
  SettingsPage, AgentRegistrationPage, ServiceGroupRegistrationPage, ServiceGroup,
} from "pages";
import { TypographyStyles, LayoutStyles, FontsStyles } from "global-styles";
import { Footer, PrivateRoute, Sidebar } from "components";
import { configureAxios, routes } from "common";
import { AppLayout } from "layouts";

import { NotificationManager } from "./notification-manager";

import "./index.css";

configureAxios();

const sidebarLinks = [
  { link: "agents", icon: Icons.Agents },
];

const Root = () => (
  <BrowserRouter>
    <FontsStyles />
    <TypographyStyles />
    <LayoutStyles />
    <NotificationManager />
    <Switch>
      <Route exact path={routes.login} component={LoginPage} />
      <PrivateRoute path={[routes.agentPlugin, routes.agentDashboard]} component={AgentPage} />
      <PrivateRoute
        path={[routes.serviceGroupPlugin, routes.serviceGroupDashboard]}
        component={ServiceGroup}
      />
      <AppLayout
        sidebar={<Sidebar links={sidebarLinks} matchParams={{ path: "/:activeLink" }} />}
        footer={<Footer />}
      >
        <Switch>
          <PrivateRoute exact path={[routes.agentsTable, `${routes.agentsTable}/notification-sidebar`]} component={AgentsPage} />
          <PrivateRoute
            path={[routes.agentGeneralSettings, routes.agentPluginsSettings, routes.agentSystemSettings,
              routes.serviceGroupGeneralSettings, routes.serviceGroupSystemSettings, routes.serviceGroupPluginsSettings]}
            component={SettingsPage}
          />
          <PrivateRoute exact path={routes.agentRegistration} component={AgentRegistrationPage} />
          <PrivateRoute exact path={routes.serviceGroupRegistration} component={ServiceGroupRegistrationPage} />
          <PrivateRoute path={routes.agentPreregistration} component={AgentRegistrationPage} />
        </Switch>
      </AppLayout>
    </Switch>
  </BrowserRouter>
);

export default Root;