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
import { useHistory } from "react-router-dom";
import {
  Badge, Icons, Spinner, Button,
} from "@drill4j/ui-kit";
import "twin.macro";

import { convertAgentName } from "utils";
import { AgentStatusBadge, NoAgentsSvg, PanelStub } from "components";
import { useAdminConnection, useRouteParams } from "hooks";
import {
  Agent, ServiceGroup,
} from "types";
import { AGENT_STATUS, getPagePath } from "common";
import { Panel } from "../panel";
import { PanelProps } from "../panel-props";
import {
  Column, CubeWrapper, GroupRow as StyledGroupRow, Layout, NameColumn, Row, AgentRow as StyledAgentRow, GroupAgentRow,
} from "./elements";
import { useSetPanelContext } from "../panel-context";

export const SelectAgentPanel = ({ isOpen, onClosePanel }: PanelProps) => {
  const agentsList = useAdminConnection<Agent[]>("/api/agents") || [];
  const groupsList = useAdminConnection<ServiceGroup[]>("/api/groups") || [];
  const setPanel = useSetPanelContext();
  const agents = agentsList.filter((agent) => !agent.group && agent.status !== AGENT_STATUS.NOT_REGISTERED);
  const groupsAgents = agentsList.filter((agent) => agent.group && agent.status !== AGENT_STATUS.NOT_REGISTERED);
  const groups = groupsList.map((group) => ({
    group,
    agents: groupsAgents.filter((agent) => group.id === agent.group),
  }));

  return (
    <Panel
      header={(
        <div tw="w-[1024px] flex justify-between items-center h-21">
          Select Agent
          <Button onClick={() => setPanel({ type: "ADD_AGENT" })} secondary size="large"><Icons.Plus /> Add Agent</Button>
        </div>
      )}
      isOpen={isOpen}
      onClosePanel={onClosePanel}
    >
      {agents.length || groupsAgents.length ? (
        <div tw="text-monochrome-medium-tint text-14 leading-20">
          <Layout tw="text-monochrome-dark font-bold leading-24">
            <Column tw="col-start-3">Name</Column>
            <Column tw="col-start-4">Description</Column>
            <Column tw="col-start-5">Type</Column>
          </Layout>
          <div tw="flex flex-col gap-y-[6px] overflow-y-auto">
            {groups.map(({ group, agents: groupAgents }) => groupAgents.length > 0
            && <GroupRow key={group?.id} group={group} agents={groupAgents} />)}
            {agents.map((agent) => <AgentRow key={agent.id} {...agent} />)}
          </div>
        </div>
      ) : (
        <PanelStub
          icon={<NoAgentsSvg />}
          title="No registered agents at the moment"
          message={(
            <span>
              Run your application with Drill4J Agent using&nbsp;
              <a
                tw="text-blue-default font-semibold"
                href="https://drill4j.github.io/how-to-start/"
                rel="noopener noreferrer"
                target="_blank"
              >
                this guide <Icons.OpenInNewTab tw="inline" />
              </a>
              &nbsp;and add it.
            </span>
          )}
        />
      )}
    </Panel>
  );
};

const AgentRow = (agent: Agent) => {
  const {
    name = "", description = "", agentType = "", status, id = "", group, buildVersion = "", agentVersion,
  } = agent;
  const { agentId } = useRouteParams();
  const { push } = useHistory();
  const setPanel = useSetPanelContext();
  const isPreregisteredAgent = agentType === "Java" && !agentVersion;
  const isRegistering = status === AGENT_STATUS.REGISTERING;
  const isSelectedAgent = agentId === id;

  if (isRegistering) return <RegisteringAgentRow {...agent} />;

  if (isPreregisteredAgent) return <PreregisteredAgentRow {...agent} />;

  const Wrapper = group ? GroupAgentRow : StyledAgentRow;

  return (
    <Wrapper
      selected={isSelectedAgent}
      onClick={() => {
        if (!String(window.getSelection())) {
          push(getPagePath({
            name: "agentDashboard",
            params: { agentId: id },
          }));
        }
      }}
    >
      <Badge color="green" bold tw="opacity-0">NEW</Badge>
      <CubeWrapper isActive={isSelectedAgent}>{convertAgentName(name)}</CubeWrapper>
      <NameColumn title={name}>
        <AgentStatusBadge status={status} />
        <span>{name}</span>
      </NameColumn>
      <Column title={description}>{description}</Column>
      <Column title={agentType}>{agentType}</Column>
      <Icons.Settings
        width={16}
        height={16}
        onClick={((event: any) => {
          event?.stopPropagation();
          setPanel({ type: "SETTINGS", payload: agent });
        }) as any}
        tw="text-monochrome-white cursor-pointer"
      />
    </Wrapper>
  );
};

