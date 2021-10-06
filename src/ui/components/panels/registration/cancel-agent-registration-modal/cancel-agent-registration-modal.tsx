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
import { Button, Popup } from "@drill4j/ui-kit";
import "twin.macro";

interface Props {
  isOpen: boolean;
  onToggle: (value: boolean) => void;
}

export const CancelAgentRegistrationModal = ({ isOpen, onToggle }: Props) => (
  <Popup
    isOpen={isOpen}
    onToggle={onToggle}
    header="Cancel Registration"
    closeOnFadeClick
  >
    <div tw="w-108">
      <div tw="mx-6 mb-6 mt-4">
        <div tw="text-14 pr-24">
          Are you sure you want to cancel the registration?
          All your progress will be lost.
        </div>
        <div tw="flex mt-6 gap-4">
          <Button primary size="large" onClick={() => onToggle(false)}>
            No, Continue
          </Button>
          <Button secondary size="large" onClick={() => onToggle(false)}>
            Yes, Cancel
          </Button>
        </div>
      </div>
    </div>
  </Popup>
);
