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
  Route, Switch, useParams, Link as LinkComponent,
} from "react-router-dom";
import { Icons } from "@drill4j/ui-kit";
import "twin.macro";

import { useAgent } from "hooks";
import { PluginsLayout } from "layouts";
import { Footer, Toolbar } from "components";
import { getPagePath, routes } from "common";
import { Dashboard } from "./dashboard";
import { Sidebar, Link } from "./sidebar";
import { Plugin } from "./plugin";
import { PluginHeader } from "./plugin-header";

const Breadcrumbs = () => (
  <LinkComponent tw="link" to={getPagePath({ name: "agentsTable" })}>Agents</LinkComponent>
);

export const AgentPage = () => {
  const { agentId = "", buildVersion = "" } = useParams<{ agentId?: string; buildVersion?: string; }>();
  const agent = useAgent();
  const plugins = agent.plugins || [];
  const pluginsLinks: Link[] = [
    {
      id: "dashboard",
      name: "Dashboard",
      path: getPagePath({ name: "agentDashboard", params: { agentId, buildVersion } }),
    },
    ...plugins.map(({ id = "", name }) => ({
      id,
      name: name as keyof typeof Icons,
      path: getPagePath({ name: "agentPlugin", params: { agentId, buildVersion, pluginId: id } }),
    })),
  ];

  return (
    <PluginsLayout
      footer={<Footer />}
      sidebar={<Sidebar links={pluginsLinks} />}
      header={<PluginHeader agentName={agent.name} agentStatus={agent.status} />}
      toolbar={<Toolbar breadcrumbs={<Breadcrumbs />} />}
    >
      <Switch>
        <Route path={routes.agentPlugin} component={Plugin} />
        <Route path={routes.agentDashboard} component={Dashboard} />
      </Switch>
    </PluginsLayout>
  );
};
