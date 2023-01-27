import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import { EmailFormat } from '../typings/emailFormat'

import { getRequestConfig } from '../utils/request'

interface EmailData {
  TemplateName: string
  applicationName: string
  logEvidence: boolean
  jsonData: {
    to: {
      name: string
      email: string
    }
    [field: string]: any
  }
}

export default class EmailClient extends ExternalClient {
  private routes = {
    sendMail: () => `/mail-service/pvt/sendmail`,
    getEmailTemplate: () => `/template-render/pvt/templates/`
  }

  constructor(context: IOContext, options?: InstanceOptions) {
    super(
      `http://${context.account}.vtexcommercestable.com.br/api`,
      context,
      {
        ...options,
        headers: { ...options?.headers, 'X-Vtex-Use-Https': 'true' },
      }
    )
  }

  public async sendMail(data: EmailData) {
    return this.http.post(
      this.routes.sendMail(),
      data,
      getRequestConfig(this.context, 'email-client')
    )
  }

  public async getEmailTemplate(templateId: String): Promise<EmailFormat>{
    return this.http.get(
      this.routes.getEmailTemplate()+ templateId,
      getRequestConfig(this.context, 'email-client')
    )
  }
}
