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
import { Route } from "react-router-dom";
import { Icons } from "@drill4j/ui-kit";

import { Plugin as PluginType } from "types/plugin";
import { useAgent } from "hooks";
import { Breadcrumbs } from "modules";
import { PluginsLayout } from "layouts";
import { Footer, Toolbar } from "components";
import { Dashboard } from "./dashboard";
import { Sidebar } from "./sidebar";
import { Plugin } from "./plugin";
import { PluginHeader } from "./plugin-header";

interface Link {
  id: string;
  link: string;
  name: keyof typeof Icons;
  computed: boolean;
}

const getPluginsLinks = (plugins: PluginType[] = []): Link[] => [
  {
    id: "dashboard",
    link: "dashboard",
    name: "Dashboard",
    computed: true,
  },
  ...plugins.map(({ id = "", name }) => ({
    id,
    link: id === "test2code" ? `${id}/dashboard/methods` : `${id}/dashboard`,
    name: name as keyof typeof Icons,
    computed: true,
  })),
];

export const AgentPage = () => {
  const agent = useAgent();
  return (
    <PluginsLayout
      footer={<Footer />}
      sidebar={<Sidebar links={getPluginsLinks(agent.plugins)} />}
      header={<PluginHeader agentName={agent.name} agentStatus={agent.status} />}
      toolbar={<Toolbar breadcrumbs={<Breadcrumbs />} />}
    >
      <Route path="/agent/:agentId/:buildVersion/dashboard" component={Dashboard} />
      <Route path="/agent/:agentId/:buildVersion/plugin/:pluginId" component={Plugin} />
    </PluginsLayout>
  );
};
