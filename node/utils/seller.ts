import type { SellerInvitation } from '../typings/invitations'

export const getSellerByAccountName = async (
  ctx: Context,
  invitations: any,
  fields: string[]
): Promise<SellerInvitation | undefined> => {
  const accountId = ctx.request.header['x-vtex-origin-account']

  const data = await invitations.search(
    {
      page: 1,
      pageSize: 50,
    },
    fields,
    '',
    `sellerAccountName=${accountId}`
  )

  return data[0]
}
