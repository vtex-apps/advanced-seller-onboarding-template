import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

import { SellerContext } from './DataProvider'

const handles = ['description']

const CompanyDescription = () => {
  const classes = useCssHandles(handles)
  const { sellerData } = React.useContext(SellerContext)

  if (!sellerData?.companyDescription) return null

  return (
    <div className={`${classes.description} c-muted-2`}>
      {sellerData.companyDescription}
    </div>
  )
}

export default CompanyDescription
