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
import axios from "axios";
import {
  requiredArray, sizeLimit, required, composeValidators, formatPackages, parsePackages,
} from "@drill4j/ui-kit";
import "twin.macro";

import {
  SystemSettingsStep, CancelAgentRegistrationModal, InstallPluginsStep, JavaGeneralRegistrationForm,
} from "modules";
import { useAgent } from "hooks";
import { Agent } from "types";
import { PanelProps } from "../panel-props";
import { Stepper } from "../stepper";

export const JsAgentRegistrationPanel = ({ isOpen, onClosePanel, payload }: PanelProps) => {
  const agent = useAgent(payload);

  return (
    <Stepper
      label="Agent Registration"
      initialValues={Object.keys(agent).length && {
        ...agent,
        systemSettings: {
          ...agent.systemSettings,
          packages: formatPackages(agent.systemSettings?.packages),
        },
      }}
      onSubmit={registerAgent}
      onSuccessMessage="Agent has been registered"
      steps={[
        {
          stepLabel: "General Info",
          validationSchema: composeValidators(
            required("name"),
            sizeLimit({ name: "name" }),
            sizeLimit({ name: "environment" }),
            sizeLimit({ name: "description", min: 3, max: 256 }),
          ),
          component: <JavaGeneralRegistrationForm />,
        },
        {
          stepLabel: "System Settings",
          validationSchema: composeValidators(sizeLimit({
            name: "systemSettings.sessionIdHeaderName",
            alias: "Session header name",
            min: 1,
            max: 256,
          }),
          requiredArray("systemSettings.packages", "Path prefix is required.")),
          component: <SystemSettingsStep />,
        },
        {
          stepLabel: "Plugins",
          validationSchema: composeValidators(
            required("name"),
            sizeLimit({ name: "name" }),
            sizeLimit({ name: "environment" }),
            sizeLimit({ name: "description", min: 3, max: 256 }),
          ),
          component: <InstallPluginsStep />,
        },
      ]}
      isOpen={isOpen}
      setIsOpen={onClosePanel}
    />
  );
};

async function registerAgent({
  id,
  name,
  environment,
  description,
  plugins,
  systemSettings,
}: Agent) {
  await axios.patch(`/agents/${id}`, {
    name,
    environment,
    description,
    plugins,
    systemSettings: {
      ...systemSettings,
      packages: parsePackages(systemSettings?.packages as unknown as string).filter(Boolean),
    },
  });
}
