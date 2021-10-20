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
import { routes } from "common";
import React from "react";
import { Switch, Route } from "react-router-dom";
import { AgentSettings } from "./agent-settings";
import { ServiceGroupSettings } from "./service-group-settings";

export const SettingsPage = () => (
  <Switch>
    <Route
      component={AgentSettings}
      path={[routes.agentGeneralSettings, routes.agentPluginsSettings, routes.agentSystemSettings].map((route) => `*${route}`)}
    />
    <Route
      component={ServiceGroupSettings}
      path={[routes.serviceGroupGeneralSettings, routes.serviceGroupSystemSettings, routes.serviceGroupPluginsSettings]
        .map((route) => `*${route}`)}
    />
  </Switch>
);
