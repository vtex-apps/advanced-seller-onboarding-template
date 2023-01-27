import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'
import {
  ActionMenu,
  Layout,
  PageHeader,
  Tab,
  Tabs,
  ToastProvider,
  Button,
  Spinner,
  PageBlock
} from 'vtex.styleguide'
import { FormattedMessage, useIntl } from 'react-intl'

import { PreleadFormSteps, preleadValidationSchema } from './utils/invitation'
import {
  CommercialDataTab,
  CompanyDataTab,
  GeneralDataTab,
  TabsContainer,
  UploadDocumentsTab,
} from './components/tabs'
import useInvitationModule from './hooks/useInvitationModule'
import InviteResponseModal from './components/InviteResponseModal'
import useInviteResponse from './hooks/useInvitationResponse'
import { DEFAULT_UPLOAD_IMAGE } from './utils/constants'

const cssNames = [
  'boxContainer',
  'progressContainer',
  'input',
  'stepsContainer',
  'rightStep',
] as const

function EntryView({ params: { invitationId }}) {
  const handles = useCssHandles(cssNames)
  const { navigate } = useRuntime()
  const intl = useIntl()
  const invitationContext = useInvitationModule(invitationId, true)
  const {
    isLoading,
    invitation,
    update: updateInvitation,
    stepHandler: [currentTab, setCurrentTab],
  } = invitationContext

  const {
    modalData,
    setModalData,
    handleInviteResponse,
    lineActions,
  } = useInviteResponse()

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    )
  }

  const currentValidationSchema = preleadValidationSchema(intl)

  return (
    <Layout fullWidth>
      <div className="bg-muted-5 pa8">
      <TabsContainer
        invitationContext={invitationContext}
        validationSchema={currentValidationSchema[currentTab]}
        onSubmit={async (values, { setTouched }) => {
          await updateInvitation(values)

          if (currentTab !== PreleadFormSteps.TermsAndConditions) {
            // onSubmit will set touched: true for all fields
            setTouched({})
          }
        }}
      >       
        {({ handleSubmit }) => {
          const handleClick = (tab: PreleadFormSteps) => {
            setCurrentTab(tab)
            handleSubmit()
          }

          return (
            <>
              <div className="flex flex-column center mw7 mb8">
                <PageHeader
                  title={
                    <FormattedMessage id="onboarding-seller.entry.title" />
                  }
                  linkLabel={
                    <FormattedMessage id="onboarding-seller.table.title" />
                  }
                  onLinkClick={() => {
                    navigate({
                      to: `/admin/app/onboarding-seller/invitations`,
                    })
                  }}
                >
                  {invitation?.status === 'Signed' && (
                    <ActionMenu
                      label={
                        <FormattedMessage id="onboarding-seller.leadActions.title" />
                      }
                      buttonProps={{
                        variation: 'primary',
                      }}
                      options={lineActions.map((value) => ({
                        ...value,
                        label: value.label(),
                        onClick: () =>
                          value.onClick({ rowData: { id: invitationId } }),
                      }))}
                    />
                  )}

                  <div
                    className={`mt6 flex justify-between ${handles.stepsContainer}`}
                  >
                    <div className={`mr2 ${handles.rightStep}`}>
                      <Button
                        variation="primary"
                        onClick={async () => {
                          // TODO: clean
                          await handleClick(0)
                          navigate({
                            to: `/admin/app/onboarding-seller/invitations`,
                          })
                        }}
                      >
                        <FormattedMessage id="onboarding-seller.form.saveButton" />
                      </Button>
                    </div>
                  </div>
                </PageHeader>

                <div className="ph5 ph7-ns">
                <PageBlock variation="full">
                  <Tabs fullWidth>
                    <Tab
                      label={
                        <FormattedMessage id="onboarding-seller.entry.tabs.general" />
                      }
                      active={currentTab === PreleadFormSteps.GeneralData}
                      onClick={() => handleClick(PreleadFormSteps.GeneralData)}
                    >
                      <GeneralDataTab inputHandle={handles.input} />
                    </Tab>

                    <Tab
                      label={
                        <FormattedMessage id="onboarding-seller.entry.tabs.company" />
                      }
                      active={currentTab === PreleadFormSteps.CompanyData}
                      onClick={() => handleClick(PreleadFormSteps.CompanyData)}
                    >
                      <CompanyDataTab inputHandle={handles.input} />
                    </Tab>

                    <Tab
                      label={
                        <FormattedMessage id="onboarding-seller.entry.tabs.commercial" />
                      }
                      active={currentTab === PreleadFormSteps.CommercialData}
                      onClick={() =>
                        handleClick(PreleadFormSteps.CommercialData)
                      }
                    >
                      <CommercialDataTab inputHandle={handles.input} />
                    </Tab>
                    <Tab
                      label={
                        <FormattedMessage id="onboarding-seller.entry.tabs.documents" />
                      }
                      active={currentTab === PreleadFormSteps.UploadDocuments}
                      onClick={() =>
                        handleClick(PreleadFormSteps.UploadDocuments)
                      }
                    >
                      <UploadDocumentsTab imageProp={DEFAULT_UPLOAD_IMAGE}/>
                    </Tab>
                  </Tabs>
                  </PageBlock>
                </div>
              </div>

              <InviteResponseModal
                isOpen={!!modalData}
                onClose={() => setModalData(undefined)}
                onSubmit={handleInviteResponse}
                type={modalData?.type}
              />
            </>
          )
        }}      
      </TabsContainer>
      </div>
    </Layout>
  )
}

function EntryViewContainer({ params: { invitationId }}) {
  return (
    <ToastProvider positioning="window">
      <EntryView params={{ invitationId }} />
    </ToastProvider>
  )
}

export default EntryViewContainer
