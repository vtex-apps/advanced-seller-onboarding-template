import { SELLER_FIELDS } from '../../utils/constants'
import { formatError } from '../../utils/formatError'
import { SellerInvitation } from '../../typings/invitations'
import { getSettings } from '../../utils/settings'
const Handlebars = require('handlebars')

export async function getSellerHtmlFormat(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { invitations, email: emailClient, sellerInfoConfig },
    vtex: { logger, route: {
        params: { sellerAccountName },
      }, },
    
  } = ctx

  try {
    const { htmlSellerInfoTemplate } = await getSettings(ctx)
    const getTemplateFormClient = await emailClient.getEmailTemplate(htmlSellerInfoTemplate);
    let emailTemplate = getTemplateFormClient.Templates.email.Message;
    if (!emailTemplate) {
      ctx.status = 404
      ctx.body = 'Temmplate not found'

      return
    }
    
    const sellerAccount= sellerAccountName as string;

    const sellerInfo = await getSellerInfo(sellerAccount, invitations, SELLER_FIELDS)

    let descriptionInput=''
    let exchangeReturnPolicyInput='' 
    let deliveryPolicyInput=''  
    let securityPrivacyPolicyInput=''

    try{
      const  {description, exchangeReturnPolicy, deliveryPolicy, securityPrivacyPolicy } = await sellerInfoConfig.getSellerInfoById(sellerAccount);
      descriptionInput= description
      exchangeReturnPolicyInput= exchangeReturnPolicy
      deliveryPolicyInput=deliveryPolicy
      securityPrivacyPolicyInput=securityPrivacyPolicy

    } catch(exception){
      logger.debug({
        middleware: 'GET SELLER-INFO FROM VTEX CORE',
        error: formatError(exception),
        all: exception
      })
    }

    const sellerName = handleEmptyValues(sellerInfo?.sellerInvitationVtexObject?.sellerName)
    const sellerCompanyName = handleEmptyValues(sellerInfo?.companyName)
    const sellerCUI = handleEmptyValues(sellerInfo?.vatin)
    const nrRegComert = handleEmptyValues(sellerInfo?.tradeRegistrationNumber)
    const sellerDescription = handleEmptyValues(descriptionInput)
    const sellerReturnPolicy = handleEmptyValues(exchangeReturnPolicyInput)
    const sellerDeliveryPolicy = handleEmptyValues(deliveryPolicyInput)
    const sellerSecurityPrivacyPolicy = handleEmptyValues(securityPrivacyPolicyInput)
    const sellerPhone = handleEmptyValues(sellerInfo?.phone)
    const sellerEmail = handleEmptyValues(sellerInfo?.email)
    const sellerCompanyType = handleEmptyValues(sellerInfo?.companyType)
    const sellerData = {"sellerAccount": sellerAccount, "sellerName": sellerName,
                       "sellerCompanyName": sellerCompanyName,
                       "sellerCUI": sellerCUI, "sellerNrRegComert": nrRegComert,
                       "sellerDescription": sellerDescription, "sellerReturnPolicy": sellerReturnPolicy, 
                       "sellerDeliveryPolicy": sellerDeliveryPolicy, "securityPrivacyPolicy": sellerSecurityPrivacyPolicy,
                       "sellerPhone": sellerPhone, "sellerEmail": sellerEmail, "sellerCompanyType": sellerCompanyType}

    const template = Handlebars.compile(emailTemplate);
    let result =`<h1> 404 - Seller ${sellerAccount} Not Found! </h1>`
    if(sellerInfo){
      result = template(sellerData)
    } 
  
    ctx.body = result
    ctx.status = 200
  } catch (exception) {
    logger.debug({
      middleware: 'GET SELLER-INFO EMAIL TEMPLATE',
      error: formatError(exception),
      all: exception
    })

    ctx.status = 500
    ctx.body = {
      message: 'There was an error while getting the seller-info template!',
    }
    return
  }
  await next()
}

function handleEmptyValues(value?: string){
  return value ? value : ''
}

const getSellerInfo = async (
  sellerId: string,
  invitations: any,
  fields: string[]
): Promise<SellerInvitation | undefined> => {
  const data = await invitations.search(
    {
      page: 1,
      pageSize: 50,
    },
    fields,
    '',
    `sellerAccountName=${sellerId}`
  )

  return data[0]
}
