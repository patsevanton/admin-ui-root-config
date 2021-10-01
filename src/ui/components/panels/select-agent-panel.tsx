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
import { Badge, Icons } from "@drill4j/ui-kit";
import tw, { styled } from "twin.macro";

import { convertAgentName } from "utils";
import { Panel } from "./panel";
import { PanelProps } from "./panel-props";
import { Cube } from "../cubes";

export const SelectAgentPanel = ({ isOpen, onClosePanel }: PanelProps) => {
  console.log("asd");
  return (
    <Panel header={<div tw="flex items-center h-21">Select Agent</div>} isOpen={isOpen} onClosePanel={onClosePanel}>
      <div tw="w-[1024px] text-monochrome-medium-tint text-14 leading-20">
        <Layout>
          <ColumnWithMargin tw="col-start-3">Name</ColumnWithMargin>
          <ColumnWithMargin tw="col-start-4">Description</ColumnWithMargin>
          <ColumnWithMargin tw="col-start-5">Type</ColumnWithMargin>
        </Layout>
        <RowLayout>
          <Badge color="green" bold>NEW</Badge>
          <CubeWrapper tw="ml-2" isActive={false} id="Agent 4">{convertAgentName("Agent 4")}</CubeWrapper>
          <ColumnWithMargin>Agent 4</ColumnWithMargin>
          <ColumnWithMargin>description</ColumnWithMargin>
          <ColumnWithMargin>Node.js</ColumnWithMargin>
          <Icons.Settings width={16} height={16} tw="cursor-pointer" />
        </RowLayout>
      </div>
    </Panel>
  );
};

const Layout = styled.div`
  ${tw`grid items-center grid-cols-[28px 44px 3fr 4fr 88px 16px] h-[60px] pl-4 pr-6`}
`;

// const Layout = styled.div`
//   ${tw`grid items-center grid-cols-[1fr 388px 112px 16px] h-[60px] pl-4 pr-6`}
// `;

const RowLayout = styled(Layout)(({ selected }:{ selected?: boolean }) => [
  tw`rounded-lg bg-monochrome-dark100 box-border border border-monochrome-dark100`,
  tw`hover:(border border-blue-default border-opacity-50)`,
  selected && tw`hover:(border-opacity-100)`,
]);

const CubeWrapper = styled(Cube)`
  ${({ isActive }) => !isActive && tw`bg-[#444244]`}
`;

const ColumnWithMargin = styled.div`
  ${tw`mx-3`}
`;
