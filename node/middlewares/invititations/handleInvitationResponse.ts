import type { HandleInvitationPayload } from '../../typings/invitations'
import { formatError } from '../../utils/formatError'
import { getSettings } from '../../utils/settings'
import { isInvitationIdValid } from '../../utils/invitation'
import {
  INVITATION_FIELDS_TO_RETURN,
  LEAD_RESPONSE_TEMPLATE,
  PRELEAD_TEMPLATE,
  SALES_CHANNEL,
  SELLER_COUNTRY,
} from '../../utils/constants'

export async function handleInvitationResponse(
  ctx: Context<HandleInvitationPayload>,
  next: () => Promise<any>
) {
  const {
    clients: { invitations, email: emailClient, sellerPortal },
    vtex: {
      logger,
      userAgent,
      route: {
        params: { invitationId },
      },
    },
    state: { payload },
  } = ctx

  if (!isInvitationIdValid(ctx, invitationId)) {
    return
  }

  try {
    logger.debug({
      middleware: 'HANDLE-INVITATION-RESPONSE',
      message: 'Received request',
      payload,
      invitationId,
    })

    const settings = await getSettings(ctx)
    const { type, message } = payload

    const invitation = await invitations.get(invitationId, ['_all'])

    const canUpdate =
      (invitation.status === 'Prelead' && type === 'resendPrelead') ||
      invitation.status === 'Signed' ||
      (invitation.status === 'Approved' && type === 'resend')

    if (!canUpdate) {
      ctx.status = 403
      ctx.body = "Invitation must be in status 'Signed' to be handled"

      return
    }

    if (!invitation.email || !invitation.companyName) {
      // if the invitation is in status 'Signed' these fields should be set

      ctx.status = 500
      ctx.body = 'Invitation missing fields'

      return
    }

    switch (type) {
      case 'resend': {
        const idLead = invitation?.sellerInvitationVtexObject?.id

        if (!idLead) {
          ctx.status = 500
          ctx.body = 'No lead id found!'

          return
        }

        try {
          await sellerPortal.resendLeadInvite({
            id: idLead,
            // api sends invitation only for status invited even if in the documentation is mentioned that it should send also for accepted or connected
            // sellers that need resend of confiramtion email are in staus Invited in seller portal
            status: 'Invited',
          })
        } catch (exception) {
          if (exception.response.status === 409) {
            const inviteData = await sellerPortal.getLeadById(idLead)

            logger.debug({
              inviteData: inviteData
            })

            if (inviteData.status === 'Connected') {
              await invitations.update(invitationId, {
                status: inviteData.status,
              })
            }
          } else {
            logger.error({
              middleware: 'HANDLE-INVITATION-RESPONSE',
              message: 'Error while resending lead invite',
              error: formatError(exception),
            })

            ctx.status = 500

            return
          }
        }

        break
      }

      case 'resendPrelead': {
        try {
          await emailClient.sendMail({
            TemplateName: PRELEAD_TEMPLATE,
            applicationName: userAgent,
            logEvidence: false,
            jsonData: {
              to: {
                name: invitation.companyName,
                email: invitation.email,
              },
              formURL: `${settings.preleadFormBaseURL}/${invitationId}`,
            },
          })
        } catch (exception) {
          ctx.status = 500

          return
        }

        break
      }

      case 'accept': {
        const { id, sellerEmail, sellerName, createdAt } =
          await sellerPortal.inviteLead({
            sellerName: invitation.companyName,
            sellerEmail: invitation.email,
            // saleChannel is the culture and can be 1 for ROU and 2 if MD is selected as country
            salesChannel: SALES_CHANNEL,
            email: invitation.email,
            sellerType: settings.sellerType === 'Regular' ? 1 : 2,
            accountId: ctx.vtex.account,
            document: invitation.vatin,
            accountable: {
              name: `${invitation.firstName} ${invitation.lastName}`,
              email: invitation.email,
              phone: invitation.phone,
            },
            address: {
              // country must be 3 letters - ISO 3166-1 alpha-3
              // country can only be ROU and the country field is used only for culture (sales channel)
              country: SELLER_COUNTRY,
              postalcode: invitation.companyPostalCode,
              complement: invitation.companyAddressComplement,
              street: invitation.companyStreet,
              neighborhood: invitation.companyNeighborhood,
              state: invitation.companyCounty,
              city: invitation.companyCity,
              number: invitation.companyStreetNumber,
            },
            hasAcceptedLegalTerms: true, // tODO: get from Frontend?
          })

        await invitations.update(invitationId, {
          status: 'Approved',
          sellerInvitationVtexObject: {
            id,
            sellerEmail,
            sellerName,
            createdAt,
          },
        })

        break
      }

      case 'soft-reject': {
        await emailClient.sendMail({
          TemplateName: LEAD_RESPONSE_TEMPLATE,
          applicationName: userAgent,
          logEvidence: false,
          jsonData: {
            to: {
              name: invitation.companyName,
              email: invitation.email,
            },
            message,
            isSoft: true,
            formURL: `${settings.preleadFormBaseURL}/${invitationId}`,
          },
        })

        await invitations.update(invitationId, {
          status: 'Lead',
          hasAgreedToPrivacyPolicy: false,
          hasAgreedToVtexPolicy: false,
        })

        break
      }

      case 'hard-reject': {
        await emailClient.sendMail({
          TemplateName: LEAD_RESPONSE_TEMPLATE,
          applicationName: userAgent,
          logEvidence: false,
          jsonData: {
            to: {
              name: invitation.companyName,
              email: invitation.email,
            },
            message,
            isSoft: false,
          },
        })

        await invitations.update(invitationId, 
          { status: 'Rejected'   })

        break
      }

      default:
        ctx.status = 400
        ctx.message = 'Unsupported type'

        return
    }

    ctx.status = 200
    ctx.body = await invitations.get(invitationId, INVITATION_FIELDS_TO_RETURN)

    await next()
  } catch (e) {
    logger.error({
      middleware: 'HANDLE-INVITATION-RESPONSE',
      message: 'Error while handling invitation response',
      error: formatError(e),
    })

    ctx.status = 500
  }
}
