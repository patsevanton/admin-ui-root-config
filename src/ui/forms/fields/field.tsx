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
import {
  ErrorMessage, useField, FieldInputProps, FormikProps,
} from "formik";
import tw, { styled } from "twin.macro";
import { convertToSingleSpaces } from "@drill4j/common-utils";
import { usePreserveCaretPosition } from "../../../../common-hooks";

const ErrorMessageWrapper = styled.div`
  ${tw`text-12 leading-24 whitespace-nowrap text-red-default`};

  &::first-letter {
    text-transform: uppercase;
  }
`;

interface Props {
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  placeholder: string;
  disabled: boolean;
  name: string;
  replacer?: any;
  parse?: any;
  format?: any;
}

export const fieldWrapper = (Input: React.ElementType) => ({
  field: { name }, form, placeholder, disabled, replacer, parse, format,
}: Props) => {
  const [field, meta, helper] = useField(name);
  const { isSubmitting, dirty, handleSubmit } = form;
  console.log(parse, format);

  const handleOnChange = usePreserveCaretPosition(replacer || convertToSingleSpaces);
  const node = React.useRef<HTMLFormElement>(null);
  React.useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.keyCode === 13 && !isSubmitting && dirty) {
        handleSubmit();
      }
    };
    node && node.current && node.current.addEventListener("keydown", listener);
    return () => {
      node && node.current && node.current.removeEventListener("keydown", listener);
    };
  }, [dirty, isSubmitting]);
  return (
    <>
      <Input
        {...field}
        placeholder={placeholder}
        error={meta.error}
        disabled={disabled}
        ref={node}
        onBlur={(event: React.ChangeEvent<HTMLInputElement>) => helper.setValue(event.target.value.trimEnd())}
        // onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleOnChange(field.onChange, event)}
      />
      <ErrorMessage component={ErrorMessageWrapper} name={name} />
    </>
  );
};
