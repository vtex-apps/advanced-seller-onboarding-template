import React from 'react'
import type { IntlShape } from 'react-intl'
import type { AxiosResponse } from 'axios'
import * as yup from 'yup'
import { IBAN } from 'ibankit'

import {
  CommercialDataTab,
  CompanyDataTab,
  GeneralDataTab,
  UploadDocumentsTab,
  AcceptTermsAndConditionsTab,
} from '../components/tabs'
import SuccessfullySent from '../components/SuccessfullySent'
import { PreleadErrorCodes } from '../../node/typings/invitations'
import { noOfProductsOptions } from '../hooks/useProducts'
import type { UseRecaptchaData } from '../hooks/useRecaptcha'

// eslint-disable-next-line no-restricted-syntax
export enum PreleadFormSteps {
  GeneralData = 0,
  CompanyData = 1,
  CommercialData = 2,
  UploadDocuments = 3,
  TermsAndConditions = 4,
  Success = 5,
}

export const getSteps = (step: PreleadFormSteps) => {
  switch (step) {
    case PreleadFormSteps.GeneralData:
      return ['inProgress', 'toDo', 'toDo', 'toDo', 'toDo']

    case PreleadFormSteps.CompanyData:
      return ['completed', 'inProgress', 'toDo', 'toDo', 'toDo']

    case PreleadFormSteps.CommercialData:
      return ['completed', 'completed', 'inProgress', 'toDo', 'toDo']

    case PreleadFormSteps.UploadDocuments:
      return ['completed', 'completed', 'completed', 'inProgress', 'toDo']

    case PreleadFormSteps.TermsAndConditions:
      return ['completed', 'completed', 'completed', 'completed', 'inProgress']

    default:
      return [
        'completed',
        'completed',
        'completed',
        'completed',
        'completed',
        'completed',
      ]
  }
}

export const renderBasedOnSteps = (
  step: PreleadFormSteps,
  inputHandle: string,
  recaptchaRef: UseRecaptchaData['recaptchaRef'],
  imageProp: string
) => {
  switch (step) {
    case PreleadFormSteps.GeneralData:
      return <GeneralDataTab inputHandle={inputHandle} preleadForm />

    case PreleadFormSteps.CompanyData:
      return <CompanyDataTab inputHandle={inputHandle} />

    case PreleadFormSteps.CommercialData:
      return <CommercialDataTab inputHandle={inputHandle} />

    case PreleadFormSteps.UploadDocuments:
      return <UploadDocumentsTab recaptchaRef={recaptchaRef} imageProp={imageProp}/>

    case PreleadFormSteps.TermsAndConditions:
      return <AcceptTermsAndConditionsTab />

    case PreleadFormSteps.Success:
      return <SuccessfullySent />

    default:
      return <></>
  }
}

export const COMPANY_TYPE_OPTIONS = (intl: IntlShape) => [
  { value: 'SRL', label: 'SRL' },
  { value: 'SA', label: 'SA' },
  { value: 'SNC', label: 'SNC' },
  { value: 'SCS', label: 'SCS' },
  { value: 'SCA', label: 'SCA' },
  { value: 'SRL-D', label: 'SRL-D' },
  { value: 'PFA', label: 'PFA' },
  { value: 'II', label: 'II' },
  { value: 'IF', label: 'IF' },
  {
    value: 'Altul',
    label: intl.formatMessage({
      id: 'onboarding-seller.entry.company-data.companyType.other',
    }),
  },
]

export const COUNTRY_OPTIONS = [
  { value: 'ROU', label: 'Romania' },
  // { value: 'MDA', label: 'Moldova' },
]

