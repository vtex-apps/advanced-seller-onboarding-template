import { json } from 'co-body'

export default async function parsePayload(
  ctx: Context,
  next: () => Promise<any>
) {
  ctx.state.payload = await json(ctx.req)

  await next()
}
