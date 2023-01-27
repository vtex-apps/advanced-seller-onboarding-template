import React, { useContext, useEffect } from 'react'
import { ToastProvider, Progress, Spinner, ToastContext } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { useIntl } from 'react-intl'
import { Form } from 'formik'
import { NoSSR } from 'vtex.render-runtime'
import ReCAPTCHA from 'react-google-recaptcha'
import { validate as uuidValidate } from 'uuid'

import NotFound from './NotFound'
import useInvitationModule from './hooks/useInvitationModule'
import {
  getSteps,
  PreleadFormSteps,
  preleadValidationSchema,
  renderBasedOnSteps,
} from './utils/invitation'
import { StepButtons } from './components/StepButtons'
import FooterButton from './components/FooterButton'
import ProgressLabels from './components/ProgressLabels'
import { TabsContainer } from './components/tabs'
import useRecaptcha from './hooks/useRecaptcha'

import './styles/vtexromania.advanced-seller-onboarding.css'

const cssNames = [
  'boxContainer',
  'formContainer',
  'formTitle',
  'formSubtitle',
  'progressContainer',
  'input',
] as const

interface FormProps {
  guideLink: string,
  params : { invitationId: string},
  imageProp: string
}

function PreleadForm(props: FormProps) {
  const handles = useCssHandles(cssNames)
  const { showToast } = useContext(ToastContext)
  const intl = useIntl()

  const invitationContext = useInvitationModule(props.params.invitationId)
  const {
    isLoading,
    isReadOnly,
    invitation,
    update: updateInvitation,
    stepHandler: [step, setStep],
  } = invitationContext

  const { siteKey, recaptchaRef } = useRecaptcha()

  const currentValidationSchema = preleadValidationSchema(intl)

  useEffect(() => {
    async function updateInviteStatus() {
      try {
        const recaptchaToken = await recaptchaRef.current.executeAsync()

        updateInvitation({ status: 'Lead' }, recaptchaToken)
      } catch (e) {
        console.error(e)

        showToast({
          message: intl.formatMessage({
            id: 'onboarding-seller.prelead-form.errors.generic',
          }),
          duration: Infinity,
        })
      }
    }

    if (!recaptchaRef.current) {
      console.warn('Recaptcha not loaded for status update!')

      return
    }

    if (invitation?.status === 'Prelead') {
      updateInviteStatus()
    }
  }, [intl, invitation?.status, updateInvitation, showToast, recaptchaRef])

  const handleSubmit = async (values, { setTouched }) => {
    if (!recaptchaRef.current) {
      showToast({
        message: intl.formatMessage({
          id: 'onboarding-seller.form.errors.recaptcha',
        }),
        duration: Infinity,
      })

      return
    }

    if (!isReadOnly) {
      if (step !== PreleadFormSteps.TermsAndConditions) {
        // onSubmit will set touched: true for all fields
        setTouched({})
      } else if (
        invitation?.status === 'Prelead' ||
        invitation?.status === 'Lead'
      ) {
        values.status = 'Signed'
      }

      try {
        const recaptchaToken = await recaptchaRef.current.executeAsync()

        await recaptchaRef.current.reset()

        await updateInvitation(values, recaptchaToken)

        setStep(step + 1)
      } catch (e) {
        console.error(e)

        showToast({
          message: intl.formatMessage({
            id: 'onboarding-seller.prelead-form.errors.submit.generic',
          }),
          duration: Infinity,
        })

        await recaptchaRef.current.reset()
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    )
  }

  if (!invitation) {
    return <NotFound />
  }

  return (
    <NoSSR onSSR={<Spinner />}>
      {!!siteKey && (
        <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={siteKey} />
      )}

      <TabsContainer
        invitationContext={invitationContext}
        validationSchema={currentValidationSchema[step]}
        onSubmit={handleSubmit}
      >
        {step !== PreleadFormSteps.Success ? (
          <Form className={handles.boxContainer}>
            <div className={handles.formContainer}>
              <h2 className={handles.formSubtitle}>
                {intl.formatMessage({
                  id: 'onboarding-seller.prelead-form.boxSubtitle',
                })}
              </h2>

              <h1 className={`c-action-primary ${handles.formTitle}`}>
                {intl.formatMessage({
                  id: 'onboarding-seller.prelead-form.boxTitle',
                })}
              </h1>

              <ProgressLabels steps={getSteps(step)} />

              <div className={handles.progressContainer}>
                <Progress type="steps" slim steps={getSteps(step)} />
              </div>

              <StepButtons />

              {renderBasedOnSteps(step, handles.input, recaptchaRef, props.imageProp)}

              <FooterButton guideLink={props.guideLink}/>
            </div>
          </Form>
        ) : (
          <div className={handles.boxContainer}>
            <div className={handles.formContainer}>
              {renderBasedOnSteps(step, handles.input, recaptchaRef, props.imageProp)}

              <FooterButton guideLink={props.guideLink}/>
            </div>
          </div>
        )}
      </TabsContainer>
    </NoSSR>
  )
}

function PreleadFormContainer(props: FormProps) {
  const isIdValid = uuidValidate(props.params.invitationId)

  return isIdValid ? (
    <ToastProvider positioning="window">
      <PreleadForm {...props} />
    </ToastProvider>
  ) : (
    <NotFound />
  )
}

PreleadFormContainer.schema = {
  title: 'Prelead-Form References',
  description: 'Description',
  type: 'object',
  properties: {
    guideLink: {
      title: 'Guide link',
      description: 'Write the complet Link to the marketplace guide Ex: https://www.google.com',
      type: 'string',
      default: null,
    }
  },
}

export default PreleadFormContainer
