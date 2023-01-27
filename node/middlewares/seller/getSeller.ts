import { SELLER_FIELDS } from '../../utils/constants'
import { getSellerByAccountName } from '../../utils/seller'
import { formatError } from '../../utils/formatError'

export async function getSeller(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { invitations },
    vtex: { logger },
  } = ctx

  try {
    const seller = await getSellerByAccountName(ctx, invitations, SELLER_FIELDS)

    if (!seller) {
      ctx.status = 404
      ctx.body = 'Seller not found'

      return
    }

    ctx.body = seller
    ctx.status = 200
  } catch (exception) {
    logger.debug({
      middleware: 'GET SELLER',
      error: formatError(exception),
    })

    ctx.status = 500
    ctx.body = {
      message: 'There was an error while getting the seller!',
    }

    return
  }

  await next()
}
