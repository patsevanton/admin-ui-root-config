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
import { Icons } from "@drill4j/ui-kit";
import { ActionBlock } from "./action-block";
import { useAgentRouteParams } from "../../hooks/use-agent-route-params";
import { useAgent } from "../../hooks";
import "twin.macro";

export const AgentPlugins = () => {
  const { agentId } = useAgentRouteParams();
  const { plugins = [] } = useAgent(agentId);
  if (!agentId) {
    return <div />;
  }
  return (
    <div tw="py-4 rounded bg-monochrome-shade">
      {plugins.map(({ name = "" }) => {
        const Icon = Icons[name as keyof typeof Icons];
        return (
          <ActionBlock tooltip={name} isActive>
            <Icon width={24} height={24} />
          </ActionBlock>
        );
      })}
    </div>

  );
};
