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
import {
  Field, DisabledFormGroup, DarkFormGroup, Fields,
} from "@drill4j/ui-kit";

import "twin.macro";

export const GeneralSettingsForm = () => (
  <>
    <div tw="w-[400px]">
      <DisabledFormGroup fields={["id", "agentType"]} />
    </div>
    <DarkFormGroup label="Agent name">
      <Field name="name" component={Fields.DarkInput} placeholder="Enter agent's name" />
    </DarkFormGroup>
    <DarkFormGroup label="Description" optional>
      <Field
        name="description"
        component={Fields.DarkTextarea}
        normalize={(str: string) => str.replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, "")}
        placeholder="Add agent's description"
      />
    </DarkFormGroup>
    <DarkFormGroup label="Environment" optional>
      <Field
        name="environment"
        component={Fields.DarkInput}
        placeholder="Specify an environment"
      />
    </DarkFormGroup>
  </>
);
