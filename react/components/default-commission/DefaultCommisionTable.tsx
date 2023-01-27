import React, { useContext, useMemo } from 'react'
import { Table } from 'vtex.styleguide'
import type { IntlShape } from 'react-intl'
import { useIntl } from 'react-intl'

import DefaultCommissionDropzone from './DefaultCommisionDropzone'
import { DefaultCommissionContext } from '../../DefaultCommissionDashboard'

const defaultSchema = (intl: IntlShape) => ({
  properties: {
    categoryId: {
      title: intl.formatMessage({
        id: 'onboarding-seller.commission-table.categoryId',
      }),
      minWidth: 100,
    },
    productCommissionPercentage: {
      title: intl.formatMessage({
        id: 'onboarding-seller.commission-table.product-commission',
      }),
      minWidth: 200,
    },
    freightCommissionPercentage: {
      title: intl.formatMessage({
        id: 'onboarding-seller.commission-table.freight-commission',
      }),
      minWidth: 200,
    },
  },
})

function DefaultCommissionTable() {
  const intl = useIntl()
  const schema = useMemo(() => defaultSchema(intl), [])
  const { commissionData, isTableLoading } = useContext(
    DefaultCommissionContext
  )

  return (
    <Table
      loading={isTableLoading}
      schema={schema}
      fullWidth
      items={commissionData}
      emptyStateLabel={intl.formatMessage({
        id: 'onboarding-seller.commission-table.empty',
      })}
    />
  )
}

export default DefaultCommissionTable
