import type { SellerInvitation } from '../../typings/invitations'
import {
  ONBOARDING_APPROVED_STATUS,
  ONBOARDING_CONNECTED_STATUS,
  PAGE_SIZE,
} from '../../utils/constants'
import { formatError } from '../../utils/formatError'
import type { SellerSchedulerSyncEvent } from '../../typings/scheduler'
import { getCommissionDataFromVbase } from '../default-commission/getCommissionData'

export async function updateSellerEvent(
  ctx: EventCtx<SellerSchedulerSyncEvent>,
  next: () => Promise<any>
) {
  const {
    vtex: { logger },
    clients: { invitations },
  } = ctx

  let page = 1
  let incompleteInvitations = []

  try {
    do {
      incompleteInvitations = await invitations.search(
        { pageSize: PAGE_SIZE, page },
        [
          'id',
          'sellerInvitationVtexObject',
          'sellerAccountName',
          'connectedSellerObject'
        ],
        '',
        `status=${ONBOARDING_APPROVED_STATUS}`
      )

      await updateSeller(ctx, incompleteInvitations)
      page++
    } while (incompleteInvitations.length > 0)

    await next()
  } catch (error) {
    logger.error({
      middleware: 'UPDATE-SELLER-EVENT',
      message: `Fatal error on page: ${page}`,
      error: formatError(error),
    })

    throw error
  }
}

export const updateSeller = async (
  ctx: EventCtx<SellerSchedulerSyncEvent>,
  incompleteInvitations: Array<SellerInvitation & { id?: string }>
) => {
  const {
    clients: { invitations, sellerPortal, paymentMethods, vbase },
    vtex: { logger },
  } = ctx

  for (const invitation of incompleteInvitations) {
    const { id, sellerInvitationVtexObject, connectedSellerObject } = invitation

    if (!sellerInvitationVtexObject?.id) {
      logger.error({
        middleware: 'UPDATE-SELLER-EVENT',
        message: `Error while processing invitation with id: ${id} that do not have sellerInvitationVtexObject.id`,
        invitation,
      })
      continue
    }

    try {
      const invitationUpdate = {}
      const { sellerAccountName, isConnected } = await sellerPortal.getLeadById(
        sellerInvitationVtexObject.id
      )

      if (sellerAccountName && !invitation.sellerAccountName) {
        Object.assign(invitationUpdate, { sellerAccountName })
      }

      if (isConnected) {
        Object.assign(invitationUpdate, { status: ONBOARDING_CONNECTED_STATUS })

        const commissionData = await getCommissionDataFromVbase(vbase)

        if (commissionData && commissionData.length) {
          await sellerPortal.updateCommissions(
            commissionData,
            sellerAccountName
          )

          logger.debug({
            middleware: 'UPDATE-SELLER-EVENT',
            message: `Update commissions`,
            sellerAccountName,
          })
        } else {
          logger.debug({
            middleware: 'UPDATE-SELLER-EVENT',
            message: `Default commissions are not set. Seller not updated`,
            sellerAccountName,
          })
        }
      }


      if (id && Object.keys(invitationUpdate).length) {
        logger.debug({
          middleware: 'UPDATE-SELLER-EVENT',
          message: `Update invitation with id ${id}`,
          invitation,
          invitationUpdate,
        })
        // todo: add MD delay
        await invitations.update(id, invitationUpdate)
        //aici update si the merchantSchema
        await paymentMethods.save({ sellerId: sellerAccountName,
                                    paymentProviderMerchantId:  connectedSellerObject?.paymentProviderMerchantId ?? ''})
      }
    } catch (e) {
      logger.error({
        middleware: 'UPDATE-SELLER-EVENT',
        message: `Error while processing invitation with id: ${id}`,
        error: formatError(e),
      })
    }
  }
}
