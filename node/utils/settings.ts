import type OnboardingSettings from '../typings/settings'

const APP_SETTINGS_PROPERTIES = [
  'preleadFormBaseURL',
  'loginNotFoundRedirectUrl',
  'sellerType',
  'adminEmail',
  'adminName',
  'htmlSellerInfoTemplate',
  'recaptcha.siteKey',
  'recaptcha.secretKey',
]

export const getSettings = async (
  ctx: Context
): Promise<OnboardingSettings> => {
  const {
    clients: { apps },
  } = ctx

  return apps.getAppSettings(ctx.vtex.userAgent)
}

interface ValidationResponse {
  hasError: boolean
  message: string
}

export const validateSettings = (settings: any): ValidationResponse => {
  if (!settings) {
    return {
      hasError: true,
      message: 'No settings found!',
    }
  }

  const missingProperty = APP_SETTINGS_PROPERTIES.find(
    (item) => !item.split('.').reduce((a, b) => a[b], settings) // We can search using dot notation, ex: "a.b.c"
  )

  if (missingProperty) {
    return {
      hasError: true,
      message: `Settings missing property: ${missingProperty}`,
    }
  }

  return { hasError: false, message: '' }
}
