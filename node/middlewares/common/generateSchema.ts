import { formatError } from "../../utils/formatError";

export async function generateInvitationsSchema(
  ctx: Context
) {
    const {
        clients: {masterdataClient},
        vtex: {logger},
      } = ctx
    
      const schemaObject = JSON.stringify(require('../../utils/files/schema.json'));
      const schemaType = JSON.parse(schemaObject).title
      
      try
      {
          await masterdataClient.createOrUpdateSellerSchema(schemaObject);
          logger.info({
              middleware: 'UPDATE SCHEMA: ' + schemaType,
              message: 'Schema successfuly created/updated!',
              data: schemaObject
          })
          ctx.status = 200
          ctx.body = "Schema successfuly created/updated!"
      }
      catch(e){
          if(e.response?.status === 304){
              logger.info({
                  middleware: 'UPDATE SCHEMA: '+ schemaType,
                  message: 'The schema was already updated',
                  error: formatError(e),
              })
              ctx.status = 304
              ctx.body = "Schema successfuly created/updated!"
          } else {
              logger.error({
                  middleware: 'UPDATE SCHEMA: '+ schemaType,
                  message: 'Error on creating/updating schema!',
                  error: formatError(e),
              })
             
              ctx.status = 500
              ctx.body = "Error on creating/updating schema!"
          }
      }
}

export async function generatePaymentMethodSchema(
    ctx: Context
  ) {
    const {
        clients: {masterdataClient},
        vtex: {logger},
      } = ctx
    
      const schemaObject = JSON.stringify(require('../../utils/files/merchant-schema.json'));
      const schemaType = JSON.parse(schemaObject).title
      
      try
      {
          await masterdataClient.createOrUpdatePaymentMethodSchema(schemaObject);
          logger.info({
              middleware: 'UPDATE SCHEMA: ' + schemaType,
              message: 'Schema successfuly created/updated!',
              data: schemaObject
          })
          ctx.status = 200
          ctx.body = "Schema successfuly created/updated!"
      }
      catch(e){
          if(e.response?.status === 304){
              logger.info({
                  middleware: 'UPDATE SCHEMA: '+ schemaType,
                  message: 'The schema was already updated',
                  error: formatError(e),
              })
              ctx.status = 304
              ctx.body = "Schema successfuly created/updated!"
          } else {
              logger.error({
                  middleware: 'UPDATE SCHEMA: '+ schemaType,
                  message: 'Error on creating/updating schema!',
                  error: formatError(e),
              })
             
              ctx.status = 500
              ctx.body = "Error on creating/updating schema!"
          }
      }
}
