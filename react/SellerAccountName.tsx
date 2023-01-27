import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Spinner } from 'vtex.styleguide'

import { SellerContext } from './DataProvider'

const handles = ['sellerName']

const SellerAccountName = () => {
  const classes = useCssHandles(handles)
  const { sellerData, loading } = React.useContext(SellerContext)

  if (loading) return <Spinner />
  if (!sellerData?.sellerName) return null

  return (
    <h1 className={`${classes.sellerName} c-on-base`}>
      {sellerData.sellerName}
    </h1>
  )
}

export default SellerAccountName
