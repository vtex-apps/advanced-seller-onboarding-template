import type { OnboardingStatus } from '../../typings/invitations'
import type Clients from '../../clients'
import { formatError } from '../../utils/formatError'
import { STATUSES } from '../../utils/constants'
import { Logger } from '@vtex/api'
import { TotalizersReponse } from '../../typings/totalizers'

const getInvitationsByStatus = async (
  invitationsClient: Clients['invitations'],
  status: OnboardingStatus,
  logger: Logger
) => {

  try {
    const {
      pagination: { total },
    } = await invitationsClient.searchRaw(
      {
        pageSize: 1,
        page: 1,
      },
      ['id'],
      '',
      `status=${status}`
    )

    return total
  } catch (e) {
    logger.error(formatError(e))
    return 0
  }
}

export async function getTotalizers(ctx: Context, next: () => Promise<TotalizersReponse[]>) {
  const {
    vtex: { logger },
    clients: { invitations },
  } = ctx

  const totalizers = await Promise.all(STATUSES.map(async (status) => ({
    label: status,
    value: await getInvitationsByStatus(invitations, status, logger)
  }
  )))

  ctx.status = 200
  ctx.body = totalizers

  await next()
}
