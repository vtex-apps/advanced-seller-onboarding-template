import { Modal } from 'vtex.styleguide'
import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { IconEyeSight } from 'vtex.store-icons'

import { FormikCheckbox } from '../formik/FormikCheckbox'
import { useInvitationContext } from '../../hooks/useInvitationModule'
import { useRuntime } from 'vtex.render-runtime'
import { capitalizeWord } from '../../utils/string'
import useAppSettings from '../../hooks/useAppSettings'

const cssNames = [
  'termsContainer',
  'tabTitle',
  'termsSectionModalTrigger',
  'termsSectionModalTriggerIcon',
  'termsSectionModalTitle',
  'termsSectionTitle',
  'termsSectionMessage',
  'termsCheckboxContainer',
  'commissionsTable',
] as const

function AcceptTermsAndConditionsTab() {
  const handles = useCssHandles(cssNames)
  const { isReadOnly } = useInvitationContext()
  const [openedModal, setOpenedModal] = useState<number | null>(null)
  const intl = useIntl()
  const runtimeContext = useRuntime()
  const { account } = runtimeContext;
  const upperCaseAccount = capitalizeWord(account)
  const appSettings = useAppSettings();

  return (
    <div className={`flex mt6 mb6 flex-column ${handles.termsContainer}`}>
      <h3 className={handles.tabTitle}>
        <FormattedMessage id="onboarding-seller.prelead-form.privacy.title" />
      </h3>

      {appSettings?.termsAndConditionsPages?.map((section, index) => (
        <div
          key={index}
          className={`pv3 b bb b--silver hover-c-on-action-secondary flex justify-between ${handles.termsSectionTitle}`}
          style={{ cursor: 'pointer' }}
          onClick={() => setOpenedModal(index)}
        >
          {section.pageName}
          <span
            className={`c-action-primary ${handles.termsSectionModalTriggerIcon}`}
          >
            <IconEyeSight type="filled" state="on" />
          </span>
        </div>
      ))}

      <Modal
        isOpen={openedModal !== null}
        onClose={() => setOpenedModal(null)}
        centered
        responsiveFullScreen
        title={
          openedModal !== null ? (
            <span className={`db tc b ${handles.termsSectionModalTitle}`}>
              {appSettings?.termsAndConditionsPages[openedModal].pageName}
            </span>
          ) : (
            ''
          )
        }
        style={{innerHeight:"100%"}}
      >
        {openedModal !== null ? (
          <iframe src={appSettings?.termsAndConditionsPages[openedModal].pageURL} style={{width:"100%", minHeight: "800px", backgroundColor: "none transparent", border: 'none'}}/>
        ) : (
          ''
        )}
      </Modal>

      <div className={`mt6 center ${handles.termsCheckboxContainer}`}>
        <FormikCheckbox
          id="hasAgreedToPrivacyPolicy"
          disabled={isReadOnly}
          label={
            intl.formatMessage({id: "onboarding-seller.prelead-form.privacy.label"}, {marketplaceName: upperCaseAccount})
          }
        />
      </div>
    </div>
  )
}

export default AcceptTermsAndConditionsTab
