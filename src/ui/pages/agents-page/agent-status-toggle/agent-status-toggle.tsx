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
import { Spinner, Inputs } from "@drill4j/ui-kit";
import { sendNotificationEvent } from "@drill4j/send-notification-event";
import axios from "axios";
import "twin.macro";

import { AGENT_STATUS } from "common/constants";
import { Agent } from "types/agent";
import { AgentStatus } from "types/agent-status";

interface Props {
  className?: string;
  agent: Agent;
}

export const AgentStatusToggle = ({ className, agent }: Props) => (
  <div className={className}>
    <div tw="flex items-center w-full h-4" data-test="agent-status-toggle">
      <Inputs.Toggler
        value={
          agent.status === AGENT_STATUS.ONLINE ||
            agent.status === AGENT_STATUS.BUSY
        }
        label={<span tw="block mt-[2px]">{toggleLabel(agent.status)}</span>}
        onChange={async () => {
          try {
            await axios.post(`/agents/${agent.id}/toggle`);
            sendNotificationEvent({
              type: "SUCCESS",
              text: `Agent has been ${
                agent.status === AGENT_STATUS.ONLINE ? "disabled" : "enabled"
              }.`,
            });
          } catch ({ response: { data: { message = "" } = {} } = {} }) {
            sendNotificationEvent({
              type: "ERROR",
              text:
                  message as string ||
                  "There is some issue with your action. Please try again later.",
            });
          }
        }}
        disabled={
          agent.status === AGENT_STATUS.NOT_REGISTERED ||
            agent.status === AGENT_STATUS.BUSY ||
            !agent.instanceIds?.length
        }
      />
    </div>
  </div>
);

function toggleLabel(status: AgentStatus | undefined) {
  switch (status) {
    case AGENT_STATUS.ONLINE:
      return "On";

    case AGENT_STATUS.BUSY:
      return <Spinner />;

    default:
      return "Off";
  }
}
