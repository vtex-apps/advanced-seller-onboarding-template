import { getSettings } from '../../utils/settings'
import { formatError } from '../../utils/formatError'

export default async function isWhitelistedIp(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    vtex: { logger },
  } = ctx

  try {
    const { ipWhitelist } = await getSettings(ctx)

    // allow any request when no ip is in list
    if (ipWhitelist?.length && !ipWhitelist.includes(ctx.ip)) {
      ctx.status = 401
      ctx.body = `Ip ${ctx.ip} is not allowed to access this resource`

      return
    }

    await next()
  } catch (e) {
    logger.error({
      middleware: 'IS-WHITELISTED-IP',
      message: 'Error while checking ip',
      error: formatError(e),
    })

    ctx.status = 500
  }
}
