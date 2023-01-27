import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useIntl } from 'react-intl'

import { SellerContext } from './DataProvider'

const handles = ['property', 'label', 'freeShipping']

const CompanyFreeShipping = () => {
  const classes = useCssHandles(handles)
  const intl = useIntl()
  const { sellerData } = React.useContext(SellerContext)

  if (!sellerData?.freeDeliveryThreshold) return null

  return (
    <div
      className={`${classes.property} ${classes.freeShipping} c-muted-2 flex flex-column mb7`}
    >
      <span className={`${classes.label} mb2 c-on-base b`}>
        {intl.formatMessage({ id: 'store/company.free-shipping-label' })}
      </span>
      {intl.formatMessage({ id: 'store/company.over' })}
      {sellerData.freeDeliveryThreshold}
      {intl.formatMessage({ id: 'store/company.lei' })}
    </div>
  )
}

export default CompanyFreeShipping
