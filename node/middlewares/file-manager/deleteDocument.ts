import type {
  FileLink,
  FileName,
  DocumentLinks,
} from '../../typings/invitations'
import FileManager from '../../clients/FileManager'
import { formatError } from '../../utils/formatError'
import { validateInvitationStatus } from '../../utils/invitation'

interface DocumentData {
  fileLink?: FileLink
  fileName?: FileName
}
const deleteDocument = async (ctx: Context): Promise<any> => {
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
    await validateInvitationStatus(ctx, invitationId as string)

    const fileLink = ctx.query.fileLink as string
    const path = fileLink.split(`/${FileManager.bucket}/`)[1]
    try{
      await fileManager.deleteFile(path)
    } catch(e){
      logger.error({
        middleware: 'FILEMANAGER DELETE-DOCUMENTS',
        message: 'Error while finding documents in fileManager',
        error: formatError(e),
      })
    }
   
    const documentLinks = ctx.state.payload as DocumentLinks
    const filteredDocumentLinks = documentLinks.filter((link: DocumentData) => {
      return link?.fileLink !== fileLink
    })

    await invitations.update(invitationId as string, {
      documentLinks: filteredDocumentLinks,
    })
    ctx.status = 201
  } catch (exception) {
    logger.error({
      middleware: 'DELETE-DOCUMENTS',
      message: 'Error while deleting documents',
      error: formatError(exception),
    })

    ctx.status = 500
    ctx.body = formatError(exception)
  }
}

export default deleteDocument
