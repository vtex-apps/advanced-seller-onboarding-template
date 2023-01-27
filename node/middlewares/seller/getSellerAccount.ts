import {SELLER_FIELDS} from '../../utils/constants'
import {formatError} from '../../utils/formatError'
import {getPublicInfo} from "../../utils/invitation";


export async function getSellerAccount(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { invitations },
    vtex: {
      logger,
      route: {
        params: { sellerAccountName },
      },
    },
  } = ctx

  try {
    const seller = await invitations.search(
      {
        page: 1,
        pageSize: 50,
      },
      SELLER_FIELDS,
      '',
      `sellerAccountName=${sellerAccountName}`
    )
    if (!seller.length) {
      ctx.status = 404
      ctx.body = 'Seller not found'

      return
    }

    ctx.body = seller.map(getPublicInfo)
    ctx.status = 200
  } catch (exception) {
    logger.debug({
      middleware: 'GET SELLER ACCOUNT',
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
