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
import axios from "axios";
import {
  Icons, DarkFormGroup, Spinner, Button, composeValidators, Fields, requiredArray, sizeLimit,
  Formik, Field, Form,
  dotsAndSlashesToSlash, formatPackages, parsePackages,
} from "@drill4j/ui-kit";

import "twin.macro";

import { Agent } from "types/agent";
import { sendNotificationEvent } from "@drill4j/send-notification-event";
import { UnSaveChangeModal } from "pages/settings-page/un-save-changes-modal";

interface Props {
  agent: Agent;
}

export const SystemSettingsForm = ({ agent }: Props) => {
  const [unlockedPackages, setUnlockedPackages] = useState(false);

  return (
    <Formik
      onSubmit={async ({ systemSettings: { sessionIdHeaderName, packages = "", targetHost } = {} }: Agent) => {
        try {
          const systemSettings = {
            packages: parsePackages(packages).filter(Boolean),
            sessionIdHeaderName,
            targetHost,
          };
          await axios.put(`/agents/${agent.id}/system-settings`, systemSettings);
          sendNotificationEvent({ type: "SUCCESS", text: "New settings have been saved" });
          setUnlockedPackages(false);
        } catch ({ response: { data: { message } = {} } = {} }) {
          sendNotificationEvent({
            type: "ERROR",
            text: "On-submit error. Server problem or operation could not be processed in real-time",
          });
        }
      }}
      initialValues={{
        ...agent,
        systemSettings: {
          ...agent.systemSettings,
          packages: formatPackages(agent.systemSettings?.packages),
        },
      }}
      enableReinitialize
      validate={composeValidators(
        requiredArray("systemSettings.packages", "Path prefix is required."),
        sizeLimit({
          name: "systemSettings.sessionIdHeaderName",
          alias: "Session header name",
          min: 1,
          max: 256,
        }),
      ) as any}
    >
      {({ isSubmitting, isValid, dirty }) => (
        <Form tw="flex flex-col items-center gap-y-8 w-[400px]">
          {unlockedPackages && (
            <div tw="flex gap-x-4 p-6 border border-orange-default rounded text-orange-default text-14 leading-24">
              <div tw="pt-1">
                <Icons.Danger />
              </div>
              Please be aware that any change to the package
              list will result in a complete loss of gathered data
              in plugins that have been using these packages.
            </div>
          )}
          <DarkFormGroup label={(
            <div tw="flex justify-between w-[400px]">
              Application Packages
              {!unlockedPackages && (
                <div onClick={() => setUnlockedPackages(true)} tw="flex items-center gap-x-2 font-regular cursor-pointer">
                  <Icons.Lock width={12} height={14} />
                  Unlock
                </div>
              )}
            </div>
          )}
          >
            <Field
              component={Fields.DarkTextarea}
              name="systemSettings.packages"
              placeholder="e.g. com/example/mypackage&#10;foo/bar/baz&#10;and so on."
              disabled={!unlockedPackages}
              normalize={(str: string) => dotsAndSlashesToSlash(str).replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, "")}
            />
          </DarkFormGroup>
          <DarkFormGroup label="Header Mapping" optional>
            <Field
              name="systemSettings.sessionIdHeaderName"
              component={Fields.DarkInput}
              placeholder="Enter session header name"
            />
          </DarkFormGroup>
          <Button
            className="flex justify-center items-center gap-x-1 w-32"
            primary
            size="large"
            type="submit"
            disabled={isSubmitting || !isValid || !dirty}
            data-test="system-settings-form:save-changes-button"
          >
            {isSubmitting ? <Spinner /> : "Save Changes"}
          </Button>
          <UnSaveChangeModal />
        </Form>
      )}
    </Formik>
  );
};
