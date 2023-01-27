import React, { useState, useEffect, createContext } from 'react'
import { useProduct } from 'vtex.product-context'
import { useQuery } from 'react-apollo'

import GET_SELLER from './graphql/getSeller.gql'

type ContextType = {
  sellerData?: SellerData
  pageType?: string
  loading?: boolean
}

type SellerData = {
  companyAddress: string
  companyBank: string
  companyCity: string
  companyCounty: string
  companyDescription: string
  companyName: string
  email: string
  etaFrom: number
  etaTo: number
  freeDeliveryThreshold: string
  iban: string
  phone: string
  returnPeriod: number
  sellerAccountName: string
  sellerName: string
  shippingCharge: number
  tradeRegistrationNumber: string
  vatin: string
}

export const SellerContext = createContext<ContextType>({})

const DataProvider = ({ children }) => {
  const { selectedItem } = useProduct() ?? {}
  const [sellerData, setSellerData] = useState<SellerData>()

  const sellerId = selectedItem
    ? selectedItem?.sellers[0].sellerId
    : window.location?.pathname.split('/')[2].split('-')[0]

  const { data, loading } = useQuery(GET_SELLER, {
    variables: { id: sellerId },
    ssr: false,
  })

  const pageType = selectedItem ? 'product' : 'seller'

  useEffect(() => {
    if (!loading && data) setSellerData(data.getSeller)
  }, [data, loading])

  if (!sellerData && !loading) return null

  return (
    <SellerContext.Provider value={{ sellerData, loading, pageType }}>
      {children}
    </SellerContext.Provider>
  )
}

export default DataProvider
