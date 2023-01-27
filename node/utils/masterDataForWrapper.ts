import { masterDataFor } from '@vtex/clients'
import type { InstanceOptions, IOContext } from '@vtex/api'

// this is needed after replacing the masterdata builder.
// The build would inject the schema name, so we need to set it instead
export function masterDataForWrapper<T>(
  entityName: string,
  schemaName: string
) {
  const clientClass = masterDataFor<T>(entityName)

  // the returned class is not an abstract class even if the types disagree
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return class extends clientClass {
    public schema: string

    constructor(ctx: IOContext, options?: InstanceOptions) {
      super(ctx, options)

      this.schema = schemaName
    }
  }
}
