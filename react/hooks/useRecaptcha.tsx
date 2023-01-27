import React, { useEffect, useRef, useState } from 'react'
import type { MutableRefObject } from 'react'
import axios from 'axios'
import type ReCAPTCHA from 'react-google-recaptcha'

import { BASE_URL } from '../utils/constants'

export default function useRecaptcha() {
  const [siteKey, setSiteKey] = useState('')
  const recaptchaRef = useRef<ReCAPTCHA>()

  useEffect(() => {
    async function getSiteKey() {
      try {
        const { data } = await axios.get(`${BASE_URL}/recaptcha`)

        setSiteKey(data)
      } catch (e) {
        console.error(e)
      }
    }

    getSiteKey()
  }, [])

  return { siteKey, recaptchaRef }
}

export interface UseRecaptchaData {
  siteKey: string
  recaptchaRef: MutableRefObject<ReCAPTCHA>
}
