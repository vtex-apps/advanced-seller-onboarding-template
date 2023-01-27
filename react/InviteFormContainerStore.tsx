import React, { useContext } from 'react'
import { Spinner, ToastContext } from 'vtex.styleguide'
import { NoSSR } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage, useIntl } from 'react-intl'
import ReCAPTCHA from 'react-google-recaptcha'
import axios from 'axios'

import type { InviteFormProps } from './InviteForm'
import InviteForm from './InviteForm'
import { BASE_URL } from './utils/constants'
import { handlePreleadApiErrors } from './utils/invitation'
import withToastProvider from './components/withToastProvider'
import useRecaptcha from './hooks/useRecaptcha'

const CSS_HANDLES = ['container', 'title', 'form'] as const

function InviteFormContainerStore({ title }) {
  const handles = useCssHandles(CSS_HANDLES)

  const { showToast } = useContext(ToastContext)
  const intl = useIntl()

  const { siteKey, recaptchaRef } = useRecaptcha()

  const handleSubmit: InviteFormProps['onSubmit'] = async (data) => {
    try {
      if (!recaptchaRef.current) {
        showToast({
          message: intl.formatMessage({
            id: 'onboarding-seller.form.errors.recaptcha',
          }),
          duration: Infinity,
        })

        return
      }

      const recaptchaToken = await recaptchaRef.current.executeAsync()

      await axios.post(
        `${BASE_URL}/invitations`,
        data,
        { params: { recaptchaToken } },
      )

      showToast({
        message: intl.formatMessage({
          id: 'onboarding-seller.form.submitMessage',
        }),
        duration: Infinity,
      })

      return
    } catch (e) {
      console.error(e)

      await recaptchaRef.current.reset()

      return handlePreleadApiErrors(e.response, intl, showToast)
    }
  }

  const formTitle = title ?? (
    <FormattedMessage id="onboarding-seller.form.title" />
  )

  return (
    <div className={handles.container}>
      <span className={handles.title}>{formTitle}</span>

      <div className={handles.form}>
        <NoSSR onSSR={<Spinner />}>
          {!!siteKey && (
            <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={siteKey} />
          )}

          <InviteForm onSubmit={handleSubmit} />
        </NoSSR>
      </div>
    </div>
  )
}

InviteFormContainerStore.schema = {
  title: 'editor.sellerInviteForm.title',
  description: 'editor.sellerInviteForm.description',
  type: 'object',
  properties: {
    title: {
      title: 'Form title',
      type: 'string',
      default: null,
    },
  },
}

export default withToastProvider(InviteFormContainerStore)
