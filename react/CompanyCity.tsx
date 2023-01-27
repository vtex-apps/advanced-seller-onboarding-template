import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useIntl } from 'react-intl'

import { SellerContext } from './DataProvider'

const handles = ['property', 'label', 'city']

const CompanyCity = () => {
  const classes = useCssHandles(handles)
  const intl = useIntl()
  const { sellerData } = React.useContext(SellerContext)

  if (!sellerData?.companyCity) return null

  return (
    <div
      className={`${classes.property} ${classes.city} c-muted-2 flex flex-column mb7`}
    >
      <span className={`${classes.label} mb2 c-on-base b`}>
        {intl.formatMessage({ id: 'store/company.city-label' })}
      </span>
      {sellerData.companyCity}
    </div>
  )
}

export default CompanyCity
