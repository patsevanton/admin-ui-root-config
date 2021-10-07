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
import tw, { styled } from "twin.macro";

import { Cube } from "../../cubes";

export const Layout = styled.div`
  ${tw`grid items-center grid-cols-[28px 44px 3fr 4fr 112px 16px] h-[60px] px-4`}
`;

export const Row = styled(Layout)`
  ${tw`rounded-lg bg-monochrome-dark100 box-border border border-monochrome-dark100 text-monochrome-dark-tint`}
`;

export const AgentRow = styled(Row)(({ selected }:{ selected?: boolean }) => [
  tw`hover:(border border-blue-default border-opacity-50)`,
  selected && tw`border-blue-default border-opacity-100 hover:(border-blue-default border-opacity-100)`,
]);

export const GroupAgentRow = styled(AgentRow)(({ selected }:{ selected?: boolean }) => [
  tw`bg-monochrome-black100 border-monochrome-black100`,
  selected && tw`border-blue-default border-opacity-100`,
]);

export const GroupRow = styled(AgentRow)(({ isOpen }: { isOpen: boolean; }) => [
  isOpen && tw`rounded-br-none rounded-bl-none`,
]);

export const CubeWrapper = styled(Cube)`
  ${tw`ml-2 text-monochrome-medium-tint cursor-default`}
  ${({ isActive }) => !isActive && tw`bg-monochrome-dark hover:bg-monochrome-dark`}
`;

export const Column = styled.div`
  ${tw`mx-3 text-ellipsis`}
`;

export const NameColumn = styled(Column)`
  ${tw`flex gap-x-1 items-center text-monochrome-medium-tint text-opacity-[inherit]`}
`;
