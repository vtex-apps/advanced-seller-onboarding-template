import { isInvitationIdValid } from '../../utils/invitation'
import { formatError } from '../../utils/formatError'

export default async function validateInvitationById(
  ctx: Context,
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
  } = ctx

  if (!isInvitationIdValid(ctx, invitationId)) {
    return
  }

  try {
    const invitation = await invitations.get(invitationId as string, [
      'id',
      'documentLinks',
    ])

    if (!invitation) {
      ctx.body = `The invitation with the id "${invitationId}" was not found`
      ctx.status = 404

      return
    }

    ctx.state.payload = invitation.documentLinks

    await next()
  } catch (exception) {
    logger.error({
      middleware: 'VALIDATE-INVITATION-BY-ID',
      message: 'Error while validating invitation id',
      error: formatError(exception),
    })

    ctx.status = 500
  }
}
