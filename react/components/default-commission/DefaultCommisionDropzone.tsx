import React, { useContext, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Dropzone, ToastContext } from 'vtex.styleguide'
import axios from 'axios'

import { DEFAULT_COMMISSION_URL } from '../../utils/constants'
import { DefaultCommissionContext } from '../../DefaultCommissionDashboard'

function DefaultCommissionDropzone() {
  const intl = useIntl()

  const { showToast } = useContext(ToastContext)
  const { getCommissionData } = useContext(DefaultCommissionContext)

  const [commissionFile, setCommissionFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = async () => {
    if (!commissionFile) return

    try {
      setIsLoading(true)

      const formData = new FormData()

      formData.append('file', commissionFile)

      await axios.post(DEFAULT_COMMISSION_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (getCommissionData) getCommissionData()
    } catch (e) {
      showToast({
        message: intl.formatMessage({
          id: 'onboarding-seller.commission-dropzone.uploadError',
        }),
        duration: Infinity,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetFile = (files: File[]) => setCommissionFile(files[0])

  const handleReset = () => setCommissionFile(null)

  return (
    <div>
      <h2 className="t-heading-3">
        <FormattedMessage id="onboarding-seller.commission-dropzone.title" />
      </h2>
      <Dropzone
        maxSize={2 ** 20 * 50}
        isLoading={isLoading}
        multiple={false}
        accept=".json"
        onDropAccepted={handleSetFile}
        onFileReset={handleReset}
      >
        <div className="pt7">
          <div>
            <span className="f4">
              <FormattedMessage id="onboarding-seller.commission-dropzone.text" />
            </span>
            <span className="f4 c-link" style={{ cursor: 'pointer' }}>
              <FormattedMessage id="onboarding-seller.commission-dropzone.chooseFile" />
            </span>
          </div>
        </div>
      </Dropzone>
      <div className="mt4">
        <Button
          block
          disabled={!commissionFile}
          isLoading={isLoading}
          onClick={handleSubmit}
        >
          <FormattedMessage id="onboarding-seller.commission-dropzone.submitButton" />
        </Button>
      </div>
    </div>
  )
}

export default DefaultCommissionDropzone
