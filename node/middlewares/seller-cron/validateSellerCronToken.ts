import { json } from 'co-body'

import { formatError } from '../../utils/formatError'
import { getSettings } from '../../utils/settings'

interface SchedulerBody {
  token: string
}

export async function validateSellerCronToken(
  ctx: Context,
  next: () => Promise<any>
) {
  try {
    const { token }: SchedulerBody = await json(ctx.req)
    const settings = await getSettings(ctx)

    if (!settings?.cronToken || token !== settings.cronToken) {
      ctx.status = 401

      return
    }

    await next()
  } catch (e) {
    ctx.vtex.logger.error({
      middleware: 'VALIDATE-SELLER-CRON-TOKEN',
      message: 'Error while validating token',
      error: formatError(e),
    })

    ctx.status = 500
  }
}
