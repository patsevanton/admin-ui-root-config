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
import { Tooltip } from "@drill4j/ui-kit";
import tw, { styled } from "twin.macro";

interface Props {
  isActive: boolean;
  children: React.ReactNode;
  tooltip: string;
}

export const ActionBlock = ({ isActive, children, tooltip }: Props) => (
  <Tooltip message={tooltip} position="right">
    <Wrapper isActive={isActive}>
      {children}
    </Wrapper>
  </Tooltip>
);

const Wrapper = styled.div(({ isActive }: {isActive: boolean}) => [
  tw`flex justify-center items-center w-9 h-9 rounded text-monochrome-white cursor-pointer`,
  isActive ? tw`bg-blue-default` : tw`bg-monochrome-black hover:bg-monochrome-white hover:bg-opacity-10`,
]);
