import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useIntl } from 'react-intl'

import { SellerContext } from './DataProvider'

const handles = ['property', 'label', 'shippingCost']

const CompanyShippingCost = () => {
  const classes = useCssHandles(handles)
  const intl = useIntl()
  const { sellerData } = React.useContext(SellerContext)

  if (!sellerData?.shippingCharge) return null

  return (
    <div
      className={`${classes.property} ${classes.shippingCost} c-muted-2 flex flex-column mb7`}
    >
      <span className={`${classes.label} mb2 c-on-base b`}>
        {intl.formatMessage({ id: 'store/company.shipping-label' })}
      </span>
      {sellerData.shippingCharge}
      {intl.formatMessage({ id: 'store/company.lei' })}
    </div>
  )
}

export default CompanyShippingCost
