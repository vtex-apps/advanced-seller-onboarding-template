import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { ButtonWithIcon } from 'vtex.styleguide'
import { IconCaret } from 'vtex.store-icons'
import React from 'react'

import { PreleadFormSteps } from '../utils/invitation'
import { useInvitationContext } from '../hooks/useInvitationModule'

const cssNames = ['stepsContainer', 'leftStep', 'rightStep'] as const

export function StepButtons() {
  const handles = useCssHandles(cssNames)
  const {
    isReadOnly,
    stepHandler: [step, setStep],
  } = useInvitationContext()

  return step === PreleadFormSteps.Success ? null : (
    <div className={`mt6 flex justify-between ${handles.stepsContainer}`}>
      <div className={`mr2 ${handles.leftStep}`}>
        <ButtonWithIcon
          variation="tertiary"
          icon={<IconCaret orientation="left" />}
          disabled={step === PreleadFormSteps.GeneralData}
          onClick={() => setStep(step - 1)}
        >
          <FormattedMessage id="onboarding-seller.prelead-form.back" />
        </ButtonWithIcon>
      </div>

      <div className={`mr2 ${handles.rightStep}`}>
        <ButtonWithIcon
          iconPosition="right"
          variation="tertiary"
          type="submit"
          icon={<IconCaret orientation="right" />}
          disabled={step === PreleadFormSteps.TermsAndConditions && isReadOnly}
        >
          {step === PreleadFormSteps.TermsAndConditions ? (
            <FormattedMessage id="onboarding-seller.form.submitButton" />
          ) : (
            <FormattedMessage id="onboarding-seller.prelead-form.next" />
          )}
        </ButtonWithIcon>
      </div>
    </div>
  )
}
