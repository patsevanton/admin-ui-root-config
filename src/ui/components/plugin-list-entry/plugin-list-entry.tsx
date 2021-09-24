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
import { FieldInputProps, Icons, Checkbox } from "@drill4j/ui-kit";

import tw, { styled } from "twin.macro";

interface Props {
  name?: string;
  version?: string;
  description?: string;
  icon: keyof typeof Icons;
  checkbox?: React.ReactNode;
  button?: React.ReactNode;
}

export const PluginListEntry = ({
  name, version, description, field, icon, children,
}: any) => (
  <div tw="py-5 px-6 bg-monochrome-dark100 rounded-lg">
    <div tw="flex gap-x-4">
      {icon}
      <div tw="space-y-2">
        <div tw="flex gap-x-2">
          <Label>{name}</Label>
          <Version>{version}</Version>
        </div>
        <Description>{description}</Description>
      </div>
    </div>
  </div>
);

export const PluginCard = ({
  name, version, description, icon, checkbox, button,
}: Props) => {
  const PluginIcon = Icons[icon] || Icons.Plugins;
  return (
    <div tw="w-[976px] py-5 px-6 bg-monochrome-dark100 rounded-lg text-14 leading-20">
      <div tw="flex gap-x-4">
        <div tw="flex gap-x-6 items-center">
          {checkbox}
          <PluginIconWrapper>
            <PluginIcon />
          </PluginIconWrapper>
        </div>
        <div tw="space-y-2">
          <div tw="flex gap-x-2">
            <Label>{name}</Label>
            <Version>({version})</Version>
          </div>
          <Description>{description}</Description>
        </div>
      </div>
    </div>
  );
};

const PluginIconWrapper = styled.div`
  ${tw`w-18 p-5 bg-monochrome-dark text-monochrome-default rounded-lg`}
`;

const Label = styled.div`
  ${tw`font-bold text-monochrome-light-tint`}
`;

const Version = styled.div`
  ${tw`text-monochrome-default`}
`;

const Description = styled.div`
  ${tw`w-[716px] text-monochrome-light-tint`}
`;
