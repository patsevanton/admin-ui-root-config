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
import { Icons } from "@drill4j/ui-kit";
import { useAdminConnection } from "hooks";
import { Notification as NotificationType } from "types";
import "twin.macro";

import { CubeWithTooltip } from "../cubes";
import { usePanelContext, useSetPanelContext } from "../panels";
import { IndicatorInEdge } from "../indicator-in-edge";

export const Notifications = () => {
  const openModal = useSetPanelContext();
  const activePane = usePanelContext();
  const notifications = useAdminConnection<NotificationType[]>("/notifications") || [];
  const hasUnreadNotification = notifications.some((notification) => !notification.read);

  return (
    <CubeWithTooltip
      tooltip="Notifications"
      isActive={activePane?.type === "NOTIFICATIONS"}
      onClick={() => openModal({ type: "NOTIFICATIONS" })}
    >
      <div tw="text-monochrome-black">
        <IndicatorInEdge
          position="top-right"
          isHidden={!hasUnreadNotification}
          indicatorContent={<div tw="rounded-lg w-2 h-2 bg-blue-default" />}
          style={{ top: "4px", right: "3px" }}
        >
          <Icons.Notification tw="text-monochrome-white" />
        </IndicatorInEdge>
      </div>
    </CubeWithTooltip>
  );
};
