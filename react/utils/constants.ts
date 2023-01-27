import type {
  ConnectedMarketplaces,
  EcommercePlatform,
  OnboardingStatus,
  ProductsCategories,
} from '../../node/typings/invitations'

export const BASE_URL = '/_v/onboarding-seller'
export const DOCUMENTS_BASE_URL = (invitationId: string) =>
  `${BASE_URL}/invitations/${invitationId}/documents`
export const SELLER_TERMS_AND_CONDITIONS = '/seller-terms-and-conditions'
export const VTEX_TERMS = '/vtex-terms'
export const DEFAULT_UPLOAD_IMAGE = '../utils/assets/file-upload.png'
export const DEFAULT_COMMISSION_URL = `${BASE_URL}/default-commission`

/** Table view */

export const DEFAULT_PAGE_SIZE = 10
export const STATUS_COLORS: Record<OnboardingStatus, string> = {
  Signed: '#979899',
  Prelead: '#93c4f6',
  Lead: '#5cacfc',
  Approved: '#8bc34a',
  Rejected: '#ffb100',
  Connected: '#913CC1',
}

/** Entry view */

export const PRODUCT_CATEGORIES: ProductsCategories = [
  'books',
  'foreignBooks',
  'toys',
  'children',
  'perfumery',
  'beauty',
  'watches',
  'electronics',
  'homeDeco',
  'fashion',
  'nutritionAndSupplements',
]

export const ECOMMERCE_PLATFORMS: EcommercePlatform[] = [
  'OpenCart',
  'PrestaShop',
  'WooCommerce',
  'Magento',
  'Shopify',
  'nothing',
]

export const MARKETPLACES: ConnectedMarketplaces = [
  'eMAG',
  'Okazii',
  'TeamDeals',
  'CEL',
  'Vivre',
  'Amazon',
  'eBay',
]
