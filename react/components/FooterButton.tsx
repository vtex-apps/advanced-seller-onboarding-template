import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { Button } from 'vtex.styleguide'
import React from 'react'

import { PreleadFormSteps } from '../utils/invitation'
import { useInvitationContext } from '../hooks/useInvitationModule'

const cssNames = ['footerButton'] as const

export default function FooterButton({ guideLink }) {
  const handles = useCssHandles(cssNames)
  const {
    isReadOnly,
    stepHandler: [step],
  } = useInvitationContext()

  function openGuideLink(){
    window.open(guideLink, '_blank')
  }

  return (
    <div className={`${handles.footerButton} flex justify-center mt7`}>
      {step === PreleadFormSteps.Success ? (
        <Button onClick={openGuideLink} >
          <FormattedMessage id="onboarding-seller.form.downloadGuide" />
        </Button>
      ) : (
        <Button
          type="submit"
          disabled={step === PreleadFormSteps.TermsAndConditions && isReadOnly}
        >
          {step === PreleadFormSteps.TermsAndConditions ? (
            <FormattedMessage id="onboarding-seller.form.submitButton" />
          ) : (
            <FormattedMessage id="onboarding-seller.prelead-form.nextFooter" />
          )}
        </Button>
      )}
    </div>
  )
}
