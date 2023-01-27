import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useIntl } from 'react-intl'

import { SellerContext } from './DataProvider'

const handles = ['property', 'label', 'etaProduct', 'eta']

const CompanyEta = () => {
  const { sellerData, pageType } = React.useContext(SellerContext)

  const classes = useCssHandles(handles)
  const intl = useIntl()

  if (!sellerData?.etaFrom && !sellerData?.etaTo) return null

  if(!sellerData?.etaTo) return (
    <div
      className={`${classes.property} ${classes.eta} ${
        pageType === 'product' ? classes.etaProduct : ''
      } c-muted-2 flex flex-column mb7`}
    >
      <span className={`${classes.label} mb2 c-on-base b`}>
        {intl.formatMessage({ id: 'store/company.eta-label' })}
      </span>
      {sellerData.etaFrom}
      {intl.formatMessage({ id: 'store/company.eta-days' })}
    </div>
  )

  return (
    <div
      className={`${classes.property} ${classes.eta} ${
        pageType === 'product' ? classes.etaProduct : ''
      } c-muted-2 flex flex-column mb7`}
    >
      <span className={`${classes.label} mb2 c-on-base b`}>
        {intl.formatMessage({ id: 'store/company.eta-label' })}
      </span>
      {intl.formatMessage({ id: 'store/company.eta-between' })}
      {sellerData.etaFrom}
      {intl.formatMessage({ id: 'store/company.eta-and' })}
      {sellerData.etaTo}
      {intl.formatMessage({ id: 'store/company.eta-days' })}
    </div>
  )
}

export default CompanyEta
