export const getSettingsResolver = async (
  _root:unknown,
  _args:unknown,
  ctx: Context
  ) => {
    const {
      clients: { apps },
    } = ctx

    const result = await apps.getAppSettings(ctx.vtex.userAgent)

    return {uploadFilesImage: result.uploadFilesImage, termsAndConditionsPages: result.termsAndConditionsPages}
  }
