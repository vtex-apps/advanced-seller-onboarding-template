import { INVITATION_FIELDS_TO_RETURN } from '../../utils/constants'
import { formatError } from '../../utils/formatError'

export async function getInvitations(ctx: Context, next: () => Promise<any>) {
  ctx.response.set('Cache-Control', 'no-store')

  const {
    vtex: { logger },
    clients: { invitations },
    query = {},
  } = ctx

  try {
    const { page = '1', pageSize = '10', where = '', keyword = '' } = query
    let filter: string

    if (keyword) {
      const keywordClause = `lastName="*${keyword}*" OR firstName="*${keyword}*" OR email="*${keyword}*" OR companyName="*${keyword}*" OR sellerAccountName="*${keyword}*"`

      if (where) {
        filter = `(${where}) AND (${keywordClause})`
      } else {
        filter = keywordClause
      }
    } else {
      filter = where as string
    }

    ctx.status = 200
    ctx.body = await invitations.searchRaw(
      {
        page: parseInt(page as string, 10),
        pageSize: parseInt(pageSize as string, 10),
      },
      INVITATION_FIELDS_TO_RETURN,
      'lastInteractionIn DESC',
      filter
    )
  } catch (e) {
    logger.error(formatError(e))
    // custom status to be ignored in UI for cannot find some field
    if (e.response.status === 400 && e.response.data.Message.match(/Field .* not found/)) {
      ctx.status = 512
    } else {
      ctx.status = 500
    }

  }

  await next()
}
