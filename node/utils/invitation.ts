import type {PublicSellerInvitationInfo, SellerInvitation} from '../typings/invitations'

export const isInvitationIdValid = (
  ctx: Context,
  invitationId: unknown
): invitationId is string => {
  if (!invitationId) {
    // this should never happen
    ctx.status = 400
    ctx.body = 'Invitation id is required!'

    return false
  }

  if (typeof invitationId !== 'string') {
    ctx.status = 500
    ctx.body = 'Invalid id type'

    return false
  }

  return true
}

export const validateInvitationStatus = async (
  ctx: Context,
  invitationId: string
) => {
  const {
    clients: { invitations },
  } = ctx

  const existingInvitation: SellerInvitation = await invitations.get(
    invitationId,
    ['status']
  )
  
  if (
    existingInvitation.status !== 'Lead' &&
    existingInvitation.status !== 'Prelead' &&
    existingInvitation.status !== 'Signed'
  ) {
    throw new Error(
      'Cannot update an invitation that is not in the Prealead or Lead status.'
    )
  }
}

export const computeWhereClauseForVatIn = (vatIn: string) => `(vatin=${vatIn} OR vatin=RO${vatIn} OR vatin=${vatIn.replace("RO", '')})`;

export const getPublicInfo = (seller: SellerInvitation): PublicSellerInvitationInfo => ({
  sellerAccountName: seller.sellerAccountName,
  companyName: seller.companyName,
  companyDescription: seller.companyDescription,
  companyCounty: seller.companyCounty,
  companyCity: seller.companyCity,
  companyAddress: seller.companyAddressComplement,
  tradeRegistrationNumber: seller.tradeRegistrationNumber,
  vatin: seller.vatin,
  iban: seller.iban,
  companyBank: seller.companyBank,
  phone: seller.phone,
  email: seller?.sellerInvitationVtexObject?.sellerEmail,
  sellerName: seller?.sellerInvitationVtexObject?.sellerName,
  etaFrom: seller?.connectedSellerObject?.etaFrom,
  etaTo: seller?.connectedSellerObject?.etaTo,
  returnPeriod: seller?.connectedSellerObject?.returnPeriod,
  shippingCharge: seller?.connectedSellerObject?.shippingCharge,
  freeDeliveryThreshold: seller?.connectedSellerObject?.freeDeliveryThreshold,
});
