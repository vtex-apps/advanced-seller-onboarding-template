import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useIntl } from 'react-intl'

import { SellerContext } from './DataProvider'

const handles = ['property', 'label', 'county']

const CompanyCounty = () => {
  const classes = useCssHandles(handles)
  const intl = useIntl()
  const { sellerData } = React.useContext(SellerContext)

  if (!sellerData?.companyCounty) return null

  return (
    <div
      className={`${classes.property} ${classes.county} c-muted-2 flex flex-column mb7`}
    >
      <span className={`${classes.label} mb2 c-on-base b`}>
        {intl.formatMessage({ id: 'store/company.county-label' })}
      </span>
      {sellerData.companyCounty}
    </div>
  )
}

export default CompanyCounty
