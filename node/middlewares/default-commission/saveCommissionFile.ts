import type { ReadStream } from 'fs'

import asyncBusboy from 'async-busboy'
import { validate } from 'jsonschema'

import { formatError } from '../../utils/formatError'
import { VBASE_BUCKETS } from '../../utils/constants'

function streamToString(stream: ReadStream): Promise<string> {
  const chunks: any[] = []

  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    stream.on('error', (err) => reject(err))
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}

async function saveCommissionFile(ctx: Context): Promise<any> {
  const {
    clients: { vbase },
    vtex: { logger },
  } = ctx

  try {
    logger.debug({
      middleware: 'DEFAULT-COMMISSION-FILE',
      message: 'Received request',
    })

    const { files } = await asyncBusboy(ctx.req)

    if (!files || files.length !== 1) {
      ctx.body = []
      ctx.status = 500

      logger.debug({
        middleware: 'DEFAULT-COMMISSION-FILE',
        message: 'Error when uploading commission file',
      })

      return
    }

    const commissionFile = files[0]
    const commissionArray = await streamToString(commissionFile)

    const validationSchema = {
      id: '/CommissionArray',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          categoryId: { type: 'string', required: true },
          productCommissionPercentage: {
            type: 'number',
            minimum: 0,
            required: true,
          },
          freightCommissionPercentage: {
            type: 'number',
            minimum: 0,
            required: true,
          },
        },
      },
    }

    const validationResult = validate(
      JSON.parse(commissionArray),
      validationSchema
    )

    if (!validationResult.valid) {
      throw new Error('Validation failed')
    }

    logger.debug({
      middleware: 'DEFAULT-COMMISSION-FILE',
      message: 'Saving file',
    })

    await vbase.saveJSON(
      VBASE_BUCKETS.defaultCommission.bucket,
      VBASE_BUCKETS.defaultCommission.path,
      commissionArray
    )

    ctx.status = 201
  } catch (exception) {
    logger.error({
      middleware: 'SAVE-DOCUMENTS',
      message: 'Error while saving commission file',
      error: formatError(exception),
      stackTrace: exception,
    })

    ctx.status = 500
    ctx.body = formatError(exception)
  }
}

export default saveCommissionFile
