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
  useParams, Route, Switch,
} from "react-router-dom";

import { ServiceGroup as ServiceGroupType } from "types/service-group";
import { useAdminConnection } from "hooks";
import { Agent } from "types/agent";
import { routes } from "common";
import { useSetPanelContext } from "components";
import { ServiceGroupHeader } from "./service-group-header";
import { Dashboard } from "../dashboard";
import { Plugin } from "./plugin";

export const ServiceGroup = () => {
  const { groupId = "" } = useParams<{ groupId: string, pluginId: string }>();
  const { name = "" } = useAdminConnection<ServiceGroupType>(`/groups/${groupId}`) || {};
  const agentsList = useAdminConnection<Agent[]>("/api/agents") || [];
  const setPanel = useSetPanelContext();
  const agentCount = agentsList.filter((agent) => agent.group === groupId).length;

  return (
    <div tw="flex flex-col w-full">
      <ServiceGroupHeader name={name} agentsCount={agentCount} />
      <div tw="w-full h-full">
        <Switch>
          <Route
            exact
            path={routes.serviceGroupDashboard}
            render={() => <Dashboard id={groupId} isGroup setPanel={setPanel} />}
          />
          <Route path={routes.serviceGroupPlugin} component={Plugin} />
        </Switch>
      </div>
    </div>
  );
};
