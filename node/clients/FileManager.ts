import type { InstanceOptions, IOContext } from '@vtex/api'
import { AppClient } from '@vtex/api'
import { v4 as uuidv4 } from 'uuid'

import type { MultipartFile } from '../middlewares/file-manager/saveDocuments'

// const appId = process.env.VTEX_APP_ID
const [runningAppName] = 'seller-onboarding'

const routes = {
  Assets: () => `/assets/${runningAppName}`,
  FileUpload: (bucket: string, path: string) =>
    `${routes.Assets()}/save/${bucket}/${path}`,
  FileDelete: (bucket: string, path: string) =>
    `${routes.Assets()}/delete/${bucket}/${path}`,
}

export default class FileManager extends AppClient {
  public static readonly bucket = 'documents'

  constructor(ioContext: IOContext, opts: InstanceOptions = {}) {
    super('vtex.file-manager@0.x', ioContext, opts)
  }

  public saveFile = async (file: MultipartFile): Promise<string> => {
    const { filename, encoding, mimeType } = file
    const uuid = uuidv4()
    const extension = filename?.split('.')?.pop() ?? 'jpg'
    const path = `${uuid}.${extension}`

    return this.http.put(routes.FileUpload(FileManager.bucket, path), file, {
      headers: {
        'Content-Type': mimeType,
        'Content-Encoding': encoding,
      },
    })
  }

  public deleteFile = async (filename: string) => {
    try {
      return await this.http.delete(
        routes.FileDelete(FileManager.bucket, filename)
      )
    } catch (e) {
      throw e
    }
  }
}
