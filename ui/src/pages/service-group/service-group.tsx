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
import "twin.macro";
import {
  useParams, useLocation, matchPath, Route,
} from "react-router-dom";
import { Icons } from "@drill4j/ui-kit";

import { Toolbar, Footer } from "components";
import { PluginsLayout } from "layouts";
import { Breadcrumbs } from "modules";
import { Plugin } from "types/plugin";
import { ServiceGroup as ServiceGroupType } from "types/service-group";
import { useAdminConnection } from "hooks";
import { Agent } from "types/agent";
import { ServiceGroupHeader } from "./service-group-header";
import { Sidebar } from "../agent/sidebar";
import { Dashboard } from "./dashboard";

interface Link {
  id: string;
  link: string;
  name: keyof typeof Icons;
  computed?: boolean;
}

const getPluginsList = (serviceGroupId: string, plugins: Plugin[]): Link[] => [
  {
    id: "service-group-dashboard",
    link: `service-group-full-page/${serviceGroupId}/service-group-dashboard`,
    name: "Dashboard",
  },
  ...plugins.map(({ id = "", name = "" }) => ({
    id,
    link: `service-group-full-page/${serviceGroupId}/${id}`,
    name: name as keyof typeof Icons,
  })),
];

export const ServiceGroup = () => {
  const { serviceGroupId = "" } = useParams<{ serviceGroupId: string, pluginId: string }>();
  const { pathname } = useLocation();
  const plugins = useAdminConnection<Plugin[]>(`/groups/${serviceGroupId}/plugins`) || [];
  const { name = "" } = useAdminConnection<ServiceGroupType>(`/groups/${serviceGroupId}`) || {};
  const agentsList = useAdminConnection<Agent[]>("/api/agents") || [];
  const agentCount = agentsList.filter((agent) => agent.group === serviceGroupId).length;

  const path = "/:page/:serviceGroupId/:activeLink";
  const { params: { activeLink = "" } = {} } = matchPath<{ activeLink: string }>(pathname, {
    path,
  }) || {};

  return (
    <PluginsLayout
      sidebar={activeLink && <Sidebar links={getPluginsList(serviceGroupId, plugins)} matchParams={{ path }} />}
      toolbar={<Toolbar breadcrumbs={<Breadcrumbs />} />}
      header={<ServiceGroupHeader name={name} agentsCount={agentCount} />}
      footer={<Footer />}
    >
      <div tw="w-full h-full">
        <Route path="/service-group/:serviceGroupId/dashboard" component={Dashboard} />
      </div>
    </PluginsLayout>
  );
};
