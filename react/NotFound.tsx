import React from 'react'
import { Layout } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from 'react-intl'

const cssNames = ['notFoundContainer'] as const

function NotFound() {
  const handles = useCssHandles(cssNames)

  return (
    <Layout fullWidth>
      <div className={`${handles.notFoundContainer} flex justify-center`}>
        <h1>
          <FormattedMessage id="onboarding-seller.prelead-form.page.notFound" />
        </h1>
      </div>
    </Layout>
  )
}

export default NotFound
