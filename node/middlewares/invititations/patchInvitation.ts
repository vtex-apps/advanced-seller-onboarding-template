import { IBAN } from 'ibankit'

import type { SellerInvitation } from '../../typings/invitations'
import { formatError } from '../../utils/formatError'
import { isAdmin } from '../../utils/validators'
import { PatchErrorCodes } from '../../typings/invitations'

export async function patchInvitation(
  ctx: Context<SellerInvitation>,
  next: () => Promise<any>
) {
  const {
    vtex: {
      logger,
      route: {
        params: { invitationId },
      },
    },
    clients: { invitations },
    state: { payload },
  } = ctx

  try {
    const { status } = await invitations.get(invitationId as string, ['status'])

    const hasAdminPermissions = await isAdmin(ctx)

    if (!hasAdminPermissions && status !== 'Prelead' && status !== 'Lead') {
      ctx.status = 409
      ctx.body = {
        error: "Can't update a submitted invitation",
        errorCode: PatchErrorCodes.INVALID_STATUS,
      }

      return
    }

    if (payload.iban && !IBAN.isValid(payload.iban)) {
      ctx.status = 400
      ctx.body = {
        error: 'Invalid IBAN',
        errorCode: PatchErrorCodes.INVALID_IBAN,
      }

      return
    }

    if (!payload.companyNeighborhood) {
      payload.companyNeighborhood = 'default'
    }

    await invitations.update(invitationId as string, payload)

    ctx.status = 201
    ctx.body = payload

    await next()
  } catch (exception) {
    logger.error({
      middleware: 'PATCH-INVITATION',
      message: 'Error while updating invitation',
      data: { invitationId },
      error: formatError(exception),
    })

    ctx.status = 500
  }
}
