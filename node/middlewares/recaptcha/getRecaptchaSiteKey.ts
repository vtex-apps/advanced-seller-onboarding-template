import { formatError } from '../../utils/formatError'
import { getSettings } from '../../utils/settings'

export default async function getRecaptchaSiteKey(
  ctx: Context,
  next: () => Promise<any>
) {
  try {
    const settings = await getSettings(ctx)

    ctx.status = 200
    ctx.body = settings.recaptcha.siteKey

    await next()
  } catch (e) {
    ctx.status = 500

    ctx.vtex.logger.error(formatError(e))
  }
}
