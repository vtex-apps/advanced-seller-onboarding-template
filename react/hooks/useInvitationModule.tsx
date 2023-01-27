import React, { createContext, useCallback, useEffect, useState } from 'react'
import axios from 'axios'

import type { SellerInvitation } from '../../node/typings/invitations'
import { BASE_URL } from '../utils/constants'
import { PreleadFormSteps } from '../utils/invitation'

export interface InvitationContext {
  invitationId: string
  isReadOnly: boolean
  isLoading: boolean
  invitation: SellerInvitation | undefined
  update: (
    partialInvitation: Partial<SellerInvitation>,
    recaptchaToken?: string
  ) => void
  stepHandler: [PreleadFormSteps, React.Dispatch<React.SetStateAction<number>>]
}

const invitationContext = createContext<InvitationContext>(undefined as any)

export const InvitationProvider = invitationContext.Provider
export const InvitationConsumer = invitationContext.Consumer

function useInvitationModule(
  invitationId: string,
  isAdmin = false
): InvitationContext {
  const [isLoading, setIsLoading] = useState(true)
  const stepHandler = useState(PreleadFormSteps.GeneralData)

  const [invitation, setInvitation] = useState<SellerInvitation | undefined>()
  const [isReadOnly, setIsReadOnly] = useState(true)

  useEffect(() => {
    const getInvitation = async () => {
      try {
        const { data } = await axios.get<SellerInvitation>(
          `${BASE_URL}/invitations/${invitationId}`
        )

        setInvitation(data)
        setIsReadOnly(
          !isAdmin && data.status !== 'Lead' && data.status !== 'Prelead'
        )
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }

    getInvitation()
  }, [invitationId, isAdmin])

  const update = useCallback(
    async (payload: Partial<SellerInvitation>, recaptchaToken?: string) => {
      if (!isReadOnly) {
        const { data } = await axios.patch(
          `${BASE_URL}/invitations/${invitationId}`,
          payload,
          { params: { recaptchaToken } }
        )

        setInvitation((prevState) => ({ ...prevState, ...data }))
      }
    },
    [invitationId, isReadOnly]
  )

  return {
    invitationId: invitationId ?? '',
    isReadOnly,
    isLoading,
    invitation,
    update,
    stepHandler,
  }
}

export function useInvitationContext() {
  const context = React.useContext<InvitationContext>(invitationContext)

  if (!context) {
    console.error(
      'Invitation context is undefined! Please call in a child of TabsContainer'
    )
  }

  return context
}

export default useInvitationModule
