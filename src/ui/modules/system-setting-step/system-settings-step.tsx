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
  Field,
  FormGroup,
  Fields,
  dotsAndSlashesToSlash,
  Icons,
  Tooltip,
} from "@drill4j/ui-kit";

import "twin.macro";

export const SystemSettingsStep = () => (
  <div tw="space-y-10">
    <div tw="flex flex-col items-center">
      <div tw="w-97 space-y-6">
        <div tw="space-y-2">
          <FormGroup
            label="asd"
          >
            <Field
              tw="h-20"
              component={Fields.DarkTextarea}
              name="systemSettings.packages"
              placeholder="e.g., package_name/class_name/method_name"
              normalize={(str: string) =>
                dotsAndSlashesToSlash(str).replace(
                  /(?:(?:\r\n|\r|\n)\s*){2}/gm,
                  "",
                )}
            />
          </FormGroup>
          <div tw="text-14 leading-20 text-monochrome-light-tint">
            Make sure you add application packages only, otherwise Agent&apos;s
            performance will be affected.
          </div>
        </div>
        <FormGroup
          label="asd"
          optional
        >
          <Field
            name="systemSettings.sessionIdHeaderName"
            component={Fields.DarkInput}
            placeholder="Enter session header name"
            label="Session header name"
          />
        </FormGroup>
      </div>
    </div>
  </div>
);
