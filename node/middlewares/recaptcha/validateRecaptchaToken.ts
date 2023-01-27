import { formatError } from '../../utils/formatError'
import { getSettings } from '../../utils/settings'
import { isAdminAuthenticated } from '../common'

export default async function validateRecaptchaToken(
  ctx: Context<any>,
  next: () => Promise<any>
) {
  const {
    clients: { recaptcha },
    vtex: { logger },
    query: { recaptchaToken = '' },
  } = ctx

  if (!recaptchaToken) {
    await isAdminAuthenticated(ctx, next)

    if (ctx.status === 401) {
      ctx.status = 403
      ctx.body = 'Missing Recaptcha'
    }

    return
  }

  try {
    const settings = await getSettings(ctx)

    const isValid = await recaptcha.verify(
      recaptchaToken as string,
      settings.recaptcha.secretKey
    )

    if (!isValid) {
      ctx.status = 403
      ctx.body = 'Invalid Recaptcha'

      return
    }

    await next()
  } catch (e) {
    logger.error({
      middleware: 'VALIDATE-RECAPTCHA-TOKEN',
      message: 'Error while validating recaptcha token',
      error: formatError(e),
    })

    ctx.status = 500
    ctx.body = 'Recaptcha error'
  }
}
