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
import { useEffect, useRef } from "react";
import { AnyObject, FormRenderProps } from "react-final-form";

interface Props {
  handleSubmit: (
    event?: Partial<
      Pick<React.SyntheticEvent, 'preventDefault' | 'stopPropagation'>
      >
  ) => Promise<AnyObject | undefined> | undefined;
  invalid: boolean;
  pristine: boolean;
  submitting: boolean;
}

export function useFormHandleSubmit({
  handleSubmit, invalid, pristine, submitting,
}: FormRenderProps) {
  const node = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.keyCode === 13 && !submitting && !pristine && !submitting) {
        handleSubmit();
      }
    };
    node && node.current && node.current.addEventListener("keydown", listener);
    return () => {
      node && node.current && node.current.removeEventListener("keydown", listener);
    };
  }, [invalid, pristine, submitting]);

  return node;
}
