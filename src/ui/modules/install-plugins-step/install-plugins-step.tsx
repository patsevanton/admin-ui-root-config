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
/* eslint-disable max-len */
import React from "react";
import "twin.macro";
import { Icons, Field } from "@drill4j/ui-kit";

import { PluginListEntry } from "components";
import { Plugin } from "types/plugin";

interface Props {
  formValues?: { plugins?: string[], availablePlugins?: Plugin[] };
  infoPanel?: React.ReactNode;
}

export const InstallPluginsStep = ({ infoPanel, formValues: { plugins = [], availablePlugins = [] } = {} }: Props) => (
  <div tw="min-w-850px">
    {infoPanel}
    <div tw="pt-4 pb-4 mr-10 ml-10 text-20 leading-32 text-monochrome-default">
      {plugins.length}
      &nbsp;of&nbsp;
      {availablePlugins.length}
      &nbsp;selected
    </div>
    <div tw="mr-6 ml-6" role="group" aria-labelledby="checkbox-group">
      {availablePlugins.map(({
        id, name, description, version,
      }) => (
        <label tw="text-blue-default" key={id}>
          <Field
            type="checkbox"
            name="plugins"
            value={id}
          >
            {({ field }: any) => (
              <PluginListEntry
                field={field}
                icon={name as keyof typeof Icons}
                description={description}
              >
                <div tw="flex items-center w-full mb-3 text-14 leading-20">
                  <div tw="font-bold text-monochrome-black">{name}&nbsp;</div>
                  {version && <div tw="text-monochrome-default">({version})</div>}
                </div>
              </PluginListEntry>
            )}
          </Field>
        </label>
      ))}
    </div>
  </div>
);
