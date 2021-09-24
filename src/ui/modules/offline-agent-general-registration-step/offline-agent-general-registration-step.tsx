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
  Field, FormGroup, Fields,
} from "@drill4j/ui-kit";
import "twin.macro";

export const OfflineAgentGeneralRegistrationStep = () => (
  <div tw="space-y-8">
    <FormGroup label="Agent name">
      <Field name="name" component={Fields.DarkInput} placeholder="Enter agent's name" />
    </FormGroup>
    <FormGroup label="Agent ID">
      <Field name="id" component={Fields.DarkInput} placeholder="Enter agent's name" />
    </FormGroup>
    <FormGroup label="Agent Type">
      <Field
        name="agentType"
        as="select"
        placeholder="Select Agent type"
        tw="
    appearance-none
    w-[400px] h-10 px-4
    box-border outline-none
    font-regular text-14 leading-24 text-monochrome-medium-tint
    bg-monochrome-black border rounded border-monochrome-dark
    placeholder-monochrome-dark
    focus:border-monochrome-white
    "
      >
        <option tw="bg-red-default rounded border-monochrome-dark" value="red">Red</option>
        <option value="green">Green</option>
        <option tw="border rounded border-monochrome-dark" value="blue">Blue</option>
      </Field>
    </FormGroup>
    <FormGroup label="Description" optional>
      <Field
        name="description"
        component={Fields.DarkTextarea}
        normalize={(str: string) => str.replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, "")}
        placeholder="Add agent's description"
      />
    </FormGroup>
  </div>
);
