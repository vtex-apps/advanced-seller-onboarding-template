import type { IOContext, RequestTracingConfig } from '@vtex/api'

export interface Headers {
  [key: string]: string
}

export function getRequestConfig(
  context: IOContext,
  metric: string,
  tracingConfig?: RequestTracingConfig
) {
  const token = context.authToken
  const headers: Headers = token
    ? {
        VtexIdclientAutCookie: token,
      }
    : {}

  return {
    headers,
    metric,
    tracing: {
      requestSpanNameSuffix: metric,
      ...tracingConfig?.tracing,
    },
  }
}

export async function getAdminSessionData(ctx: Context) {
  const { sessionData } = await ctx.clients.session.getSession(
    ctx.vtex.sessionToken ?? '',
    ['authentication.adminUserId', 'authentication.adminUserEmail']
  )

  const adminUserId =
    sessionData?.namespaces?.authentication?.adminUserId?.value

  const adminUserEmail =
    sessionData?.namespaces?.authentication?.adminUserEmail?.value

  return { adminUserId, adminUserEmail }
}
