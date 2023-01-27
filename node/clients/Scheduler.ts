import type { InstanceOptions, IOContext } from '@vtex/api'
import { IOClient } from '@vtex/api'

import type { CreateSchedulerParams, SchedulerBody } from '../typings/scheduler'

// TODO: can this be cleaned?
export default class Scheduler extends IOClient {
  private static APP_NAME = `advanced-seller-onboarding`

  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...(options?.headers ?? {}),
        'Content-Type': 'application/json',
        'X-Vtex-Use-Https': 'true',
        // TODO: is this needed?
        VtexIdclientAutCookie: context.authToken,
      },
    })
  }

  private getSchedulerUrl(id = '') {
    return `http://${this.context.host}/api/scheduler/${this.context.workspace}/${Scheduler.APP_NAME}/${id}?version=4`
  }

  public async createOrUpdateScheduler(params: CreateSchedulerParams) {
    const { cronExpression, request, cronId } = params

    const schedulerBody: SchedulerBody = {
      id: cronId,
      request,
      scheduler: {
        expression: cronExpression,
        endDate: '2100-01-01T23:30:00',
      },
      retry: {
        delay: {
          addMinutes: 5,
          addHours: 0,
          addDays: 0,
        },
        times: 2,
        backOffRate: 1.0,
      },
    }

    return this.http.put(this.getSchedulerUrl(), schedulerBody)
  }

  public async deleteScheduler(id: string) {
    return this.http.delete(this.getSchedulerUrl(id))
  }
}
