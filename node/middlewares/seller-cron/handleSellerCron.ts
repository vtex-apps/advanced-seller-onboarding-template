import { ONBOARDING_SELLER_CRON } from '../../utils/constants'
import type { SellerSchedulerSyncEvent } from '../../typings/scheduler'
import { formatError } from '../../utils/formatError'

export async function handleSellerCron(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store')
  const {
    clients: { events },
    vtex: { logger },
  } = ctx

  try {
    await events.sendEvent('', ONBOARDING_SELLER_CRON, {
      page: 1,
    } as SellerSchedulerSyncEvent)

    ctx.status = 204

    await next()
  } catch (e) {
    logger.error({
      middleware: 'HANDLE-SELLER-CRON',
      message: 'Error while handling cron',
      error: formatError(e),
    })

    ctx.status = 500
  }
}
