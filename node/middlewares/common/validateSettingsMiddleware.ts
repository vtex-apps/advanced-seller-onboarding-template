import { getSettings, validateSettings } from '../../utils/settings'

export default async function validateSettingsMiddleware(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    vtex: { logger },
  } = ctx

  const settings = await getSettings(ctx)

  const validationResponse = validateSettings(settings)

  if (validationResponse.hasError) {
    logger.error({
      middleware: 'VALIDATE-SETTINGS',
      message: 'Invalid settings!',
      error: validationResponse.message,
    })

    ctx.status = 500
    ctx.body = 'Internal error. Invalid settings!'

    return
  }

  await next()
}
