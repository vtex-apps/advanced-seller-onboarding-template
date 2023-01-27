import { InstanceOptions, IOContext } from '@vtex/api'
import {
  ONBOARDING_DATA_ENTITY, ONBOARDING_PAYMENT_METHODS_DATA_ENTITY, SCHEMA_NAME
} from '../utils/constants'
import { ExternalClient } from '@vtex/api'
import { IndexFormat } from '../typings'

const routes = {
  baseURLInvitation: () => `${ONBOARDING_DATA_ENTITY}`,
  schemas: () => `/schemas/${SCHEMA_NAME}`,
  indices: () => `/indices`,
  baseURLPaymentMethods: () => `${ONBOARDING_PAYMENT_METHODS_DATA_ENTITY}`,
}


export default class CustomMasterDataClient extends ExternalClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(`http://${ctx.account}.vtexcommercestable.com.br/api/dataentities/`,ctx, {
      ...options,
      headers: {
        ...options?.headers,
        VtexIdclientAutCookie: ctx.authToken
      },
    })
  }
  
  public async createOrUpdateSellerSchema(schemaObject: string): Promise<any> {
      return this.http.put(routes.baseURLInvitation()+routes.schemas(), JSON.parse(schemaObject));
  }

  public async createOrUpdatePaymentMethodSchema(schemaObject: string): Promise<any> {
    return this.http.put(routes.baseURLPaymentMethods()+routes.schemas(), JSON.parse(schemaObject));
}

  public async createOrUpdateIndex(indiceObject: IndexFormat): Promise<any> {
    return await this.http.put(routes.baseURLInvitation()+routes.indices(), indiceObject);
  }
}
