import React from 'react'
import { Formik } from 'formik'
import type { ReactNode } from 'react'
import type { FormikProps, FormikHelpers, FormikValues } from 'formik'

import type { SellerInvitation } from '../../../node/typings/invitations'
import type { InvitationContext } from '../../hooks/useInvitationModule'
import { InvitationProvider } from '../../hooks/useInvitationModule'
import { COUNTRY_OPTIONS } from '../../utils/invitation'

const DEFAULT_POSTAL_CODE = '123456'

interface TabsContainerProps {
  invitationContext: InvitationContext
  validationSchema: any
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>
  children: ReactNode | ((props: FormikProps<any>) => ReactNode)
}

function TabsContainer({
  invitationContext,
  validationSchema,
  onSubmit,
  children,
}: TabsContainerProps) {
  const { invitation } = invitationContext

  return (
    <Formik
      initialValues={{
        email: invitation?.email ?? '',
        companyName: invitation?.companyName ?? '',
        firstName: invitation?.firstName ?? '',
        lastName: invitation?.lastName ?? '',
        jobTitle: invitation?.jobTitle ?? '',
        phone: invitation?.phone ?? '',
        companyDescription: invitation?.companyDescription ?? '',
        website: invitation?.website ?? '',
        companyType: invitation?.companyType ?? '',
        isPayingVat: invitation?.isPayingVat?.toString() ?? '',
        vatin: invitation?.vatin ?? '',
        tradeRegistrationNumber: invitation?.tradeRegistrationNumber ?? '',
        companyCountry:
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          (invitation?.companyCountry || COUNTRY_OPTIONS[0].value) ?? '',
        companyPostalCode:
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          (invitation?.companyPostalCode || DEFAULT_POSTAL_CODE) ?? '',
        companyCounty: invitation?.companyCounty ?? '',
        companyCity: invitation?.companyCity ?? '',
        companyStreet: invitation?.companyStreet ?? '',
        companyStreetNumber: invitation?.companyStreetNumber ?? '',
        companyAddressComplement: invitation?.companyAddressComplement ?? '',
        companyBank: invitation?.companyBank ?? '',
        iban: invitation?.iban ?? '',
        connectedSellerObject: {
          paymentProviderMerchantId:
            invitation?.connectedSellerObject?.paymentProviderMerchantId ?? '',
          etaFrom: invitation?.connectedSellerObject?.etaFrom?.toString() ?? '',
          etaTo: invitation?.connectedSellerObject?.etaTo?.toString() ?? '',
          returnPeriod:
            invitation?.connectedSellerObject?.returnPeriod?.toString() ?? '',
        },
        noOfProducts: invitation?.noOfProducts?.toString() ?? '',
        ecommercePlatform: invitation?.ecommercePlatform ?? '',
        referral: invitation?.referral ?? '',
        productsCategories: invitation?.productsCategories ?? [],
        connectedMarketplaces: invitation?.connectedMarketplaces ?? [],
        hasAgreedToPrivacyPolicy: invitation?.hasAgreedToPrivacyPolicy ?? false,
        documentLinks: invitation?.documentLinks ?? [],
      }}
      validationSchema={
        invitationContext.isReadOnly ? undefined : validationSchema
      }
      onSubmit={(values, formikHelpers) =>
        onSubmit(mapToSellerInvite(values), formikHelpers)
      }
    >
      {(formikBag) => (
        <InvitationProvider value={invitationContext}>
          {typeof children === 'function' ? children(formikBag) : children}
        </InvitationProvider>
      )}
    </Formik>
  )
}

function mapToSellerInvite(values: FormikValues): Partial<SellerInvitation> {
  return {
    ...values,
    isPayingVat:
      values.isPayingVat !== undefined
        ? values.isPayingVat === 'true'
        : undefined,
    noOfProducts: values.noOfProducts
      ? parseInt(values.noOfProducts, 10)
      : undefined,
    connectedSellerObject: {
      ...values.connectedSellerObject,
      etaFrom: values.connectedSellerObject?.etaFrom
        ? parseInt(values.connectedSellerObject?.etaFrom, 10)
        : undefined,
      etaTo: values.connectedSellerObject?.etaTo
        ? parseInt(values.connectedSellerObject?.etaTo, 10)
        : undefined,
      returnPeriod: values.connectedSellerObject?.returnPeriod
        ? parseInt(values.connectedSellerObject?.returnPeriod, 10)
        : undefined,
    },
  }
}

export default TabsContainer
