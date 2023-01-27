import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

const cssNames = [
  'progressLabelsContainer',
  'progressLabel',
  'progressLabelCompleted',
  'progressLabelActive',
] as const

function ProgressLabels({ steps }) {
  const handles = useCssHandles(cssNames)

  function getCurrentLabel(index: number): JSX.Element {
    switch (index) {
      case 0:
        return (
          <FormattedMessage id="onboarding-seller.entry.general-data.title" />
        )

      case 1:
        return (
          <FormattedMessage id="onboarding-seller.entry.company-data.title" />
        )

      case 2:
        return (
          <FormattedMessage id="onboarding-seller.entry.commercial-data.title" />
        )

      case 3:
        return (
          <FormattedMessage id="onboarding-seller.prelead-form.upload.title" />
        )

      case 4:
        return (
          <FormattedMessage id="onboarding-seller.prelead-form.privacy.title" />
        )

      default:
        return (
          <FormattedMessage id="onboarding-seller.entry.general-data.title" />
        )
    }
  }

  function getLabelClasses(step: string) {
    let classes = `w-20 dib tc ${handles.progressLabel}`

    if (step === 'inProgress') {
      classes += ` ${handles.progressLabelActive}`
    }

    if (step === 'completed') {
      classes += ` ${handles.progressLabelCompleted}`
    }

    return classes
  }

  if (!steps) return null

  return (
    <div className={handles.progressLabelsContainer}>
      {steps.map((step, index) => {
        const CurrentLabel = getCurrentLabel(index)

        return (
          <span className={getLabelClasses(step)} key={index}>
            {CurrentLabel}
          </span>
        )
      })}
    </div>
  )
}

export default ProgressLabels