export const handlePreleadApiErrors = (
  response: AxiosResponse | undefined,
  intl: IntlShape,
  showToast
): { [key: string]: boolean } | undefined => {
  if (response?.status === 400 && response?.data?.errorCode) {
    const {
      data: { errorCode },
    } = response

    switch (errorCode) {
      case PreleadErrorCodes.UNDEFINED_VALUES:
        showToast({
          message: intl.formatMessage({
            id: `onboarding-seller.form.errors.errorCodes.undefinedValues`,
          }),
        })

        return

      case PreleadErrorCodes.INVALID_EMAIL:
        showToast({
          message: intl.formatMessage({
            id: `onboarding-seller.form.errors.email.invalid`,
          }),
        })

        return

      case PreleadErrorCodes.INVALID_PHONE:
        return { phone: true }

      default:
        break
    }
  }

  if (response?.status === 403) {
    showToast({
      message: intl.formatMessage({
        id: 'onboarding-seller.form.errors.recaptcha',
      }),
      duration: Infinity,
    })

    return
  }

  showToast({
    message: intl.formatMessage({
      id: 'onboarding-seller.form.errors.submit',
    }),
    duration: Infinity,
  })

  // es-lint rule conflict from the base vtex package
  // eslint-disable-next-line no-useless-return
  return
}

export const preleadValidationSchema = (intl: IntlShape) => {
  const requiredMessage = intl.formatMessage({
    id: 'onboarding-seller.prelead-form.validations.required',
  })

  const hasAgreedToPrivacyMessage = intl.formatMessage({
    id: 'onboarding-seller.prelead-form.privacy.mandatory',
  })

  const getMinValueMessage = (min: number) =>
    intl.formatMessage(
      {
        id: 'onboarding-seller.entry.errors.min',
      },
      {
        min,
      }
    )

  return {
    [PreleadFormSteps.GeneralData]: yup.object({
      email: yup.string().required(requiredMessage),
      companyName: yup.string().required(requiredMessage),
      firstName: yup.string().required(requiredMessage),
      lastName: yup.string().required(requiredMessage),
      jobTitle: yup.string(),
      phone: yup.string().required(requiredMessage),
      companyDescription: yup.string(),
      website: yup.string(),
      connectedSellerObject: yup.object({
        paymentProviderMerchantId: yup.string(),
      }),
    }),
    [PreleadFormSteps.CompanyData]: yup.object({
      companyType: yup.string(),
      isPayingVat: yup.boolean(),
      tradeRegistrationNumber: yup.string(),
      companyPostalCode: yup.string().required(requiredMessage),
      companyCounty: yup.string().required(requiredMessage),
      companyCity: yup.string().required(requiredMessage),
      companyStreet: yup.string().required(requiredMessage),
      companyStreetNumber: yup.string().required(requiredMessage),
      companyAddressComplement: yup.string().required(requiredMessage),
      companyBank: yup.string().required(requiredMessage),
      companyCountry: yup.string().required(requiredMessage),
      vatin: yup.string().required(requiredMessage),
      iban: yup
        .string()
        .required(requiredMessage)
        .test(
          'test-iban',
          intl.formatMessage({
            id: 'onboarding-seller.prelead-form.validations.iban',
          }),
          (value = '') => IBAN.isValid(value)
        ),
    }),
    [PreleadFormSteps.CommercialData]: yup.object({
      noOfProducts: yup.mixed().oneOf(noOfProductsOptions.map((e) => e.value)),
      productsCategories: yup.array().of(yup.string()),
      connectedSellerObject: yup.object({
        etaFrom: yup
          .number()
          .min(1, getMinValueMessage(1))
          .required(requiredMessage),
        etaTo: yup.number().min(0, getMinValueMessage(0)),
        returnPeriod: yup.number().min(0, getMinValueMessage(0)),
      }),
      ecommercePlatform: yup.string(),
      connectedMarketplaces: yup.array().of(yup.string()),
      referral: yup.string(),
    }),
    [PreleadFormSteps.UploadDocuments]: yup.object({
      documentLinks: yup
        .array()
        .of(
          yup.object({
            fileLink: yup.string(),
            fileName: yup.string(),
          })
        )
        .min(
          1,
          intl.formatMessage({
            id: 'onboarding-seller.entry.documents.errors.min',
          })
        ),
    }),
    [PreleadFormSteps.TermsAndConditions]: yup.object({
      hasAgreedToPrivacyPolicy: yup
        .boolean()
        .required(hasAgreedToPrivacyMessage) // false will pass this, as it is a valid boolean value
        .oneOf([true], hasAgreedToPrivacyMessage),
    }),
  }
}
