import { FormattedMessage, useIntl } from 'react-intl'
import React, { useContext, useState } from 'react'
import { ToastContext } from 'vtex.styleguide'
import axios from 'axios'

import type { InviteAction } from '../typings/common'
import { BASE_URL } from '../utils/constants'
import type { SellerInvitation } from '../../node/typings/invitations'

export default function useInviteResponse() {
  const intl = useIntl()
  const { showToast } = useContext(ToastContext)

  const [modalData, setModalData] = useState<InviteAction>()

  const handleInviteResponse = async (
    message: string
  ): Promise<SellerInvitation | undefined> => {
    try {
      if (!modalData?.id) {
        console.error("Can't call this function without setting modalData.id!")

        return
      }

      const { data: invite } = await axios.post(
        `${BASE_URL}/invitations/${modalData.id}`,
        {
          type: modalData.type,
          message,
        }
      )

      setModalData(undefined)

      if (modalData.type === 'resend' && invite.status === 'Connected') {
        showToast({
          message: intl.formatMessage({
            id: 'onboarding-seller.leadActions.connected',
          }),
          duration: Infinity,
        })
      } else {
        showToast({
          message: intl.formatMessage({
            id: 'onboarding-seller.leadActions.success',
          }),
          duration: Infinity,
        })
      }

      return invite
    } catch (e) {
      showToast({
        message: intl.formatMessage({
          id: 'onboarding-seller.leadActions.error',
        }),
      })

      // eslint-disable-next-line no-useless-return
      return
    }
  }

  const handleLineActionClick =
    (type: InviteAction['type']) =>
    ({ rowData }) =>
      setModalData({ id: rowData.id, type })

  return {
    modalData,
    setModalData,
    handleInviteResponse,
    lineActions: [
      {
        label: () => (
          <FormattedMessage id="onboarding-seller.table.lineActions.accept" />
        ),
        onClick: handleLineActionClick('accept'),
      },
      {
        isDangerous: true,
        label: () => (
          <FormattedMessage id="onboarding-seller.table.lineActions.softReject" />
        ),
        onClick: handleLineActionClick('soft-reject'),
      },
      {
        isDangerous: true,
        label: () => (
          <FormattedMessage id="onboarding-seller.table.lineActions.hardReject" />
        ),
        onClick: handleLineActionClick('hard-reject'),
      },
      {
        resend: true,
        label: () => (
          <FormattedMessage id="onboarding-seller.table.lineActions.resendEmail" />
        ),
        onClick: ({ rowData }) => {
          setModalData({ id: rowData.id, type: 'resend' })
        },
      },
      {
        resendPrelead: true,
        label: () => (
          <FormattedMessage id="onboarding-seller.table.lineActions.resendPreleadEmail" />
        ),
        onClick: ({ rowData }) => {
          setModalData({ id: rowData.id, type: 'resendPrelead' })
        },
      },
    ],
  }
}
