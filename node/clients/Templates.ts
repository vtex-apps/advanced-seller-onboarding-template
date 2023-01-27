import { InstanceOptions, IOContext, JanusClient } from '@vtex/api'
import { getRequestConfig } from '../utils/request'

export default class Templates extends JanusClient {
  private url = `http://${this.context.host}/api/template-render/pvt/templates`

  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
    })
  }

  public async create(
    emailName: string,
    emailTemplate: string,
    emailTitle: string
  ) {
    return this.http.post(
      this.url,
      {
        Name: emailName,
        FriendlyName: emailName,
        Description: null,
        IsDefaultTemplate: false,
        AccountId: null,
        AccountName: null,
        ApplicationId: null,
        IsPersisted: true,
        IsRemoved: false,
        Type: '',
        Templates: {
          email: {
            To: '{{to.email}}',
            CC: null,
            BCC: null,
            Subject: emailTitle,
            Message: emailTemplate,
            Type: 'E',
            ProviderId: '00000000-0000-0000-0000-000000000000',
            ProviderName: null,
            IsActive: true,
            withError: false,
            Parameters: [],
          },
        },
      },

      getRequestConfig(this.context, 'create-template')
    )
  }
}
