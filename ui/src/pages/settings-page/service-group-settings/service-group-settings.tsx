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
import React, { useState, useEffect } from "react";
import {
  useParams, Switch, Route, Prompt,
} from "react-router-dom";
import { Icons } from "@drill4j/ui-kit";
import "twin.macro";

import { TabsPanel, Tab, PageHeader } from "components";
import { PluginsSettingsTab, SystemSettingsForm } from "modules";
import { useAdminConnection } from "hooks";
import { ServiceGroupEntity } from "types/service-group-entity";
import { ServiceGroupGeneralSettingsForm } from "./service-group-general-settings-form";
import { UnSaveChangeModal } from "../un-save-changes-modal";
import { getPath } from "../../../common/get-path";

export const ServiceGroupSettings = () => {
  const [pristineSettings, setPristineSettings] = useState(true);
  const [nextLocation, setNextLocation] = useState("");
  const { serviceGroupId = "", tab = "" } = useParams<{ serviceGroupId: string; tab: string}>();
  const serviceGroup = useAdminConnection<ServiceGroupEntity>(`/api/groups/${serviceGroupId}`) || {};

  useEffect(() => {
    setPristineSettings(true);
  }, [tab]);

  return (
    <div tw="flex flex-col w-full">
      <PageHeader
        title={(
          <div tw="flex items-center gap-x-4 w-full pt-5 pb-7">
            <Icons.Settings tw="text-monochrome-default" height={20} width={20} />
            Service Group Settings
          </div>
        )}
      />
      <div tw="px-6">
        <TabsPanel>
          <Tab name="general" to={getPath({ name: "serviceGroupSettings", params: { serviceGroupId, tab: "general" } })}>General</Tab>
          <Tab name="system" to={getPath({ name: "serviceGroupSettings", params: { serviceGroupId, tab: "system" } })}>System</Tab>
          <Tab name="plugins" to={getPath({ name: "serviceGroupSettings", params: { serviceGroupId, tab: "plugins" } })}>Plugins</Tab>
        </TabsPanel>
      </div>
      <Switch>
        <Route
          path="/service-group/:serviceGroupId/settings/system"
          render={() => <SystemSettingsForm agent={serviceGroup} setPristineSettings={setPristineSettings} isServiceGroup />}
        />
        <Route
          path="/service-group/:serviceGroupId/settings/plugins"
          render={() => <PluginsSettingsTab agent={serviceGroup} />}
        />
        <Route
          path="/service-group/:serviceGroupId/settings/general"
          render={() => <ServiceGroupGeneralSettingsForm serviceGroup={serviceGroup} setPristineSettings={setPristineSettings} />}
        />
      </Switch>
      <UnSaveChangeModal
        setNextLocation={setNextLocation}
        path={nextLocation}
      />
      <Prompt
        when={!pristineSettings}
        message={({ pathname, state }) => {
          const { pristine } = state as { pristine: boolean } || {};

          if (pristineSettings || pristine) {
            return true;
          }
          setNextLocation(pathname);
          return false;
        }}
      />
    </div>
  );
};
