import type { InstanceOptions, IOContext } from '@vtex/api'
 import { ExternalClient } from '@vtex/api'

 import { getRequestConfig } from '../utils/request'
 import type {
   SellerConfiguration,
 } from '../typings/sellerPortal'

 export default class SellerInfoClient extends ExternalClient {
   constructor(context: IOContext, options?: InstanceOptions) {
     super(
       `http://${context.account}.vtexcommercestable.com.br/api/seller-register/pvt/sellers`,
       context,
       {
         ...options,
         headers: {
           ...options?.headers,
           'X-Vtex-Use-Https': 'true',
         },
       }
     )
   }

   public async getSellerInfoById(id: string): Promise<SellerConfiguration> {
     return this.http.get(
       `/${id}`,
       getRequestConfig(this.context, 'get-seller-info-by-id')
     )
   }
 }