import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { FormikInput } from '../formik'
import { useInvitationContext } from '../../hooks/useInvitationModule'

const cssNames = ['generalDataTabContainer', 'tabTitle'] as const

interface GeneralDataTabProps {
  inputHandle: string
  preleadForm?: boolean
}

function GeneralDataTab({
  inputHandle = '',
  preleadForm = false,
}: GeneralDataTabProps) {
  const handles = useCssHandles(cssNames)
  const { isReadOnly } = useInvitationContext()

  return (
    <div className={handles.generalDataTabContainer}>
      <h3 className={handles.tabTitle}>
        <FormattedMessage id="onboarding-seller.entry.general-data.title" />
      </h3>

      <FormikInput
        id="email"
        inputHandle={inputHandle}
        readOnly
        label={
          <FormattedMessage id="onboarding-seller.entry.general-data.email" />
        }
      />

      <FormikInput
        id="companyName"
        inputHandle={inputHandle}
        readOnly={isReadOnly}
        label={
          <FormattedMessage id="onboarding-seller.entry.general-data.companyName" />
        }
      />

      <FormikInput
        id="firstName"
        inputHandle={inputHandle}
        readOnly={isReadOnly}
        label={
          <FormattedMessage id="onboarding-seller.entry.general-data.firstName" />
        }
      />

      <FormikInput
        id="lastName"
        inputHandle={inputHandle}
        readOnly={isReadOnly}
        label={
          <FormattedMessage id="onboarding-seller.entry.general-data.lastName" />
        }
      />

      <FormikInput
        id="jobTitle"
        inputHandle={inputHandle}
        readOnly={isReadOnly}
        label={
          <FormattedMessage id="onboarding-seller.entry.general-data.jobTitle" />
        }
      />

      <FormikInput
        id="phone"
        inputHandle={inputHandle}
        readOnly={isReadOnly}
        label={
          <FormattedMessage id="onboarding-seller.entry.general-data.phone" />
        }
      />

      <FormikInput
        id="companyDescription"
        inputHandle={inputHandle}
        readOnly={isReadOnly}
        label={
          <FormattedMessage id="onboarding-seller.entry.general-data.companyDescription" />
        }
      />

      {!preleadForm && (
        <FormikInput
          id="connectedSellerObject.paymentProviderMerchantId"
          inputHandle={inputHandle}
          readOnly={isReadOnly}
          label={
            <FormattedMessage id="onboarding-seller.entry.general-data.paymentProviderMerchantId" />
          }
        />
      )}

      <FormikInput
        id="website"
        inputHandle={inputHandle}
        readOnly={isReadOnly}
        label={
          <FormattedMessage id="onboarding-seller.entry.general-data.website" />
        }
      />
    </div>
  )
}

export default GeneralDataTab
