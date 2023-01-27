import React, { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { useFormikContext } from 'formik'

import { COMPANY_TYPE_OPTIONS, COUNTRY_OPTIONS } from '../../utils/invitation'
import { FormikInput, FormikRadioGroup, FormikDropdown } from '../formik'
import { useInvitationContext } from '../../hooks/useInvitationModule'

const cssNames = ['companyDataTabContainer', 'tabTitle'] as const

interface CompanyDataTabProps {
  inputHandle: string
}

function CompanyDataTab({ inputHandle = '' }: CompanyDataTabProps) {
  const handles = useCssHandles(cssNames)
  const { isReadOnly } = useInvitationContext()

  const intl = useIntl()

  return (
    <div className={`mt5 ${handles.companyDataTabContainer}`}>
      <h3 className={handles.tabTitle}>
        <FormattedMessage id="onboarding-seller.entry.company-data.title" />
      </h3>

      <FormikDropdown
        id="companyType"
        size="medium"
        inputHandle={inputHandle}
        disabled={isReadOnly}
        options={COMPANY_TYPE_OPTIONS(intl)}
        label={intl.formatMessage({
          id: 'onboarding-seller.entry.company-data.companyType',
        })}
      />

      <FormikRadioGroup
        id="isPayingVat"
        inputHandle={inputHandle}
        disabled={isReadOnly}
        hideBorder
        label={
          <FormattedMessage id="onboarding-seller.entry.company-data.isPayingVat" />
        }
        options={[
          {
            value: 'true',
            label: <FormattedMessage id="onboarding-seller.vat.true" />,
          },
          {
            value: 'false',
            label: <FormattedMessage id="onboarding-seller.vat.false" />,
          },
        ]}
      />

      <VatinField
        id="vatin"
        readOnly={isReadOnly}
        inputHandle={inputHandle}
        label={
          <FormattedMessage id="onboarding-seller.entry.company-data.vatin" />
        }
      />

      <FormikInput
        id="tradeRegistrationNumber"
        readOnly={isReadOnly}
        inputHandle={inputHandle}
        label={
          <FormattedMessage id="onboarding-seller.entry.company-data.tradeRegistrationNumber" />
        }
      />

      <FormikDropdown
        id="companyCountry"
        size="medium"
        inputHandle={inputHandle}
        disabled={isReadOnly}
        options={COUNTRY_OPTIONS}
        label={intl.formatMessage({
          id: 'onboarding-seller.entry.company-data.companyCountry',
        })}
      />

      {/* <FormikInput
        id="companyPostalCode"
        isReadOnly={isReadOnly}
        inputHandle={inputHandle}
        label={
          <FormattedMessage id="onboarding-seller.entry.company-data.companyPostalCode" />
        }
      /> */}

      <FormikInput
        id="companyCounty"
        readOnly={isReadOnly}
        inputHandle={inputHandle}
        label={
          <FormattedMessage id="onboarding-seller.entry.company-data.companyCounty" />
        }
      />

      <FormikInput
        id="companyCity"
        readOnly={isReadOnly}
        inputHandle={inputHandle}
        label={
          <FormattedMessage id="onboarding-seller.entry.company-data.companyCity" />
        }
      />

      <FormikInput
        id="companyStreet"
        readOnly={isReadOnly}
        inputHandle={inputHandle}
        label={
          <FormattedMessage id="onboarding-seller.entry.company-data.companyStreet" />
        }
      />

      <FormikInput
        id="companyStreetNumber"
        readOnly={isReadOnly}
        inputHandle={inputHandle}
        label={
          <FormattedMessage id="onboarding-seller.entry.company-data.companyStreetNumber" />
        }
      />

      <FormikInput
        id="companyAddressComplement"
        readOnly={isReadOnly}
        inputHandle={inputHandle}
        label={
          <FormattedMessage id="onboarding-seller.entry.company-data.companyAddressComplement" />
        }
      />

      <FormikInput
        id="companyBank"
        readOnly={isReadOnly}
        inputHandle={inputHandle}
        label={
          <FormattedMessage id="onboarding-seller.entry.company-data.companyBank" />
        }
      />

      <FormikInput
        id="iban"
        readOnly={isReadOnly}
        inputHandle={inputHandle}
        label={
          <FormattedMessage id="onboarding-seller.entry.company-data.iban" />
        }
      />
    </div>
  )
}

function VatinField(props) {
  const {
    values: { companyCountry, isPayingVat, [props.id]: vatin },
    setFieldValue,
  } = useFormikContext<any>()

  useEffect(() => {
    const newVatin = vatin.replace(/\s+/g, '')

    if (newVatin !== vatin) {
       setFieldValue(props.id, newVatin)
    }
  }, [vatin, isPayingVat, props.id, companyCountry, setFieldValue])

  return <FormikInput {...props} />
}

export default CompanyDataTab
