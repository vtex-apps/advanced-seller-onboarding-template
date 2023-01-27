import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

import { getRequestConfig } from '../utils/request'
import type {
  SellerConnect,
  SellerLeadCreate,
  SellerLeadCreateResponse,
  SellerLeadGet,
  SellerLeadResendInvite,
} from '../typings/sellerPortal'
import type { Commission } from '../typings/commission'

export default class SellerPortalClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(
      `http://${context.account}.vtexcommercestable.com.br/api/seller-register/pvt`,
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

  public async getLeads() {
    return this.http.get(
      '/seller-leads',
      getRequestConfig(this.context, 'get-seller-portal-leads')
    )
  }

  public async getLeadById(id: string): Promise<SellerLeadGet> {
    return this.http.get(
      `/seller-leads/${id}`,
      getRequestConfig(this.context, 'get-seller-portal-leads')
    )
  }

  public async inviteLead(
    lead: SellerLeadCreate
  ): Promise<SellerLeadCreateResponse> {
    const { sellerEmail, sellerName, salesChannel, sellerType } = lead

    if (!sellerEmail || !sellerName || !salesChannel || !sellerType) {
      throw new Error(
        '[SELLER-PORTAL] Seller email, name, type and sales channel are required'
      )
    }

    return this.http.post(
      '/seller-leads',
      lead,
      getRequestConfig(this.context, 'post-seller-portal-leads')
    )
  }

  public async resendLeadInvite(
    lead: SellerLeadResendInvite
  ): Promise<SellerLeadCreateResponse> {
    const { id, status } = lead

    if (!id || !status) {
      throw new Error('[SELLER-PORTAL] Seller id and status are required')
    }

    return this.http.put(
      `/seller-leads/${id}/status`,
      { status },
      getRequestConfig(this.context, 'put-seller-portal-leads')
    )
  }

  public async connectSeller(
    seller: SellerConnect
  ): Promise<SellerLeadCreateResponse> {
    const { id, status = 'Accepted', isActive = false } = seller

    if (!id) {
      throw new Error('[SELLER-PORTAL] Seller id is required')
    }

    return this.http.put(
      `/seller-leads/${id}/seller`,
      {},
      {
        params: {
          isActive,
          status,
        },
        ...getRequestConfig(this.context, 'connect-seller'),
      }
    )
  }

  public async updateCommissions(
    commissionData: Commission[],
    sellerId: string
  ) {
    if (!commissionData || !commissionData.length) {
      throw new Error('[SELLER-PORTAL] Commission data required')
    }

    if (!sellerId) {
      throw new Error('[SELLER-PORTAL] Seller id is required')
    }

    await this.http.put(`/sellers/${sellerId}/commissions`, commissionData, {
      ...getRequestConfig(this.context, 'update-commissions'),
    })
  }
}
