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
  Formik, Field, Form,

  Button, DarkFormGroup, Spinner, composeValidators, Fields, required, sizeLimit,
} from "@drill4j/ui-kit";
import { sendNotificationEvent } from "@drill4j/send-notification-event";

import "twin.macro";

import { Agent } from "types/agent";
import { UnSaveChangeModal } from "pages/settings-page/un-save-changes-modal";

interface Props {
  agent: Agent;
}

export const GeneralSettingsForm = ({ agent }: Props) => (
  <Formik
    onSubmit={async ({ name, description, environment }: Agent) => {
      try {
        await axios.patch(`/agents/${agent.id}/info`, { name, description, environment });
        sendNotificationEvent({ type: "SUCCESS", text: "New settings have been saved" });
      } catch ({ response: { data: { message } = {} } = {} }) {
        sendNotificationEvent({
          type: "ERROR",
          text: "On-submit error. Server problem or operation could not be processed in real-time",
        });
      }
    }}
    enableReinitialize
    initialValues={agent}
    validate={composeValidators(
      required("name"),
      sizeLimit({ name: "name" }),
      sizeLimit({ name: "environment" }),
      sizeLimit({ name: "description", min: 3, max: 256 }),
    ) as any}
  >
    {({
      isSubmitting, isValid, dirty,
    }) => (
      <Form tw="flex flex-col gap-y-8 items-center">
        {/* TODO: move to ui-kit  */}
        <div tw="w-full space-y-6 p-6 border border-monochrome-dark rounded">
          <div>
            <div tw="text-12 leading-24 text-monochrome-dark-tint font-bold">AGENT ID</div>
            <Field name="id">
              {({ field }: any) => <div tw="text-12 leading-24 text-monochrome-light-tint">{field?.value}</div>}
            </Field>
          </div>
          <div>
            <div tw="text-14 leading-24 text-monochrome-dark-tint">TYPE</div>
            <Field name="agentType">
              {({ field }: any) => <div tw="text-12 leading-24 text-monochrome-light-tint">{field?.value}</div>}
            </Field>
          </div>
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
        <Button
          primary
          size="large"
          type="submit"
          disabled={isSubmitting || !isValid || !dirty}
          data-test="general-settings-form:save-changes-button"
        >
          {isSubmitting ? <Spinner /> : "Save Changes"}
        </Button>
        <UnSaveChangeModal />
      </Form>
    )}
  </Formik>
);
