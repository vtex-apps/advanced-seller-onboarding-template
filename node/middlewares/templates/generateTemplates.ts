import {
  ONBOARDING_SELLER_RESPONSE,
  SELLER_EMAIL_IN_USE,
  SELLER_PRELEAD,
} from '../../utils/constants'
import { formatError } from '../../utils/formatError'
import { capitalizeWord } from '../../utils/string'
import onboardingSellerResponse from '../common/templates/onboardingSellerResponse'
import sellerEmailInUse from '../common/templates/sellerEmailInUse'
import sellerPrelead from '../common/templates/sellerPrelead'

export async function generateTemplates(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { templates },
    vtex: { logger },
  } = ctx
  try {
    await templates.create(
      ONBOARDING_SELLER_RESPONSE,
      onboardingSellerResponse,
      'Seller response'
    )
    await templates.create(
      SELLER_EMAIL_IN_USE,
      sellerEmailInUse,
      'Registering seller in the platform '+ capitalizeWord(ctx.vtex.account)
    )
    await templates.create(SELLER_PRELEAD, sellerPrelead(ctx.vtex.account), 'Seller Prelead')

    ctx.status = 204
    ctx.set('Cache-Control', 'no-store')
    await next()
  } catch (e) {
    logger.error({
      middleware: 'CREATE MAIL TEMPLATES',
      message: 'Error while creating mail templates',
      error: formatError(e),
    })

    ctx.status = 500
  }
}
