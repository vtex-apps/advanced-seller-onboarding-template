import React from 'react'
import { Link } from 'vtex.render-runtime'
import { useProduct } from 'vtex.product-context'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from 'react-intl'
import { searchSlugify } from '@vtex/slugify'

const handles = ['linkSellerContainer', 'linkSellerText', 'linkSeller'] as const

const SellerLink = () => {
  const { selectedItem } = useProduct() ?? {}

  const classes = useCssHandles(handles)

  const seller = selectedItem?.sellers[0]

  if (!selectedItem || !seller) {
    return null
  }

  return (
    <div className={`${classes.linkSellerContainer} flex`}>
      <span className={`${classes.linkSellerText} pr2`}>
        <FormattedMessage id="store/seller-link.soldBy" />
      </span>
      <Link
        className={classes.linkSeller}
        to={`/seller/${seller.sellerId}-${searchSlugify(seller.sellerName)}`}
      >
        {seller.sellerName}
      </Link>
    </div>
  )
}

export default SellerLink
