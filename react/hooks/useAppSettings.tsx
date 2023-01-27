/* eslint-disable import/order */
import { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import { useIntl } from 'react-intl'
import getSettingsApp from './../graphql/getSettingsApp.gql'

interface TermsAndConditionsPages {
    pageName: string,
    pageURL: string
}

interface AppSettings {
  termsAndConditionsPages: TermsAndConditionsPages[],
  uploadFilesImage?: string
}

const useAppSettings = (): AppSettings => {
  const [settings, setSettings] = useState<any>({})
  const intl = useIntl()
  try{
    const { data: settingsData, loading: settingsLoading } = useQuery(getSettingsApp, {
      ssr: false,
    })
  
    useEffect(() => {
      if (settingsLoading || !settingsData) setSettings(null)
      if(!settingsLoading && settingsData?.getSettingsQuery){
        const { termsAndConditionsPages, uploadFilesImage} = settingsData.getSettingsQuery
        let termsAndConditions = termsAndConditionsPages ? termsAndConditionsPages : []
        let uploadFiles = uploadFilesImage ? uploadFilesImage : ''
        if(termsAndConditions.filter(t => t.pageURL === "/vtex-terms").length==0){
          termsAndConditions.push({ pageName: intl.formatMessage({id: "onboarding-seller.prelead-form.vtex.title"}),
          pageURL: "/vtex-terms"
         })
        }
  
        setSettings({termsAndConditionsPages: termsAndConditions, uploadFilesImage: uploadFiles})
      }
    
    }, [ settingsData, settingsLoading])
  } catch(e){
    console.log(e)
  }
 

  return settings
}

export default useAppSettings
