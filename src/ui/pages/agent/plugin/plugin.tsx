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
import { getAppNames, registerApplication } from "single-spa";
import { useHistory, useParams } from "react-router-dom";
import "twin.macro";

import { getPagePath } from "common";
import { paths } from "../../../containers-paths";

export const Plugin = () => {
  const { pluginId, agentId } = useParams<{ pluginId: string; agentId: string; }>();
  const { push } = useHistory();
  const switchBuild = (version: string, path: string) => {
    push(`${getPagePath({ name: "agentPlugin", params: { buildVersion: version, agentId, pluginId } })}${path}`);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    !getAppNames().includes(getPluginName(pluginId)) && paths[pluginId] && registerAgentPlugin(pluginId, paths[pluginId], { switchBuild });
  }, [pluginId]);

  return <div tw="w-full h-full" id={pluginId} />;
};

const registerAgentPlugin = (pluginName: string, pluginPath: string, customProps: any) => {
  registerApplication({
    name: getPluginName(pluginName),
    app: async () => {
      const res = await System.import(pluginPath);
      return res.AgentPlugin;
    },
    activeWhen: (location) =>
      !location.pathname.includes("group") && location.pathname.includes(pluginName),
    customProps,
  });
};

const getPluginName = (pluginId: string) => `agent-plugin-${pluginId}`;