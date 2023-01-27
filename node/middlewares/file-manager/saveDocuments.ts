import type { ReadStream } from 'fs'

import asyncBusboy from 'async-busboy'

import type { DocumentLinks } from '../../typings/invitations'
import { formatError } from '../../utils/formatError'
import { validateInvitationStatus } from '../../utils/invitation'

export interface MultipartFile extends ReadStream {
  filename: string
  path: string
  encoding: string
  mimeType: string
}

async function saveDocuments(ctx: Context<DocumentLinks>): Promise<any> {
  const {
    clients: { fileManager, invitations },
    vtex: {
      logger,
      route: {
        params: { invitationId },
      },
    },
  } = ctx

  try {
    logger.debug({
      middleware: 'SAVE-DOCUMENTS',
      message: 'Received request',
      invitationId,
    })

    await validateInvitationStatus(ctx, invitationId as string)
    const existingDocumentLinks = ctx.state.payload || []

    const { files } = await asyncBusboy(ctx.req)

    if (!files) {
      ctx.body = []
      ctx.status = 200

      return
    }

    const documentLinks: DocumentLinks = []

    for (const f of files) {
      const file = f as MultipartFile
      const fileName = file.filename

      logger.debug({
        middleware: 'SAVE-DOCUMENTS',
        message: 'Saving file',
        invitationId,
        fileName,
      })

      documentLinks.push({
        // eslint-disable-next-line no-await-in-loop
        fileLink: await fileManager.saveFile(file),
        fileName,
      })
    }

    await invitations.update(invitationId as string, {
      documentLinks: [...existingDocumentLinks, ...documentLinks],
    })

    ctx.body = documentLinks
    ctx.status = 201
  } catch (exception) {
    logger.error({
      middleware: 'SAVE-DOCUMENTS',
      message: 'Error while saving documents',
      error: formatError(exception),
    })

    ctx.status = 500
    ctx.body = formatError(exception)
  }
}

export default saveDocuments
