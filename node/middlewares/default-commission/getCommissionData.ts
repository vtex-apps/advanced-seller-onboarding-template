import type { VBase } from '@vtex/api'

import { formatError } from '../../utils/formatError'
import { VBASE_BUCKETS } from '../../utils/constants'
import type { Commission } from '../../typings/commission'

export const getCommissionDataFromVbase = async (
  vbase: VBase
): Promise<Commission[]> => {
  let message: Commission[] = []

  try {
    message = await vbase.getJSON<Commission[]>(
      VBASE_BUCKETS.defaultCommission.bucket,
      VBASE_BUCKETS.defaultCommission.path
    )
  } catch (e) {
    if (e.response.status !== 404) throw e
  }

  return message
}

async function getCommissionData(ctx: Context): Promise<any> {
  const {
    clients: { vbase },
    vtex: { logger },
  } = ctx

  try {
    logger.debug({
      middleware: 'DEFAULT-COMMISSION',
      message: 'Received request',
    })

    const message = await getCommissionDataFromVbase(vbase)

    ctx.set('Cache-Control', 'no-store')
    ctx.set('Content-Type', 'application/json')

    ctx.status = 200
    ctx.body = message
  } catch (exception) {
    logger.error({
      middleware: 'DEFAULT-COMMISSION',
      message: 'Error while retrieving default commission data',
      error: formatError(exception),
      stackTrace: exception,
    })

    ctx.status = 500
    ctx.body = formatError(exception)
  }
}

export default getCommissionData
