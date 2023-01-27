import {getSettings} from "./settings";
import {PAYMENT_UPDATE_FAIL_TEMPLATE, PAYMENT_UPDATE_SUCCESS_TEMPLATE, regexEmail} from "./constants";

export async function sendEmailToAdmin(ctx: Context, success: boolean) {
  const {
    clients: {email: emailClient},
    vtex: {
      userAgent
    },
  } = ctx

  const {adminEmail, adminName} = await getSettings(ctx);

  if (!regexEmail.test(adminEmail)) {
    throw new Error('[SELLER-PORTAL] Invalid Admin Email')
  }

  await emailClient.sendMail({
    TemplateName: success ? PAYMENT_UPDATE_SUCCESS_TEMPLATE : PAYMENT_UPDATE_FAIL_TEMPLATE,
    applicationName: userAgent,
    logEvidence: false,
    jsonData: {
      to: {
        name: adminName,
        email: adminEmail,
      },
    },
  })
}
