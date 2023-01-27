import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import {
  noOfProductsOptions,
  useEcommercePlatforms,
  useMarketplaces,
  useProductCategories,
} from '../../hooks/useProducts'
import { FormikInput, FormikRadioGroup } from '../formik'
import { FormikTextArea } from '../formik/FormikTextArea'
import { FormikCheckboxList } from '../formik/FormikCheckboxList'
import { useInvitationContext } from '../../hooks/useInvitationModule'
import { useRuntime } from 'vtex.render-runtime'
import { capitalizeWord } from '../../utils/string'

const cssNames = [
  'commercialDataTabContainer',
  'tabTitle',
  'etaRetourContainer',
  'productsInfoContainer',
] as const

interface CommercialDataTabProps {
  inputHandle: string
}

function CommercialDataTab({ inputHandle = '' }: CommercialDataTabProps) {
  const intl = useIntl()
  const { invitation, isReadOnly } = useInvitationContext()

  const productCategories = useProductCategories(invitation?.productsCategories)

  const marketplaces = useMarketplaces(invitation?.connectedMarketplaces)
  const handles = useCssHandles(cssNames)

  const ecommercePlatforms = useEcommercePlatforms(
    invitation?.ecommercePlatform
  )
  const runtimeContext = useRuntime()
  const { account } = runtimeContext;
  const upperCaseAccount = capitalizeWord(account)

  return (
    <div className={`mt5 ${handles.commercialDataTabContainer}`}>
      <h3 className={handles.tabTitle}>
        <FormattedMessage id="onboarding-seller.entry.commercial-data.title" />
      </h3>

      <div className={`mb6 ${handles.productsInfoContainer}`}>
        <FormikRadioGroup
          id="noOfProducts"
          inputHandle={inputHandle}
          disabled={isReadOnly}
          hideBorder
          label={
            <FormattedMessage id="onboarding-seller.entry.commercial-data.productCount" />
          }
          options={noOfProductsOptions}
        />

        <FormikCheckboxList
          id="productsCategories"
          inputHandle={inputHandle}
          disabled={isReadOnly}
          options={productCategories}
          label={
            <FormattedMessage id="onboarding-seller.entry.commercial-data.productCategories" />
          }
        />
      </div>

      <div className={`mb6 ${handles.etaRetourContainer}`}>
        <FormikInput
          id="connectedSellerObject.etaFrom"
          type="number"
          min={1}
          readOnly={isReadOnly}
          inputHandle={inputHandle}
          label={
            <FormattedMessage id="onboarding-seller.entry.company-data.etaFrom" />
          }
          placeholder={intl.formatMessage({
            id: 'onboarding-seller.entry.company-data.etaFromPlaceholder',
          })}
        />

        <FormikInput
          id="connectedSellerObject.etaTo"
          type="number"
          min={0}
          readOnly={isReadOnly}
          inputHandle={inputHandle}
          label={
            <FormattedMessage id="onboarding-seller.entry.company-data.etaTo" />
          }
          placeholder={intl.formatMessage({
            id: 'onboarding-seller.entry.company-data.etaToPlaceholder',
          })}
        />

        <FormikInput
          id="connectedSellerObject.returnPeriod"
          type="number"
          min={0}
          readOnly={isReadOnly}
          inputHandle={inputHandle}
          label={
            <FormattedMessage id="onboarding-seller.entry.company-data.returnPeriod" />
          }
          placeholder={intl.formatMessage({
            id: 'onboarding-seller.entry.company-data.etaToPlaceholder',
          })}
        />
      </div>

      <FormikRadioGroup
        hideBorder
        id="ecommercePlatform"
        inputHandle={inputHandle}
        disabled={isReadOnly}
        options={ecommercePlatforms}
        label={
          <FormattedMessage id="onboarding-seller.entry.commercial-data.platform" />
        }
      />

      <FormikCheckboxList
        id="connectedMarketplaces"
        inputHandle={inputHandle}
        disabled={isReadOnly}
        options={marketplaces}
        label={
          <FormattedMessage id="onboarding-seller.entry.commercial-data.marketplaces" />
        }
      />

      <FormikTextArea
        id="referral"
        inputHandle={inputHandle}
        readOnly={isReadOnly}
        disabled={isReadOnly}
        label={
          intl.formatMessage({id: "onboarding-seller.entry.commercial-data.question"}, {marketplaceName: upperCaseAccount})}
      />
    </div>
  )
}

export default CommercialDataTab
