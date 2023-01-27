
import { IndexFormat } from "../../typings";

import { formatError } from "../../utils/formatError";

export async function generateIndices(
    ctx: Context
  ) {
      const indicesObjectList = require('../../utils/files/indices.json');
      const {
          clients: { masterdataClient },
          vtex: {logger}
        } = ctx
    try
    {
        indicesObjectList.forEach(async (index: IndexFormat) =>  
        {           
            await masterdataClient.createOrUpdateIndex(index);
        });
        logger.info({
            middleware: 'UPDATE SELLER INDEX',
            message: 'Success on updating indices! ',
        })
        ctx.body = "Successfully updated!"
        ctx.status = 200
    }
    catch(e){
        logger.error({
            middleware: 'UPDATE SELLER INDEX',
            message: 'Error while creating/updating indices',
            error: formatError(e),
        })
        ctx.body = formatError(e)
        ctx.status = 500
    }
}
  