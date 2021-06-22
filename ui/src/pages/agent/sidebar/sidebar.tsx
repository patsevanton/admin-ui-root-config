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
import { useQueryParams } from "@drill4j/react-hooks";
import { Icons, Tooltip } from "@drill4j/ui-kit";
import "twin.macro";

import { SidebarLink } from "components";

interface Props {
  active?: "active";
  links: Array<{
    id: string;
    name: keyof typeof Icons;
    link: string;
    computed?: boolean;
  }>;
  matchParams?: { path: string };
}

export const Sidebar = ({ links }: Props) => {
  const { agentId, buildVersion, pluginId } = useQueryParams<{ agentId: string; buildVersion: string; pluginId: string; }>();

  return (
    <div tw="flex flex-col w-20 h-full bg-monochrome-light-tint">
      {links.map(({
        name, link, computed,
      }) => {
        const Icon = Icons[name] || Icons.Plugins;
        return (
          <Tooltip message={<div>{name}</div>} position="right" key={link}>
            <SidebarLink
              isActive={Boolean(pluginId)}
              to={`/${computed ? `full-page/${agentId}/${buildVersion}/${link}` : link}`}
            >
              <Icon />
            </SidebarLink>
          </Tooltip>
        );
      })}
    </div>
  );
};
