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
import { Inputs } from "@drill4j/ui-kit";
import "twin.macro";
import { SystemSettingsRegistrationStep } from "../system-settings-registration-step";

export const GroupSystemSettingsRegistrationStep = () => (
  <div tw="space-y-8">
    <div tw="space-y-4">
      <label tw="flex items-center gap-2 text-14 leading-20">
        <Inputs.Radio tw="text-blue-default" checked disabled />
        Apply parameters to all Agents
      </label>
      <label tw="flex items-center gap-2 text-14 leading-20">
        <Inputs.Radio tw="text-blue-default" disabled />
        Add parameters separately
      </label>
    </div>
    <SystemSettingsRegistrationStep />
  </div>
);
