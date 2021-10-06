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
import {
  Formik, Form, Button, Icons, FormValidator,
} from "@drill4j/ui-kit";
import "twin.macro";

import { sendNotificationEvent } from "@drill4j/send-notification-event";
import { CancelAgentRegistrationModal } from "../cancel-agent-registration-modal";
import { StepLabel } from "./step-label";
import { PanelWithCloseIcon } from "../../panel-with-close-icon";

interface Step {
  stepLabel: string;
  component: React.ReactNode;
  validationSchema: FormValidator;
}

interface Props {
  label: React.ReactNode;
  steps: Step[];
  initialValues?: any;
  onSubmit: (val: Record<string, unknown>) => Promise<void>;
  onSuccessMessage: string;
  isOpen?: any;
  setIsOpen?: any;
}

export const Stepper = ({
  label,
  steps,
  initialValues = {},
  onSubmit,
  onSuccessMessage,
  isOpen,
  setIsOpen,
}: Props) => {
  const [isCancelModalOpened, setIsCancelModalOpened] = useState(false);
  const [stepNumber, setStepNumber] = useState(0);
  const isLastStep = steps.length - 1;
  const currentValidationSchema = steps[stepNumber].validationSchema;
  const currentStep = steps[stepNumber].component;

  const goToNextStep = () => setStepNumber((prevStepNumber) => (prevStepNumber !== isLastStep
    ? prevStepNumber + 1
    : prevStepNumber));

  const goToPrevStep = () => setStepNumber((prevStepNumber) => (prevStepNumber === 0
    ? prevStepNumber
    : prevStepNumber - 1));

  const goTo = (index: number) => setStepNumber((prevStepNumber) => {
    if (prevStepNumber > index) return index;
    if (index - prevStepNumber === 1) return prevStepNumber + 1;
    return prevStepNumber;
  });

  if (!initialValues) return null;

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values: any) => {
          try {
            await onSubmit(values);
            sendNotificationEvent({ type: "SUCCESS", text: onSuccessMessage });
          } catch (e) {
            sendNotificationEvent({
              type: "ERROR",
              text: "On-submit error. Server problem or operation could not be processed in real-time.",
            });
          }
        }}
        validate={currentValidationSchema}
        validateOnMount
      >
        {({ isValid }) => (
          <Form autoComplete="off">
            <PanelWithCloseIcon
              header={(
                <div tw="space-y-8 pt-6 pb-4">
                  <div tw="flex justify-between">
                    {label}
                    <Button secondary size="large" onClick={() => setIsCancelModalOpened(true)}>
                      Return to List
                    </Button>
                  </div>
                  <div tw="flex gap-6 px-[320px]">
                    {steps.map(({ stepLabel }, index) => (
                      <div onClick={() => isValid && goTo(index)}>
                        <StepLabel
                          key={stepLabel}
                          isActive={index === stepNumber}
                          isCompleted={index < stepNumber}
                          stepNumber={index + 1}
                          stepLabel={stepLabel}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              footer={(
                <div tw="flex gap-4 items-center justify-center w-full h-full">
                  {stepNumber > 0 && (
                    <Button
                      secondary
                      size="large"
                      type="button"
                      onClick={goToPrevStep}
                      disabled={!isValid}
                    >
                      <Icons.StepperArrow rotate={180} width={7} height={12} />
                      Back
                    </Button>
                  )}
                  {stepNumber === isLastStep ? (
                    <Button
                      primary
                      key="finish"
                      size="large"
                      data-test="wizard:finishng-button"
                      type="submit"
                    >
                      Finish
                    </Button>
                  ) : (
                    <Button
                      primary
                      key="next"
                      size="large"
                      type="button"
                      onClick={goToNextStep}
                      disabled={!isValid}
                    >
                      Next
                      <Icons.StepperArrow width={12} height={20} />
                    </Button>
                  )}
                </div>
              )}
              isOpen={isOpen}
              onClosePanel={() => setIsOpen(false)}
            >
              <div tw="flex w-full h-full py-16 justify-center">
                {currentStep}
              </div>
            </PanelWithCloseIcon>
          </Form>
        )}
      </Formik>
      {isCancelModalOpened && (
        <CancelAgentRegistrationModal
          isOpen={isCancelModalOpened}
          onToggle={setIsCancelModalOpened}
        />
      )}
    </>
  );
};