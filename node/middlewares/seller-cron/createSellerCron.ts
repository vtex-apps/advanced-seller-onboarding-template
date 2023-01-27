import { formatError } from '../../utils/formatError'
import { SchedulerRequestMethods } from '../../typings/scheduler'
import { CRON } from '../../utils/constants'
import { getSettings } from '../../utils/settings'

export async function createSellerCron(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { scheduler },
    vtex: { logger },
  } = ctx

  try {
    const settings = await getSettings(ctx)

    await scheduler.createOrUpdateScheduler({
      cronId: CRON.id,
      cronExpression: CRON.expression,
      request: {
        body: { token: settings.cronToken },
        uri: CRON.url(ctx.host),
        method: SchedulerRequestMethods.PATCH,
      },
    })

    ctx.status = 201
    ctx.body = 'Cron created'

    await next()
  } catch (e) {
    logger.error({
      middleware: 'CREATE SELLER ACCOUNT NAME CRON',
      message: 'Error while creating cron',
      error: formatError(e),
    })

    ctx.status = 500
  }
}
