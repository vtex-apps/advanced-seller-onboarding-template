import React, { useContext, useEffect, useState } from 'react'
import { Layout, PageBlock, PageHeader, ToastContext } from 'vtex.styleguide'
import { FormattedMessage, useIntl } from 'react-intl'
import axios from 'axios'

import withToastProvider from './components/withToastProvider'
import DefaultCommissionTable from './components/default-commission/DefaultCommisionTable'
import DefaultCommissionDropzone from './components/default-commission/DefaultCommisionDropzone'
import { DEFAULT_COMMISSION_URL } from './utils/constants'
import type { Commission, DefaultCommissionData } from './typings/common'

export const DefaultCommissionContext =
  React.createContext<DefaultCommissionData>({})

function DefaultCommissionDashboard() {
  const intl = useIntl()
  const { showToast } = useContext(ToastContext)

  const [commissionData, setCommissionData] = useState<Commission[]>([])
  const [isTableLoading, setIsTableLoading] = useState<boolean>(false)

  const getCommissionData = async () => {
    try {
      setIsTableLoading(true)

      const commissionResponse = await axios.get<Commission[]>(
        DEFAULT_COMMISSION_URL
      )

      setCommissionData(commissionResponse.data)
    } catch (e) {
      showToast({
        message: intl.formatMessage({
          id: 'onboarding-seller.commission-dropzone.uploadError',
        }),
        duration: Infinity,
      })
    } finally {
      setIsTableLoading(false)
    }
  }

  useEffect(() => {
    getCommissionData()
  }, [])

  return (
    <Layout
      fullWidth
      pageHeader={
        <PageHeader
          title={
            <FormattedMessage id="vtex-menu.onboarding-seller.default-commission" />
          }
        />
      }
    >
      <PageBlock variation="full">
        <DefaultCommissionContext.Provider
          value={{ commissionData, isTableLoading }}
        >
          <DefaultCommissionTable />
        </DefaultCommissionContext.Provider>
      </PageBlock>
      <PageBlock variation="full">
        <DefaultCommissionContext.Provider value={{ getCommissionData }}>
          <DefaultCommissionDropzone />
        </DefaultCommissionContext.Provider>
      </PageBlock>
    </Layout>
  )
}

export default withToastProvider(DefaultCommissionDashboard)
