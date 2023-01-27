import React, { useEffect, useState } from 'react'
import { Modal, Button, Textarea } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import type { InviteAction } from '../typings/common'

interface RejectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (message: string) => void
  type?: InviteAction['type']
}

const enum SubmitButtonState {
  clear = 'clear',
  submitting = 'submitting',
  submitted = 'submitted',
}

function InviteResponseModal({
  isOpen,
  onClose,
  onSubmit,
  type,
}: RejectionModalProps) {
  const [message, setMessage] = useState('')
  const [buttonState, setButtonState] = useState<SubmitButtonState>(
    SubmitButtonState.clear
  )

  const getTitleByType = () => {
    switch (type) {
      case 'resend':
        return (
          <FormattedMessage id="onboarding-seller.leadActions.modal.title.resend" />
        )

      case 'resendPrelead':
        return (
          <FormattedMessage id="onboarding-seller.leadActions.modal.title.resend" />
        )

      case 'accept':
        return (
          <FormattedMessage id="onboarding-seller.leadActions.modal.title.accept" />
        )

      case 'soft-reject':
        return (
          <FormattedMessage id="onboarding-seller.leadActions.modal.title.soft-reject" />
        )

      case 'hard-reject':
        return (
          <FormattedMessage id="onboarding-seller.leadActions.modal.title.hard-reject" />
        )

      default:
        return ''
    }
  }

  const handleSubmit = async () => {
    setButtonState(SubmitButtonState.submitting)
    await onSubmit(message)
    setButtonState(SubmitButtonState.submitted)
  }

  useEffect(() => setButtonState(SubmitButtonState.clear), [isOpen])

  if (!type) {
    return <div />
  }

  const isAccept = type === 'resend' || type === 'accept' || type === 'resendPrelead'

  return (
    <Modal
      responsiveFullScreen
      isOpen={isOpen}
      title={getTitleByType()}
      onClose={onClose}
      bottomBar={
        <div className="nowrap">
          <span className="mr4">
            <Button variation="tertiary" onClick={onClose}>
              <FormattedMessage id="onboarding-seller.leadActions.cancel" />
            </Button>
          </span>

          <span>
            <Button
              variation={isAccept ? 'primary' : 'danger'}
              isLoading={buttonState === 'submitting'}
              disabled={buttonState === 'submitted'}
              onClick={handleSubmit}
            >
              {isAccept ? (
                <FormattedMessage id="onboarding-seller.leadActions.accept" />
              ) : (
                <FormattedMessage id="onboarding-seller.leadActions.reject" />
              )}
            </Button>
          </span>
        </div>
      }
    >
      {!isAccept && (
        <div className="mb5">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            label={
              <FormattedMessage id="onboarding-seller.leadActions.modal.feedback" />
            }
          />
        </div>
      )}
    </Modal>
  )
}

export default InviteResponseModal
