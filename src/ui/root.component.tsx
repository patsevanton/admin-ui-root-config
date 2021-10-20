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
  BrowserRouter, Redirect, Route, Switch,
} from "react-router-dom";

import {
  LoginPage, AgentsPage, AgentPage,
  SettingsPage, AgentRegistrationPage, ServiceGroupRegistrationPage, ServiceGroup, Builds,
} from "pages";
import { TypographyStyles, LayoutStyles, FontsStyles } from "global-styles";
import { Footer, PrivateRoute } from "components";
import { configureAxios, routes } from "common";
import { AppLayout } from "layouts";

import { NotificationManager } from "./notification-manager";

import "./index.css";
import { SetPluginUrlModal } from "./components/set-plugin-url-modal";

configureAxios();

const Root = () => (
  <BrowserRouter>
    <FontsStyles />
    <TypographyStyles />
    <LayoutStyles />
    <NotificationManager />
    <Route exact path={`*${routes.login}`} component={LoginPage} />
    <AppLayout footer={<Footer />}>
      <Switch>
        <Route exact path="/" render={() => <Redirect to={routes.agentsTable} />} />
        <PrivateRoute path={[routes.agentPlugin, routes.agentDashboard].map((route) => `*${route}`)} component={AgentPage} />
        <PrivateRoute path={`*${routes.builds}`} component={Builds} />
        <PrivateRoute
          path={[routes.serviceGroupPlugin, routes.serviceGroupDashboard].map((route) => `*${route}`)}
          component={ServiceGroup}
        />
        <Switch>
          <PrivateRoute exact path={`*${routes.agentsTable}`} component={AgentsPage} />
          <PrivateRoute
            path={[routes.agentGeneralSettings, routes.agentPluginsSettings, routes.agentSystemSettings,
              routes.serviceGroupGeneralSettings, routes.serviceGroupSystemSettings, routes.serviceGroupPluginsSettings]
              .map((route) => `*${route}`)}
            component={SettingsPage}
          />
          <PrivateRoute exact path={`*${routes.agentRegistration}`} component={AgentRegistrationPage} />
          <PrivateRoute exact path={`*${routes.serviceGroupRegistration}`} component={ServiceGroupRegistrationPage} />
          <PrivateRoute path={`*${routes.agentPreregistration}`} component={() => <AgentRegistrationPage isOfflineAgent />} />
        </Switch>
      </Switch>
    </AppLayout>
    <SetPluginUrlModal />
  </BrowserRouter>
);

export default Root;
