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
import "twin.macro";

interface Props {
  header: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onClosePanel: () => void;
}

export const Panel = ({
  children, header, isOpen, onClosePanel, footer,
}: Props) => (isOpen
  ? (
    <>
      <div tw="absolute top-0 left-12 z-20 text-monochrome-light-tint text-24 h-full left-12 flex flex-col">
        <div tw="px-6 py-7 leading-32 bg-monochrome-black">{header}</div>
        <div tw="bg-monochrome-black flex-grow" style={{ opacity: "0.97" }}>{children}</div>
        {footer && <div tw="h-18 bg-monochrome-black">{footer}</div>}
      </div>
      <div onClick={onClosePanel} tw="absolute z-10 inset-0 left-12" style={{ background: "rgba(0, 0, 0, 0.4)" }} />
    </>
  ) : null
);
