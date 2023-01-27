import { INVITATION_FIELDS_TO_RETURN } from '../../utils/constants'
import { formatError } from '../../utils/formatError'
import { isInvitationIdValid } from '../../utils/invitation'

export default async function handleConnectSeller(
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
    clients: { invitations, sellerPortal },
  } = ctx

  if (!isInvitationIdValid(ctx, invitationId)) {
    return
  }

  try {
    const invitation = await invitations.get(
      invitationId as string,
      INVITATION_FIELDS_TO_RETURN
    )

    if (invitation?.status !== 'Approved') {
      ctx.status = 404
      ctx.body = 'Seller needs to be Approved'
    }

    if (!invitation?.sellerInvitationVtexObject?.id) {
      ctx.status = 500
      ctx.body = "Couldn't find the sellerInvitationVtexObject id"

      return
    }

    await sellerPortal.connectSeller({
      id: invitation.sellerInvitationVtexObject.id,
      isActive: true,
      status: "Accepted"
    })

    ctx.status = 200
    ctx.body = 'Seller connection requested'

    ctx.set('Cache-Control', 'no-store')

    await next()
  } catch (exception) {
    logger.error({
      middleware: 'CONNECT-SELLER',
      message: 'Error while connecting the seller',
      error: formatError(exception),
    })

    ctx.status = 500
  }
}