interface GroupRowProps {
  agents: Agent[];
  group: ServiceGroup;
}

const GroupRow = ({ agents = [], group }: GroupRowProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { groupId } = useRouteParams();
  const { push } = useHistory();
  const setPanel = useSetPanelContext();
  const { id = "", name: groupName = "", description } = group;
  const isSelectedGroup = groupId === id;

  return (
    <div tw="rounded-lg bg-monochrome-black100">
      <StyledGroupRow
        selected={isSelectedGroup}
        isOpen={isOpen}
        onClick={() => {
          if (!String(window.getSelection())) {
            push(getPagePath({
              name: "serviceGroupDashboard",
              params: { groupId: id },
            }));
          }
        }}
      >
        <div
          tw="flex items-center justify-center cursor-pointer"
          onClick={((event: any) => {
            event?.stopPropagation();
            setIsOpen(!isOpen);
          }) as any}
        >
          <Icons.Expander
            rotate={isOpen ? 90 : 0}
            width={9}
            height={16}
          />
        </div>
        <CubeWrapper isActive={isSelectedGroup} title={groupName}>{convertAgentName(groupName)}</CubeWrapper>
        <Column tw="text-monochrome-medium-tint" title={groupName}>{groupName}</Column>
        <Column title={description}>{description}</Column>
        <Column title="Multiservice">Multiservice</Column>
        <Icons.Settings
          width={16}
          height={16}
          tw="text-monochrome-white cursor-pointer"
          onClick={((event: any) => {
            event?.stopPropagation();
            setPanel({ type: "SETTINGS", payload: { ...group, agentType: "Group" } });
          }) as any}
        />
      </StyledGroupRow>
      {isOpen && agents.map((agent) => <AgentRow key={agent.id} {...agent} />)}
    </div>
  );
};

const PreregisteredAgentRow = (agent: Agent) => {
  const setPanel = useSetPanelContext();
  const {
    name = "", status, description, agentType,
  } = agent;
  return (
    <Row tw="bg-monochrome-black text-opacity-40">
      <CubeWrapper tw="col-start-2">{convertAgentName(name)}</CubeWrapper>
      <NameColumn title={name}>
        <AgentStatusBadge status={status} />
        <span>Preregistered {name}</span>
      </NameColumn>
      <Column title={description}>{description}</Column>
      <Column title={agentType}>{agentType}</Column>
      <Icons.Settings
        width={16}
        height={16}
        onClick={((event: any) => {
          event?.stopPropagation();
          setPanel({ type: "SETTINGS", payload: agent });
        }) as any}
        tw="text-monochrome-white cursor-pointer"
      />
    </Row>
  );
};

const RegisteringAgentRow = ({
  name = "", status, description, agentType,
}: Agent) => (
  <Row tw="text-opacity-40">
    <div tw="flex justify-center items-center"><Spinner /></div>
    <NameColumn title={name}>
      <AgentStatusBadge status={status} />
      <span>Registering: {name}</span>
    </NameColumn>
    <Column title={description}>{description}</Column>
    <Column title={agentType}>{agentType}</Column>
  </Row>
);
