import type cors from '@koa/cors'

import { getAdminSessionData } from './request'
import { getSettings } from './settings'

export async function isAdmin(ctx: Context): Promise<boolean> {
  const { adminUserEmail, adminUserId } = await getAdminSessionData(ctx)

  return !!(adminUserEmail && adminUserId)
}

// ctx must have the any type because the cors types are not from the vtex-api package but from the base koa package
export const validateOrigin: cors.Options['origin'] = async (ctx: any) => {
  const { origin = '' } = ctx.headers

  const { corsWhitelist = [] } = await getSettings(ctx)

  if (corsWhitelist.length && !corsWhitelist.includes(origin)) {
    return ''
  }

  return origin
}
