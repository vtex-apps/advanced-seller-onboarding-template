import { IBAN } from 'ibankit'
import { json } from 'co-body'

import type { SellerInvitation } from '../../typings/invitations'
import { formatError } from '../../utils/formatError'
import { getSellerByAccountName } from '../../utils/seller'

export async function updateSeller(ctx: Context, next: () => Promise<any>) {
  const {
    vtex: { logger },
    clients: { invitations },
  } = ctx

  const payload: SellerInvitation = await json(ctx.req)

  try {
    const seller = await getSellerByAccountName(ctx, invitations, ['id'])

    if (!seller) {
      ctx.status = 404
      ctx.body = 'Seller not found'

      return
    }

    if (
      payload.sellerInvitationVtexObject?.id !==
        seller.sellerInvitationVtexObject?.id ||
      payload.sellerAccountName !== seller.sellerAccountName
    ) {
      ctx.status = 400
      ctx.body = 'Seller id and sellerAccountName can not be modified'

      return
    }

    if (payload.iban && !IBAN.isValid(payload.iban)) {
      ctx.status = 400
      ctx.body = 'Invalid IBAN'

      return
    }

    await invitations.update(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore .id is not on the generated type
      seller.id,
      payload
    )

    ctx.status = 201
  } catch (exception) {
    logger.error({
      message: 'Error while updating seller',
      middleware: 'UPDATE-SELLER',
      error: formatError(exception),
    })

    ctx.status = 500

    return
  }

  await next()
}
