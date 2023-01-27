import type { OnboardingStatus } from '../typings/invitations'

const SECOND = 1000

export const MINUTE = 60 * SECOND
export const ENV_TYPE = 'stable'
export const ONBOARDING_DATA_ENTITY = 'vtexromania_advanced_seller_onboarding_invitations'
export const ONBOARDING_PAYMENT_METHODS_DATA_ENTITY = 'vtexromania_advanced_seller_onboarding_paymentMethods'
export const SCHEMA_NAME = 'main'

export const SALES_CHANNEL = '1'

export const INVITATION_FIELDS_TO_RETURN = [
  'id',
  'sellerAccountName',
  'sellerInvitationVtexObject',
  'connectedSellerObject',
  'status',
  'documentLinks',
  'email',
  'companyName',
  'lastName',
  'firstName',
  'jobTitle',
  'phone',
  'companyDescription',
  'website',
  'companyType',
  'isPayingVat',
  'vatin',
  'tradeRegistrationNumber',
  'companyCounty',
  'companyCity',
  'companyCountry',
  'companyPostalCode',
  'companyStreet',
  'companyStreetNumber',
  'companyNeighborhood',
  'companyAddressComplement',
  'companyBank',
  'iban',
  'noOfProducts',
  'eta',
  'productsCategories',
  'ecommercePlatform',
  'connectedMarketplaces',
  'referral',
  'hasAgreedToPrivacyPolicy',
  'createdIn',
  'lastInteractionIn',
  'hasAgreedToVtexPolicy',
  'sellerCreatedIn',
  'sellerLastInteractionIn'
]

export const SELLER_FIELDS = [
  'sellerAccountName',
  'email',
  'sellerInvitationVtexObject',
  'connectedSellerObject',
  'companyName',
  'lastName',
  'firstName',
  'jobTitle',
  'phone',
  'companyDescription',
  'iban',
  'website',
  'companyType',
  'isPayingVat',
  'vatin',
  'tradeRegistrationNumber',
  'companyCounty',
  'companyCity',
  'companyAddress',
  'companyBank',
  'noOfProducts',
  'eta',
  'productsCategories',
  'ecommercePlatform',
  'connectedMarketplaces',
  'status',
  'documentLinks',
  'referral',
  'hasAgreedToPrivacyPolicy',
]

export const regexEmail =
  /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i // eslint-disable-line

export const CRON = {
  id: '8c141ad3-9a51-47e9-ade5-1cef87b93755',
  url: (host: string) => `https://${host}/_v/onboarding-seller/cron`,
  expression: '*/5 * * * *', // run cron every 5 minutes
}

export const ONBOARDING_APPROVED_STATUS: OnboardingStatus = 'Approved'
export const ONBOARDING_CONNECTED_STATUS: OnboardingStatus = 'Connected'

export const ONBOARDING_SELLER_CRON = 'onboardingSeller.cron'
export const SELLER_EMAIL_IN_USE = 'seller-email-in-use'
export const ONBOARDING_SELLER_RESPONSE = 'onboarding-seller-response'
export const SELLER_PRELEAD = 'seller-prelead'
export const SELLER_COUNTRY = 'ROU'

export const PAGE_SIZE = 50

export const PRELEAD_TEMPLATE = 'seller-prelead'
export const EMAIL_IN_USE_TEMPLATE = 'seller-email-in-use'
export const LEAD_RESPONSE_TEMPLATE = 'onboarding-seller-response'
export const STATUSES: OnboardingStatus[] = [
  'Prelead',
  'Lead',
  'Signed',
  'Rejected',
  'Approved',
  'Connected',
]

export const VBASE_BUCKETS = {
  defaultCommission: {
    bucket: 'def-comm',
    path: 'commissions-file',
  },
}
