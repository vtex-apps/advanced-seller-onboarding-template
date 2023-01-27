import { useIntl } from 'react-intl'

import type {
  ConnectedMarketplaces,
  EcommercePlatform,
  ProductsCategories,
} from '../../node/typings/invitations'
import {
  ECOMMERCE_PLATFORMS,
  MARKETPLACES,
  PRODUCT_CATEGORIES,
} from '../utils/constants'

export function useProductCategories(
  productsCategories: ProductsCategories | undefined
) {
  const intl = useIntl()

  const other =
    productsCategories?.filter((e) => !PRODUCT_CATEGORIES.includes(e)) ?? []

  // I tried to map over PRODUCT_CATEGORIES to build the return object
  // But there is a vtex bug and it doesn't register them
  return [
    // ...PRODUCT_CATEGORIES.map((category) => ({
    //   label: intl.formatMessage({
    //     id: `onboarding-seller.product-categories.${category}`,
    //   }),
    //   value: category,
    //   isChecked: productsCategories?.includes(category) ?? false,
    // })),
    {
      label: intl.formatMessage({
        id: 'onboarding-seller.product-categories.books',
      }),
      value: 'books',
      isChecked: productsCategories?.includes('books') ?? false,
    },
    {
      label: intl.formatMessage({
        id: 'onboarding-seller.product-categories.foreignBooks',
      }),
      value: 'foreignBooks',
      isChecked: productsCategories?.includes('foreignBooks') ?? false,
    },
    {
      label: intl.formatMessage({
        id: 'onboarding-seller.product-categories.toys',
      }),
      value: 'toys',
      isChecked: productsCategories?.includes('toys') ?? false,
    },
    {
      label: intl.formatMessage({
        id: 'onboarding-seller.product-categories.children',
      }),
      value: 'children',
      isChecked: productsCategories?.includes('children') ?? false,
    },
    {
      label: intl.formatMessage({
        id: 'onboarding-seller.product-categories.perfumery',
      }),
      value: 'perfumery',
      isChecked: productsCategories?.includes('perfumery') ?? false,
    },
    {
      label: intl.formatMessage({
        id: 'onboarding-seller.product-categories.beauty',
      }),
      value: 'beauty',
      isChecked: productsCategories?.includes('beauty') ?? false,
    },
    {
      label: intl.formatMessage({
        id: 'onboarding-seller.product-categories.watches',
      }),
      value: 'watches',
      isChecked: productsCategories?.includes('watches') ?? false,
    },
    {
      label: intl.formatMessage({
        id: 'onboarding-seller.product-categories.electronics',
      }),
      value: 'electronics',
      isChecked: productsCategories?.includes('electronics') ?? false,
    },
    {
      label: intl.formatMessage({
        id: 'onboarding-seller.product-categories.homeDeco',
      }),
      value: 'homeDeco',
      isChecked: productsCategories?.includes('homeDeco') ?? false,
    },
    {
      label: intl.formatMessage({
        id: 'onboarding-seller.product-categories.fashion',
      }),
      value: 'fashion',
      isChecked: productsCategories?.includes('fashion') ?? false,
    },
    {
      label: intl.formatMessage({
        id: 'onboarding-seller.product-categories.nutritionAndSupplements',
      }),
      value: 'nutritionAndSupplements',
      isChecked:
        productsCategories?.includes('nutritionAndSupplements') ?? false,
    },
    {
      label: `${intl.formatMessage({
        id: 'onboarding-seller.product-categories.other',
        defaultMessage: 'Other',
      })}: ${other.join(', ')}`,
      value: 'other',
      isChecked: !!other.length,
    },
  ]
}

export function useEcommercePlatforms(ecommercePlatform?: EcommercePlatform) {
  const intl = useIntl()

  const hasOther = ecommercePlatform
    ? !ECOMMERCE_PLATFORMS.includes(ecommercePlatform)
    : false

  return [
    // ...ECOMMERCE_PLATFORMS.map((platform) => ({
    //   label: intl.formatMessage({
    //     id: `onboarding-seller.ecommerce-platforms.${platform}`,
    //     defaultMessage: platform,
    //   }),
    //   value: platform,
    // })),
    {
      label: intl.formatMessage({
        id: 'onboarding-seller.ecommerce-platforms.OpenCart',
        defaultMessage: 'OpenCart',
      }),
      value: 'OpenCart',
    },
    {
      label: intl.formatMessage({
        id: 'onboarding-seller.ecommerce-platforms.PrestaShop',
        defaultMessage: 'PrestaShop',
      }),
      value: 'PrestaShop',
    },
    {
      label: intl.formatMessage({
        id: 'onboarding-seller.ecommerce-platforms.WooCommerce',
        defaultMessage: 'WooCommerce',
      }),
      value: 'WooCommerce',
    },
    {
      label: intl.formatMessage({
        id: 'onboarding-seller.ecommerce-platforms.Magento',
        defaultMessage: 'Magento',
      }),
      value: 'Magento',
    },
    {
      label: intl.formatMessage({
        id: 'onboarding-seller.ecommerce-platforms.Shopify',
        defaultMessage: 'Shopify',
      }),
      value: 'Shopify',
    },
    {
      label: intl.formatMessage({
        id: 'onboarding-seller.ecommerce-platforms.nothing',
        defaultMessage: 'nothing',
      }),
      value: 'nothing',
    },
    {
      label: `${intl.formatMessage({
        id: 'onboarding-seller.ecommerce-platforms.other',
      })}${hasOther ? `: ${ecommercePlatform}` : ''}`,
      value: 'other',
    },
  ]
}

export function useMarketplaces(
  connectedMarketplaces: ConnectedMarketplaces | undefined
) {
  const intl = useIntl()

  const other =
    connectedMarketplaces?.filter((e) => !MARKETPLACES.includes(e)) ?? []

  return [
    ...MARKETPLACES.map((marketplace) => ({
      label: marketplace,
      value: marketplace,
      isChecked: connectedMarketplaces?.includes(marketplace) ?? false,
    })),
    { 
      label: `${intl.formatMessage({
        id: 'onboarding-seller.other',
        defaultMessage: 'Other',
      })}: ${other.join(', ')}`,
      value: 'other',
      isChecked: !!other.length,
    } ,
  ]
}

export const noOfProductsOptions = [
  { value: '0', label: '0-50' },
  { value: '51', label: '51-200' },
  { value: '201', label: '201-1000' },
]
