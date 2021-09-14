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
import React, { useEffect } from "react";
import {
  Redirect, Route, Switch, useHistory,
} from "react-router-dom";

import {
  LoginPage, AgentsPage, AgentPage,
  SettingsPage, AgentRegistrationPage, ServiceGroupRegistrationPage, ServiceGroup, Builds,
} from "pages";
import { TypographyStyles, LayoutStyles, FontsStyles } from "global-styles";
import { Footer, PrivateRoute } from "components";
import { configureAxios, routes } from "common";
import { AppLayout } from "layouts";

import axios from "axios";
import { NotificationManager } from "./notification-manager";

import "./index.css";
import { SetPluginUrlModal } from "./components/set-plugin-url-modal";

const Root = () => {
  const { push } = useHistory();

  useEffect(() => {
    const handleLogin = () => {
      if (window.location.pathname === routes.login) {
        push(routes.agentsTable);
      }
      configureAxios();
    };

    const handleLogout = () => {
      if (window.location.pathname !== routes.login) {
        push(routes.login);
      }
    };
    document.addEventListener("login", handleLogin);
    document.addEventListener("logout", handleLogout);
    configureAxios(); // configure baseURL

    axios.get("/agents/metadata"); // check on expire token
    return () => {
      document.removeEventListener("login", handleLogin);
      document.removeEventListener("logout", handleLogout);
    };
  }, []);

  return (
    <>
      <FontsStyles />
      <TypographyStyles />
      <LayoutStyles />
      <NotificationManager />
      <Route exact path={routes.login} component={LoginPage} />
      <AppLayout footer={<Footer />}>
        <Switch>
          <Route exact path="/" render={() => <Redirect to={routes.agentsTable} />} />
          <PrivateRoute path={[routes.agentPlugin, routes.agentDashboard]} component={AgentPage} />
          <PrivateRoute path={routes.builds} component={Builds} />
          <PrivateRoute
            path={[routes.serviceGroupPlugin, routes.serviceGroupDashboard]}
            component={ServiceGroup}
          />
          <Switch>
            <PrivateRoute exact path={routes.agentsTable} component={AgentsPage} />
            <PrivateRoute
              path={[routes.agentGeneralSettings, routes.agentPluginsSettings, routes.agentSystemSettings,
                routes.serviceGroupGeneralSettings, routes.serviceGroupSystemSettings, routes.serviceGroupPluginsSettings]}
              component={SettingsPage}
            />
            <PrivateRoute exact path={routes.agentRegistration} component={AgentRegistrationPage} />
            <PrivateRoute exact path={routes.serviceGroupRegistration} component={ServiceGroupRegistrationPage} />
            <PrivateRoute path={routes.agentPreregistration} component={() => <AgentRegistrationPage isOfflineAgent />} />
          </Switch>
        </Switch>
      </AppLayout>
      <SetPluginUrlModal />
    </>
  );
};

export default Root;
