import { formatError } from '../../utils/formatError'
import { getSettings } from '../../utils/settings'

export async function loginSeller(
  ctx: Context<{ email: string }>,
  next: () => Promise<any>
) {
  const {
    clients: { invitations },
    vtex: { logger },
    state: {
      payload: { email },
    },
  } = ctx

  try {
    const [seller] = await invitations.search(
      {
        page: 1,
        pageSize: 50,
      },
      ['_all'],
      '',
      `email=${email}`,
    )

    ctx.status = 200

    if (!seller?.sellerAccountName) {
      const settings = await getSettings(ctx)

      ctx.body = { url: settings.loginNotFoundRedirectUrl }

      return
    }

    ctx.body = { url: `https://${seller.sellerAccountName}.myvtex.com/_v/segment/admin-login/v1/login?returnUrl=%2Fadmin%3F&email=${email}` }

    await next()
  } catch (exception) {
    logger.debug({
      middleware: 'SELLER-LOGIN',
      message: 'Error while login seller',
      error: formatError(exception),
    })

    ctx.status = 500
  }
}
