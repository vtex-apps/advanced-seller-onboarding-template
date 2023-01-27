import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

const GOOGLE_RECAPTCHA_URL = 'http://www.google.com/recaptcha/api/siteverify'

export default class ReCAPTCHAClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(GOOGLE_RECAPTCHA_URL, context, {
      ...options,
      headers: {
        ...options?.headers,
        'X-Vtex-Use-Https': 'true',
        'X-Vtex-Proxy-To': 'https://www.google.com/',
      },
    })
  }

  public async verify(token: string, secret: string): Promise<boolean> {
    const { success } = await this.http.post<any>('', undefined, {
      params: {
        secret,
        response: token,
      },
    })

    return success
  }
}
