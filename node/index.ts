import type {
  ClientsConfig,
  EventContext,
  ParamsContext,
  RecorderState,
  ServiceContext,
} from '@vtex/api'
import { LRUCache, method, Service } from '@vtex/api'
import cors from '@koa/cors'

import Clients from './clients'
import {
  getInvitation,
  getInvitations,
  getTotalizers,
  handleInvitationResponse,
  patchInvitation,
  postPrelead,
} from './middlewares/invititations'
import {
  getRecaptchaSiteKey,
  validateRecaptchaToken,
} from './middlewares/recaptcha'
import {
  isAdminAuthenticated,
  isWhitelistedIp,
  parsePayload,
  validateSettingsMiddleware,
} from './middlewares/common'
import saveDocuments from './middlewares/file-manager/saveDocuments'
import deleteDocument from './middlewares/file-manager/deleteDocument'
import validateInvitationById from './middlewares/invititations/validateInvitationById'
import {
  createSellerCron,
  deleteSellerCron,
  updateSellerEvent,
  handleSellerCron,
  validateSellerCronToken,
} from './middlewares/seller-cron'
import {
  getSeller,
  getSellerAccount,
  loginSeller,
  updateSeller,
} from './middlewares/seller'
import { generateTemplates } from './middlewares/templates/generateTemplates'
import handleConnectSeller from './middlewares/connect/handleConnectSeller'
import { validateOrigin } from './utils/validators'
import Ping from './clients/PingClient'
import { getSellerResolver } from './resolvers/seller'
import { getSellerHtmlFormat } from './middlewares/seller/getSellerHtmlFormat'
import { generateInvitationsSchema, generatePaymentMethodSchema } from './middlewares/common/generateSchema'
import { generateIndices } from './middlewares/common/generateIndices'
import { getSettingsResolver } from './resolvers/getSettingsResolver'
import saveCommissionFile from './middlewares/default-commission/saveCommissionFile'
import getCommissionData from './middlewares/default-commission/getCommissionData'

const TIMEOUT_MS = 800

// Create a LRU memory cache for the Status client.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
const memoryCache = new LRUCache<string, any>({ max: 5000 })

metrics.trackCache('status', memoryCache)

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    // This key will be merged with the default options and add this cache to our Status client.
    status: {
      memoryCache,
    },
  },
}

declare global {
  type Context<Payload = unknown> = ServiceContext<Clients, State<Payload>>

  // The shape of our State object found in `ctx.state`. This is used as state bag to communicate between middlewares.
  interface State<Payload> extends RecorderState {
    payload: Payload
  }

  interface EventCtx<Body = unknown> extends EventContext<Clients> {
    body: Body
  }
}

// Export a service that defines route handlers and client options.
export default new Service<Clients, State<never>, ParamsContext>({
  clients,
  events: {
    sellerCronEvent: [updateSellerEvent],
  },
  routes: {
    invitations: method({
      GET: [isAdminAuthenticated, getInvitations],
      POST: [
        validateSettingsMiddleware,
        validateRecaptchaToken,
        parsePayload,
        postPrelead,
      ],
    }),
    invitation: method<any, any, any>({
      GET: [getInvitation],
      PATCH: [parsePayload, validateRecaptchaToken, patchInvitation],
      POST: [
        isAdminAuthenticated,
        validateSettingsMiddleware,
        parsePayload,
        handleInvitationResponse,
      ],
    }),
    publicPrelead: method({
      OPTIONS: cors({ origin: validateOrigin }),
      POST: [
        isWhitelistedIp,
        cors({ origin: validateOrigin }),
        validateSettingsMiddleware,
        validateRecaptchaToken,
        parsePayload,
        postPrelead,
      ],
    }),
    totalizers: method({
      GET: [isAdminAuthenticated, getTotalizers],
    }),
    recaptcha: method({
      GET: [getRecaptchaSiteKey],
    }),
    documents: method({
      POST: [validateRecaptchaToken, validateInvitationById, saveDocuments],
      DELETE: [validateRecaptchaToken, validateInvitationById, deleteDocument],
    }),
    cron: method({
      POST: [validateSellerCronToken, createSellerCron],
      PATCH: [validateSellerCronToken, handleSellerCron],
      DELETE: [validateSellerCronToken, deleteSellerCron],
    }),
    seller: method({
      GET: [getSeller],
      PATCH: [updateSeller],
    }),
    sellerAccount: method({
      GET: [getSellerAccount],
    }),
    sellerHtmlFormat: method({
      OPTIONS: cors({ origin: validateOrigin }),
      GET: [cors({ origin: validateOrigin }), getSellerHtmlFormat],
    }),
    generateTemplates: method({
      POST: [validateSellerCronToken, generateTemplates],
    }),
    connectSeller: method({
      POST: [isAdminAuthenticated, handleConnectSeller],
    }),
    sellerLogin: method({
      OPTIONS: cors({ origin: validateOrigin }),
      POST: [
        isWhitelistedIp,
        cors({ origin: validateOrigin }),
        validateSettingsMiddleware,
        validateRecaptchaToken,
        parsePayload,
        loginSeller,
      ],
    }),
    defaultCommission: method({
      POST: [isAdminAuthenticated, saveCommissionFile],
      GET: [isAdminAuthenticated, getCommissionData],
    }),
    ping: [Ping.getMiddleware()],
    sellerSchema: method({
      PUT: [validateSellerCronToken, generateInvitationsSchema],
    }),
    paymentMethodSchema: method({
      PUT: [validateSellerCronToken, generatePaymentMethodSchema],
    }),
    indices: method({
      PUT: [validateSellerCronToken, generateIndices],
    }),
  },
  graphql: {
    resolvers: {
      Query: {
        getSeller: getSellerResolver,
        getSettingsQuery: getSettingsResolver,
      },
    },
  },
})
