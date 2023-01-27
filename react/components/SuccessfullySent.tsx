import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'
import { capitalizeWord } from '../utils/string'

const cssNames = [
  'successfullySentContainer',
  'successfullySentTitle',
  'successfullySentSubtitle',
  'nextStepsContainer',
  'successStep',
] as const

function SuccessfullySent() {
  const runtimeContext = useRuntime()
  const { account } = runtimeContext
  const upperCaseAccount = capitalizeWord(account)

  const nextSteps = [
    {
      message: (
        <FormattedMessage id="onboarding-seller.prelead-form.submitted.nextStep1" />
      ),
    },
    {
      message: (
        <FormattedMessage id="onboarding-seller.prelead-form.submitted.nextStep2" />
      ),
    },
    {
      message: (
        <FormattedMessage
          id="onboarding-seller.prelead-form.submitted.nextStep3"
          values={{ marketplaceName: upperCaseAccount }}
        />
      ),
    },
  ]

  const handles = useCssHandles(cssNames)

  return (
    <div
      className={`flex tc mt6 mb6 flex-column ${handles.successfullySentContainer}`}
    >
      <h2
        className={`c-action-primary f2 mb0 ${handles.successfullySentTitle}`}
      >
        <FormattedMessage id="onboarding-seller.prelead-form.submitted.title" />
      </h2>
      <h3 className={`mt3 ${handles.successfullySentSubtitle}`}>
        <FormattedMessage id="onboarding-seller.prelead-form.submitted.subtitle" />
      </h3>
      <div className={handles.nextStepsContainer}>
        {nextSteps.map((step, index) => {
          return (
            <div className={`mv5 ${handles.successStep}`} key={index}>
              {step.message}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SuccessfullySent
