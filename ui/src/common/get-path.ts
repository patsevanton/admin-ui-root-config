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
import { createRouter, getPagePath } from "nanostores";

interface Routes {
  agentsTable: void
  agentDashboard: "agentId" | "buildVersion"
  serviceGroupDashboard: "serviceGroupId"
  agentPlugin: "agentId" | "pluginId" | "buildVersion"
  agentSettings: "agentId" | "tab"
  serviceGroupSettings: "serviceGroupId" | "tab"
  agentRegistration: "agentId"
  serviceGroupRegistration: "serviceGroupId"
  addPluginModal: "entity" | "id"
}

const routes = {
  agentsTable: "/",
  agentDashboard: "/agent/:agentId/:buildVersion/dashboard",
  serviceGroupDashboard: "/service-group/:serviceGroupId/dashboard",
  agentPlugin: "/agent/:agentId/:buildVersion/plugin/:pluginId",
  agentSettings: "/agent/:agentId/settings/:tab",
  serviceGroupSettings: "/service-group/:serviceGroupId/settings/:tab",
  agentRegistration: "/agent/:agentId/registration",
  serviceGroupRegistration: "/service-group/:serviceGroupId/registration",
  addPluginModal: "/:entity/:id/settings/plugins/add-plugin-modal",
};

export const router = createRouter<Routes>(routes);

interface Path<PageName extends keyof AppPages, AppPages extends Routes> {
  name: PageName;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  params?: AppPages[PageName] extends void ? void : Record<AppPages[PageName], string>;
}

export const getPath = <AppPages extends Routes, PageName extends keyof AppPages>({ name, params }: Path<PageName, AppPages>): string =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  getPagePath(router, name, params);
