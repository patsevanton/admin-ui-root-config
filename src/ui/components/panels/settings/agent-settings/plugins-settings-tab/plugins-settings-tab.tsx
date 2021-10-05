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
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Icons, Button } from "@drill4j/ui-kit";
import "twin.macro";

import { Agent } from "types/agent";
import { Plugin } from "types/plugin";
import { useAdminConnection } from "hooks";
import { PluginCard } from "components";
import { getPagePath } from "common";
import { sendNotificationEvent } from "@drill4j/send-notification-event";

interface Props {
  agent: Agent;
}

export const PluginsSettingsTab = ({ agent }: Props) => {
  const plugins = useAdminConnection<Plugin[]>(`/agents/${agent.id}/plugins`) || [];
  const installedPlugins = plugins.filter((plugin) => !plugin.available);
  const { id: agentId = "", buildVersion = "" } = agent;

  return (
    <div tw="space-y-1">
      <div tw="flex justify-between text-14 leading-24 text-monochrome-gray">
        <span>Installed plugins on your agent.</span>
        <span>{installedPlugins.length} of {plugins.length} installed</span>
      </div>
      {plugins.map(({
        name, id = "", version, description, available,
      }) => (
        <PluginCard
          key={id}
          name={name}
          version={version}
          icon={name as keyof typeof Icons}
          description={description}
          button={available
            ? (
              <Button
                onClick={async () => {
                  try {
                    await axios.post(`/agents/${agentId}/plugins`, { pluginId: id });
                    sendNotificationEvent({ type: "SUCCESS", text: "Plugin has been added" });
                  } catch ({ response: { data: { message } = {} } = {} }) {
                    sendNotificationEvent({
                      type: "ERROR",
                      text: "On-submit error. Server problem or operation could not be processed in real-time",
                    });
                  }
                }}
                primary
                size="large"
              >Install
              </Button>
            )
            : (
              <Link
                to={getPagePath({ name: "agentPlugin", params: { agentId, buildVersion, pluginId: id } })}
                tw="link"
              >
                Go to Plugin
              </Link>
            )}
        />
      ))}
    </div>
  );
};
