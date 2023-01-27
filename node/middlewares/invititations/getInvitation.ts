import { INVITATION_FIELDS_TO_RETURN } from '../../utils/constants'
import { formatError } from '../../utils/formatError'
import { isInvitationIdValid } from '../../utils/invitation'
import { isAdmin } from '../../utils/validators'

export async function getInvitation(ctx: Context, next: () => Promise<any>) {
  const {
    vtex: {
      logger,
      route: {
        params: { invitationId },
      },
    },
    clients: { invitations },
  } = ctx

  if (!isInvitationIdValid(ctx, invitationId)) {
    return
  }

  try {
    const invitation = await invitations.get(
      invitationId as string,
      INVITATION_FIELDS_TO_RETURN
    )

    const hasAdminPermissions = await isAdmin(ctx)

    if (
      invitation &&
      (invitation.status === 'Prelead' ||
        invitation.status === 'Lead' ||
        hasAdminPermissions)
    ) {
      ctx.status = 200
      ctx.body = invitation
    } else {
      ctx.status = 404
    }

    ctx.set('Cache-Control', 'no-store')

    await next()
  } catch (exception) {
    logger.error({
      middleware: 'GET-INVITATION',
      message: 'Error while getting invitation',
      error: formatError(exception),
    })

    ctx.status = 500
  }
}
