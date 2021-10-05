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
import { capitalize } from "@drill4j/ui-kit";
import tw, { styled } from "twin.macro";
import { useAdminConnection } from "hooks";
import { Agent } from "types";
import { PanelProps } from "../panel-props";
import { PanelWithCloseIcon } from "../panel-with-close-icon";
import { GeneralSettingsForm } from "./agent-settings/general-settings-form";
import { JsSystemSettingsForm } from "./agent-settings/js-system-settings-form";
import { SystemSettingsForm } from "./agent-settings/system-settings-form";
import { PluginsSettingsTab } from "./agent-settings/plugins-settings-tab";

export const SettingsPanel = ({ isOpen, onClosePanel, payload }: PanelProps) => {
  const [activeTab, setActiveTab] = useState("plugins");
  const agent = useAdminConnection<Agent>(`/api/agents/${payload}`) || {};
  const SystemSettings = agent.agentType === "Node.js" ? JsSystemSettingsForm : SystemSettingsForm;
  return (
    <PanelWithCloseIcon
      header={(
        <div tw="space-y-8 pt-6 pb-3 w-[1024px]">
          <div tw="">Settings: {capitalize(payload)}</div>
          <div tw="flex justify-center gap-x-6">
            {["general", "system", "plugins"].map((tab) => (
              <Tab
                key={tab}
                active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Tab>
            ))}
          </div>
        </div>
      )}
      isOpen={isOpen}
      onClosePanel={onClosePanel}
    >
      <div tw="flex w-full h-full py-16 justify-center">
        {activeTab === "general" && <GeneralSettingsForm agent={agent} />}
        {activeTab === "system" && <SystemSettings agent={agent} />}
        {activeTab === "plugins" && <PluginsSettingsTab agent={agent} />}
      </div>
    </PanelWithCloseIcon>
  );
};

const Tab = styled.div`
  ${tw`
      relative inline-flex text-14 leading-20 text-monochrome-default font-bold cursor-pointer capitalize
      hover:text-blue-medium-tint
  `};

  ${({ active }: { active: boolean }) => active && tw`
    text-blue-default
    after:(content block absolute top-7 h-1 w-full bg-blue-default rounded-t-lg)
  `}
`;
