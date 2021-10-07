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
import { Button, LinkButton, Icons } from "@drill4j/ui-kit";
import tw, { styled } from "twin.macro";

import { useAdminConnection } from "hooks";
import { Agent, ServiceGroup } from "types";
import { AGENT_STATUS } from "common";
import { PanelProps } from "./panel-props";
import { PanelWithCloseIcon } from "./panel-with-close-icon";
import { useSetPanelContext } from "./panel-context";

export const AddAgentPanel = ({ isOpen, onClosePanel }: PanelProps) => {
  const agentsList = useAdminConnection<Agent[]>("/api/agents") || [];
  const groupsList = useAdminConnection<ServiceGroup[]>("/api/groups") || [];
  const setPanel = useSetPanelContext();
  const agents = agentsList.filter((agent) => !agent.group && agent.status === AGENT_STATUS.NOT_REGISTERED);
  const groupsAgents = agentsList.filter((agent) => agent.group && agent.status === AGENT_STATUS.NOT_REGISTERED);
  const groups = groupsList.map((group) => ({
    group,
    agents: groupsAgents.filter((agent) => group.name === agent.group),
  }));

  return (
    <PanelWithCloseIcon
      header={(
        <div tw="w-[1024px] flex justify-between items-center h-20">
          Add Agent
          <LinkButton
            tw="text-14 leading-24"
            onClick={() => setPanel({ type: "OFFLINE_AGENT_PREREGISTRATION" })}
          >
            <Icons.Register /> Preregister Agent
          </LinkButton>
        </div>
      )}
      isOpen={isOpen}
      onClosePanel={onClosePanel}
    >
      <Layout tw="text-monochrome-dark font-bold text-14 leading-24">
        <Column tw="col-start-2">Name</Column>
        <Column tw="col-start-3">Type</Column>
      </Layout>
      <div tw="flex flex-col gap-y-[6px] overflow-y-auto text-monochrome-dark-tint">
        {groups.map(({ group, agents: groupAgents }) => groupAgents.length > 0
          && <GroupRow key={group?.id} group={group} agents={groupAgents} />)}
        {agents.map((agent) => <AgentRow key={agent.id} {...agent} />)}
      </div>
    </PanelWithCloseIcon>
  );
};

interface GroupRowProps {
  agents: Agent[];
  group: ServiceGroup;
}

const GroupRow = ({ group: { name }, agents }:GroupRowProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div tw="rounded-lg border border-monochrome-dark bg-monochrome-black text-monochrome-dark-tint text-14 leading-20">
      <Layout css={[tw`border-monochrome-dark`, isOpen && tw`border-b`]}>
        <div
          tw="flex items-center justify-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Icons.Expander
            rotate={isOpen ? 90 : 0}
            width={9}
            height={16}
          />
        </div>
        <Column title={name}>{name}</Column>
        <Column title="Multiservice">Multiservice</Column>
        <Button
          primary
          size="small"
        ><Icons.Register width={16} height={16} /> Register
        </Button>
      </Layout>
      {isOpen && agents.map((agent) => <GroupAgentRow key={agent.id} {...agent} />)}
    </div>
  );
};

const AgentRow = ({ name, agentType, id }:Agent) => {
  const setPanel = useSetPanelContext();

  return (
    <Layout tw="rounded-lg bg-monochrome-black box-border border border-monochrome-dark text-monochrome-dark-tint text-14 leading-20">
      <Column tw="col-start-2" title={name}>{name}</Column>
      <Column title={agentType}>{agentType}</Column>
      <Button
        onClick={() => setPanel({ type: agentType === "Java" ? "JAVA_AGENT_REGISTRATION" : "JS_AGENT_REGISTRATION", payload: id })}
        primary
        size="small"
      >
        <Icons.Register width={16} height={16} /> Register
      </Button>
    </Layout>
  );
};

const GroupAgentRow = ({ id, name, agentType }:Agent) => {
  const setPanel = useSetPanelContext();
  return (
    <Layout>
      <Column tw="col-start-2" title={name}>{name}</Column>
      <Column title={agentType}>{agentType}</Column>
      <Button
        onClick={() => setPanel({ type: agentType === "Java" ? "JAVA_AGENT_REGISTRATION" : "JS_AGENT_REGISTRATION", payload: id })}
        secondary
        size="small"
      >
        <Icons.Register width={16} height={16} /> Register
      </Button>
    </Layout>
  );
};

const Layout = styled.div`
  ${tw`grid items-center grid-cols-[28px 3fr 1fr 104px] h-[60px] px-4`}
`;

const Column = styled.div`
  ${tw`px-3 text-ellipsis`}
`;
