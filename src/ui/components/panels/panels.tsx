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
import { useLocation } from "react-router-dom";
import { AgentRegistrationPanel } from "./agent-registration-panel";
import { SelectAgentPanel } from "./select-agent-panel";
import { AddAgentPanel } from "./add-agent-panel";
import { NotificationsPanel } from "./notifications-panel";
import { PanelsType, usePanelContext, useSetPanelContext } from "../navigation";
import { PanelProps } from "./panel-props";

const panels: Record<PanelsType, ({ isOpen, onClosePanel }: PanelProps) => JSX.Element> = {
  AGENT_REGISTRATION: AgentRegistrationPanel,
  NOTIFICATIONS: NotificationsPanel,
  ADD_AGENT: AddAgentPanel,
  SELECT_AGENT: SelectAgentPanel,
};

export const Panels = () => {
  const activePanel = usePanelContext();
  const setActivePanel = useSetPanelContext();
  const { pathname } = useLocation();

  useEffect(() => {
    setActivePanel(null);
  }, [pathname]);

  if (!activePanel) {
    return null;
  }

  const Panel = panels[activePanel];

  return <Panel isOpen onClosePanel={() => setActivePanel(null)} />;
};
