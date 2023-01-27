import React from 'react'
import { Button } from 'vtex.styleguide'
import { PhoneContext, rules } from 'vtex.phone-field'
import type { PhoneRuleDescriptor } from 'vtex.phone-field/react/rules'
import { FormattedMessage, useIntl } from 'react-intl'
import { Form, Formik } from 'formik'
import * as yup from 'yup'

import type { InviteFormState } from './typings/InviteForm'
import { FormikInput } from './components/formik'
import { FormikPhoneField } from './components/formik/FormikPhoneField'

const countryRules: PhoneRuleDescriptor[] = [
  ...rules,
  {
    countryCode: '40',
    countryISO: 'ROU',
    mask: '(999) 999 999',
    pattern: '',
  },
  {
    countryCode: '373',
    countryISO: 'MDA',
    mask: '(999) 99 99 99 99',
    pattern: '',
  },
  {
    countryCode: '7',
    countryISO: 'RUS',
    mask: '9 999 999 99 99',
    pattern: '',
  },
]

export interface InviteFormProps {
  onSubmit: (
    data: Pick<InviteFormState, 'email' | 'companyName' | 'phone'>
  ) => Promise<{ [key: string]: boolean } | undefined>
}

function InviteForm({ onSubmit }: InviteFormProps) {
  const intl = useIntl()

  return (
    <Formik
      initialValues={{
        email: '',
        companyName: '',
        phone: '',
      }}
      validationSchema={yup.object({
        email: yup.string().email().required(),
        companyName: yup.string().required(),
        phone: yup.string().required(),
      })}
      onSubmit={async (values, { setFieldError }) => {
        const errors = await onSubmit(values)

        /*
        the validation library doesn't work on the frontend
        so we must catch the backend error
        */
        if (errors?.phone) {
          setFieldError(
            'phone',
            intl.formatMessage({
              id: 'onboarding-seller.form.errors.phone.invalid',
            })
          )
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <FormikInput
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            label={
              <FormattedMessage id="onboarding-seller.entry.general-data.email" />
            }
          />

          <div className="mb5">
            <PhoneContext.PhoneContextProvider rules={countryRules}>
              <FormikPhoneField
                id="phone"
                autoComplete="tel-national"
                defaultCountry="ROU"
                label={
                  <FormattedMessage id="onboarding-seller.entry.general-data.phone" />
                }
              />
            </PhoneContext.PhoneContextProvider>
          </div>

          <FormikInput
            id="companyName"
            autoComplete="organization"
            label={
              <FormattedMessage id="onboarding-seller.entry.general-data.companyName" />
            }
          />

          <Button variation="primary" type="submit" isLoading={isSubmitting}>
            <FormattedMessage id="onboarding-seller.form.submitButton" />
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export default InviteForm
