import React, { useContext, useState } from 'react'
import {
  Dropzone,
  Button,
  Box,
  Link,
  Divider,
  ButtonWithIcon,
  ToastContext,
  Alert,
} from 'vtex.styleguide'
import { FormattedMessage, useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { useField } from 'formik'
import axios from 'axios'
import DeleteIconSvg from '../DeleteIconSvg'
import type { DocumentLinks } from '../../../node/typings/invitations'
import { DOCUMENTS_BASE_URL } from '../../utils/constants'
import { useInvitationContext } from '../../hooks/useInvitationModule'
import type { UseRecaptchaData } from '../../hooks/useRecaptcha'
import useAppSettings from '../../hooks/useAppSettings'

const remove = <DeleteIconSvg />

const cssNames = [
  'uploadContainer',
  'dropzoneContainer',
  'dropzoneTitle',
  'dropzoneImage',
  'chooseFile',
  'uploadedFilesTitle',
  'uploadedFilesContainer',
  'uploadedFileContainer',
  'uploadedFileContent',
  'uploadedFileButton',
  'uploadFileButton',
  'tabTitle',
] as const

interface UploadDocumentsTabProps {
  recaptchaRef?: UseRecaptchaData['recaptchaRef'],
  imageProp?: string
}

function UploadDocumentsTab({ recaptchaRef, imageProp }: UploadDocumentsTabProps) {
  const handles = useCssHandles(cssNames)
  const intl = useIntl()
  const { showToast } = useContext(ToastContext)
  const { invitationId, isReadOnly } = useInvitationContext()
  
  const appSettings = useAppSettings();
  const [isLoading, setIsLoading] = useState(false)
  const [newFiles, setNewFiles] = useState<File[]>()

  const [field, meta, { setValue }] = useField<DocumentLinks>({
    name: 'documentLinks',
    type: 'file',
    multiple: true,
  })

  const handleSetFile = (files: File[]) => setNewFiles(files)

  const handleReset = () => setNewFiles([])

  const handleDeleteDocument = async ({ fileLink }: DocumentLinks[0]) => {
    try {
      setIsLoading(true)

      const recaptchaToken = await recaptchaRef?.current.executeAsync()

      await recaptchaRef?.current.reset()

      await axios.delete(DOCUMENTS_BASE_URL(invitationId ?? ''), {
        params: { fileLink, recaptchaToken },
      })

      setValue(field.value.filter((file) => file.fileLink !== fileLink))
    } catch (e) {
      showToast({
        message: intl.formatMessage({
          id: 'onboarding-seller.prelead-form.upload.errors.delete',
        }),
        duration: Infinity,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async () => {
    try {
      setIsLoading(true)

      const formData = new FormData()

      newFiles?.forEach((file) => {
        formData.append('files', file)
      })

      const recaptchaToken = await recaptchaRef?.current.executeAsync()

      await recaptchaRef?.current.reset()

      const { data } = await axios.post(
        DOCUMENTS_BASE_URL(invitationId ?? ''),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params: { recaptchaToken },
        }
      )

      setValue([...field.value, ...data])
      handleReset()
    } catch (e) {
      console.log(e)
      showToast({
        message: intl.formatMessage({
          id: 'onboarding-seller.prelead-form.upload.errors.upload',
        }),
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`mt4 ${handles.uploadContainer}`}>
      <h3 className={handles.tabTitle}>
        <FormattedMessage id="onboarding-seller.prelead-form.upload.title" />
      </h3>

      {!!meta.error && (
        <div className="mv3">
          <Alert type="error">{meta.error}</Alert>
        </div>
      )}

      {!isReadOnly ? (
        <div className={`relative ${handles.dropzoneContainer}`}>
          <Dropzone
            multiple
            onDropAccepted={handleSetFile}
            onFileReset={handleReset}
            icon={
              <img
                className={handles.dropzoneImage}
                src={ appSettings && appSettings?.uploadFilesImage ?  appSettings.uploadFilesImage : imageProp}
                alt="Upload documents"
              />
            }
          >
            <h4 className={handles.dropzoneTitle}>
              <FormattedMessage id="onboarding-seller.prelead-form.upload.dropTitle" />
            </h4>
            <div className="pt7">
              <div>
                <span className="f4">
                  <FormattedMessage id="onboarding-seller.prelead-form.upload.dropFiles" />{' '}
                </span>
                <span className={`f4 c-link ${handles.chooseFile}`}>
                  <FormattedMessage id="onboarding-seller.prelead-form.upload.chooseFiles" />
                </span>
              </div>
            </div>
          </Dropzone>

          <div className={`mt4 ${handles.uploadFileButton}`}>
            <Button
              disabled={isReadOnly || isLoading || !newFiles?.length}
              block
              onClick={handleUpload}
            >
              <FormattedMessage id="onboarding-seller.prelead-form.upload.uploadButton" />
            </Button>
          </div>

          <div className="mv6">
            <Divider orientation="horizontal" />
          </div>
        </div>
      ) : null}

      <h3 className={`t-heading-3 ${handles.uploadedFilesTitle}`}>
        <FormattedMessage id="onboarding-seller.prelead-form.upload.documentsTitle" />
      </h3>

      <div
        className={`pt4 pb4 flex flex-column ${handles.uploadedFilesContainer}`}
      >
        {field.value?.map((documentLink) => (
          <div
            key={documentLink.fileLink}
            className={`mb3 ${handles.uploadedFileContainer}`}
            style={{ wordBreak: 'break-all' }}
          >
            <Box fit="fill-vertical" noPadding>
              <div
                className={`flex flex-row items-center justify-between ${handles.uploadedFileContent}`}
              >
                <div className="ml4">
                  <Link href={documentLink.fileLink} target="_blank">
                    {documentLink?.fileName}
                  </Link>
                </div>

                <div className={`pr2 pt2 pb2 ${handles.uploadedFileButton}`}>
                  <ButtonWithIcon
                    icon={remove}
                    variation="danger"
                    disabled={isReadOnly || isLoading}
                    onClick={() => handleDeleteDocument(documentLink)}
                    size="small"
                  />
                </div>
              </div>
            </Box>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UploadDocumentsTab
