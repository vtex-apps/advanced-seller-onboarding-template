import { getSettings } from '../../utils/settings'
import type { PreleadPayload } from '../../typings/invitations'
import { formatError } from '../../utils/formatError'
import { EMAIL_IN_USE_TEMPLATE, PRELEAD_TEMPLATE, regexEmail } from '../../utils/constants'
import { PreleadErrorCodes } from '../../typings/invitations'

export async function postPrelead(
  ctx: Context<PreleadPayload>,
  next: () => Promise<any>
) {
  const {
    clients: { invitations, email: emailClient },
    vtex: { logger, userAgent },
    state: { payload },
  } = ctx

  try {
    logger.debug({
      middleware: 'POST PRELEAD',
      message: 'Received request',
      payload,
    })

    const { email, phone, companyName } = payload
    const settings = await getSettings(ctx)

    if (!email || !phone || !companyName) {
      ctx.status = 400

      ctx.body = { errorCode: PreleadErrorCodes.UNDEFINED_VALUES }

      return
    }

    if (!regexEmail.test(email)) {
      ctx.status = 400

      ctx.body = { errorCode: PreleadErrorCodes.INVALID_EMAIL }

      return
    }

    const invitationsWithSameEmail = await invitations.search(
      { page: 1, pageSize: 10 },
      ['id', 'status'],
      'lastInteractionIn DESC',
      `email=${email}`
    )

    if (invitationsWithSameEmail.length) {
      // do not leak if an email is registered, it would expose the endpoint to an account enumeration attack!
      // Only notify the client through email
      ctx.status = 201

      const [invitation] = invitationsWithSameEmail

      await emailClient.sendMail({
        TemplateName: EMAIL_IN_USE_TEMPLATE,
        applicationName: userAgent,
        logEvidence: false,
        jsonData: {
          to: {
            name: companyName,
            email,
          },
          rejected: invitation.status !== 'Prelead',
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          formURL: `${settings.preleadFormBaseURL}/${invitation.id}`,
        },
      })

      return
    }

    logger.debug({
      middleware: 'POST PRELEAD',
      message: 'Creating invitation MD entry',
      payload,
    })

    const { DocumentId: invitationId } = await invitations.save({
      email,
      phone,
      companyName,
      status: 'Prelead',
    })

    logger.debug({
      middleware: 'POST PRELEAD',
      message: 'Created invitation MD entry. Sending email...',
      payload,
    })

    await emailClient.sendMail({
      TemplateName: PRELEAD_TEMPLATE,
      applicationName: userAgent,
      logEvidence: false,
      jsonData: {
        to: {
          name: companyName,
          email,
        },
        formURL: `${settings.preleadFormBaseURL}/${invitationId}`,
      },
    })

    logger.debug({
      middleware: 'POST PRELEAD',
      message: 'Mail sent!',
      payload,
    })

    ctx.status = 201

    await next()
  } catch (e) {
    logger.error({
      middleware: 'POST PRELEAD',
      message: 'Error',
      error: formatError(e),
    })

    ctx.status = 500
  }
}
