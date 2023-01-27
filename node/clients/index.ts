import { IOClients } from '@vtex/api'

import type { PaymentMethod, SellerInvitation } from '../typings/invitations'
import EmailClient from './EmailClient'
import ReCAPTCHAClient from './ReCAPTCHAClient'
import SellerPortalClient from './SellerPortalClient'
import PingClient from './PingClient'
import FileManager from './FileManager'
import Scheduler from './Scheduler'
import Templates from './Templates'
import { masterDataForWrapper } from '../utils/masterDataForWrapper'
import CustomMasterDataClient from './CustomMasterDataClient'
import SellerInfoClient from './SellerInfoClient'

// Extend the default IOClients implementation with our own custom clients.
export default class Clients extends IOClients {
  public get invitations() {
    return this.getOrSet(
      'invitations',
      masterDataForWrapper<SellerInvitation>('invitations', 'main')
    )
  }

  public get paymentMethods() {
    return this.getOrSet(
      'paymentMethods',
      masterDataForWrapper<PaymentMethod>('paymentMethods', 'main')
    )
  }

  public get email() {
    return this.getOrSet('email', EmailClient)
  }

  public get masterdataClient() {
    return this.getOrSet('masterdataClient', CustomMasterDataClient)
  }

  public get sellerInfoConfig() {
    return this.getOrSet('sellerInfoConfig', SellerInfoClient)
  }

  public get fileManager() {
    return this.getOrSet('fileManager', FileManager)
  }

  public get recaptcha() {
    return this.getOrSet('recaptcha', ReCAPTCHAClient)
  }

  public get sellerPortal() {
    return this.getOrSet('sellerPortal', SellerPortalClient)
  }

  public get scheduler() {
    return this.getOrSet('scheduler', Scheduler)
  }

  public get templates() {
    return this.getOrSet('templates', Templates)
  }

  public get ping() {
    return this.getOrSet('ping', PingClient)
  }
}
