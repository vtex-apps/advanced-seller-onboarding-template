import React, { useContext } from 'react'
import { Layout, PageBlock, PageHeader, ToastContext } from 'vtex.styleguide'
import { FormattedMessage, useIntl } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import axios from 'axios'

import type { InviteFormProps } from './InviteForm'
import InviteForm from './InviteForm'
import { BASE_URL } from './utils/constants'
import { handlePreleadApiErrors } from './utils/invitation'
import withToastProvider from './components/withToastProvider'

function InviteFormContainerAdmin() {
  const { navigate } = useRuntime()

  const { showToast } = useContext(ToastContext)
  const intl = useIntl()

  const handleSubmit: InviteFormProps['onSubmit'] = async (data) => {
    try {
      await axios.post(`${BASE_URL}/invitations`, data)

      showToast({
        message: intl.formatMessage({
          id: 'onboarding-seller.form.submitMessage',
        }),
        duration: Infinity,
      })

      // We return a promise so we can keep the loader running
      return new Promise((resolve) =>
        setTimeout(() => {
          resolve(undefined)

          navigate({
            to: `/admin/app/onboarding-seller/invitations`,
          })
        }, 1500)
      )
    } catch (e) {
      console.error(e)

      return handlePreleadApiErrors(e.response, intl, showToast)
    }
  }

  return (
    <Layout
      pageHeader={
        <PageHeader
          title={<FormattedMessage id="onboarding-seller.form.title" />}
          linkLabel={<FormattedMessage id="onboarding-seller.table.title" />}
          onLinkClick={() =>
            navigate({
              to: `/admin/app/onboarding-seller/invitations`,
            })
          }
        />
      }
    >
      <PageBlock variation="full">
        <InviteForm onSubmit={handleSubmit} />
      </PageBlock>
    </Layout>
  )
}

export default withToastProvider(InviteFormContainerAdmin)
