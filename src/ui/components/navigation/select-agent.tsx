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
import { Icons } from "@drill4j/ui-kit";
import { ActionBlock } from "./action-block";
import { Panel } from "./panel";

export const SelectAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isAgent = true;
  return (
    <>
      <ActionBlock tooltip="Select Agent" isActive={isOpen} onClick={() => setIsOpen(!isOpen)}>
        {isAgent ? <Icons.Agent /> : <Icons.ServiceGroup />}
      </ActionBlock>
      <Panel
        header={<div>Select Agent </div>}
        isOpen={isOpen}
        onClosePanel={() => setIsOpen(false)}
      >
        <div style={{ width: "1100px" }} />
      </Panel>
    </>
  );
};
