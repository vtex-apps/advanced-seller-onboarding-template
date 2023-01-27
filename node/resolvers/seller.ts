import {SELLER_FIELDS} from "../utils/constants";
import {formatError} from "../utils/formatError";
import {getPublicInfo} from "../utils/invitation";

export const getSellerResolver = async (
  _: any,
  { id }: {id: string},
  ctx: Context
): Promise<any> => {
  const {
    clients: { invitations },
    vtex: {
      logger
    }
  } = ctx

  if (!id) {
    return { message: "You must provide seller id."}
  }

  try {

    const sellersData = await invitations.search(
      {
        page: 1,
        pageSize: 50,
      },
      SELLER_FIELDS,
      '',
      `sellerAccountName=${id}`
    )

    if (sellersData.length) {
      return getPublicInfo(sellersData[0])
    }
  } catch(e) {
    logger.error({
      middleware: 'SELLER-GRAPHQL-RESOLVER',
      message: 'Error while retrieving seller data',
      error: formatError(e),
    })
    return e.message
  }


  return { message: `Seller with id ${id} does not exist` }
}
