import React, { useEffect, useReducer, useState, useContext } from 'react'
import {
  ActionMenu,
  Alert,
  Button,
  IconOptionsDots,
  IconLink,
  Layout,
  PageBlock,
  PageHeader,
  Table,
  ToastProvider,
  ButtonWithIcon,
  ToastContext,
  Spinner,
} from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'
import axios from 'axios'
import { FormattedMessage, FormattedDate, useIntl } from 'react-intl'

import type { SellerInvitation } from '../node/typings/invitations'
import StatusSelector from './components/StatusSelector'
import { BASE_URL, DEFAULT_PAGE_SIZE } from './utils/constants'
import type {
  PaginationResponse,
  Statement,
  TableState,
  TotalizersReponse,
} from './typings/TableView'
import { TableViewActions } from './typings/TableView'
import type { ReducerAction } from './typings/common'
import InviteResponseModal from './components/InviteResponseModal'
import useInviteResponse from './hooks/useInvitationResponse'
import { getTotalizerWithColorValue } from './utils/totalizer'

const initialState: TableState = {
  pageSize: DEFAULT_PAGE_SIZE,
  currentPage: 1,
  invitations: [],
  slicedInvitations: [],
  totalInvitations: 0,
  currentItemFrom: 1,
  currentItemTo: DEFAULT_PAGE_SIZE,
  searchTerm: '',
  filterStatements: [],
  hasReachedLastPage: false,
  statusFilter: '',
  searchFilter: '',
}

function reducer(state: TableState, action: ReducerAction<TableViewActions>) {
  const { type, payload } = action

  switch (type) {
    case TableViewActions.loadPage: {
      const { data, pagination } = payload

      const invitations = [...state.invitations, ...data]
      const hasReachedLastPage =
        invitations.length < state.currentPage * state.pageSize

      return {
        ...state,
        invitations,
        hasReachedLastPage,
        totalInvitations: pagination.total,
        slicedInvitations: invitations.slice(
          state.currentItemFrom - 1,
          state.currentItemTo
        ),
      }
    }

    case TableViewActions.nextPage: {
      const newCurrentPage = state.currentPage + 1

      const currentItemFrom = state.currentItemTo + 1
      const currentItemTo = state.pageSize * newCurrentPage

      return {
        ...state,
        currentItemFrom,
        currentItemTo,
        currentPage: newCurrentPage,
        slicedInvitations: state.invitations.slice(
          currentItemFrom - 1,
          currentItemTo
        ),
      }
    }

    case TableViewActions.previousPage: {
      if (state.currentPage === 0) {
        return state
      }

      const currentItemFrom = state.currentItemFrom - state.pageSize
      const currentItemTo = state.currentItemFrom - 1

      return {
        ...state,
        currentItemFrom,
        currentItemTo,
        currentPage: state.currentPage - 1,
        slicedInvitations: state.invitations.slice(
          currentItemFrom - 1,
          currentItemTo
        ),
      }
    }

    case TableViewActions.updatePageSize: {
      return {
        ...state,
        pageSize: payload,
        currentItemTo: payload,
        currentItemFrom: 1,
        invitations: [],
        hasReachedLastPage: false,
        currentPage: 1,
      }
    }

    case TableViewActions.updateStatusFilters: {
      const { statements, filter } = payload

      return {
        ...state,
        statusFilter: filter,
        filterStatements: statements,
        currentItemTo: state.pageSize,
        currentItemFrom: 1,
        invitations: [],
        hasReachedLastPage: false,
        currentPage: 1,
      }
    }

    case TableViewActions.updateSearchTerm: {
      return { ...state, searchTerm: payload }
    }

    case TableViewActions.clearSearchTerm: {
      return {
        ...state,
        searchTerm: '',
        searchFilter: '',
        hasReachedLastPage: false,
        invitations: [],
        currentItemTo: state.pageSize,
        currentItemFrom: 1,
        currentPage: 1,
      }
    }

    case TableViewActions.submitSearchTerm: {
      return {
        ...state,
        searchFilter: payload,
        hasReachedLastPage: false,
        invitations: [],
        currentItemTo: state.pageSize,
        currentItemFrom: 1,
        currentPage: 1,
      }
    }

    case TableViewActions.handleInviteUpdate: {
      const index = state.invitations.findIndex(
        // @ts-ignore
        (val) => val?.id === payload.invite.id
      )

      const newinvitations =
        index !== -1
          ? [
              ...state.invitations.slice(0, index),
              payload.invite,
              ...state.invitations.slice(index + 1),
            ]
          : state.invitations

      return {
        ...state,
        invitations: newinvitations,
        slicedInvitations: newinvitations.slice(
          state.currentItemFrom - 1,
          state.currentItemTo
        ),
      }
    }

    default:
      throw new Error('Undefined action!')
  }
}

const jsonschema = (lineActions, handleConnect) => ({
  properties: {
    companyName: {
      title: <FormattedMessage id="onboarding-seller.table.companyName" />,
    },
    email: {
      title: <FormattedMessage id="onboarding-seller.table.email" />,
    },
    sellerAccountName: {
      title: <FormattedMessage id="onboarding-seller.table.sellerAccountName" />,
    },
    lastName: {
      title: <FormattedMessage id="onboarding-seller.table.lastName" />,
    },
    firstName: {
      title: <FormattedMessage id="onboarding-seller.table.firstName" />,
    },
    status: {
      title: <FormattedMessage id="onboarding-seller.table.status" />,
      cellRenderer: ({ cellData }) =>
        getTotalizerWithColorValue(cellData, cellData),
    },
    createdIn: {
      title: <FormattedMessage id="onboarding-seller.table.createdIn" />,
      cellRenderer: (tableValue) => {
        let createdInDate = tableValue.rowData.sellerCreatedIn ? tableValue.rowData.sellerCreatedIn : tableValue.rowData.createdIn
        return(
        <FormattedDate
          value={new Date(createdInDate)}
          month="long"
          day="2-digit"
          year="numeric"
          hour="numeric"
          minute="numeric"
        />
      )},
    },
    lastInteractionIn: {
      title: (
        <FormattedMessage id="onboarding-seller.table.lastInteractionIn" />
      ),
      cellRenderer: ({cellData}) =>  
      (
        <FormattedDate
          value={new Date(cellData)}
          month="long"
          day="2-digit"
          year="numeric"
          hour="numeric"
          minute="numeric"
        />
      ),
    },
    connectSeller: {
      title: <FormattedMessage id="onboarding-seller.table.actions" />,
      width: 70,
      cellRenderer: ({ rowData }: { rowData }) => {
        const { status, id, sellerAccountName } = rowData

        return (
          status === 'Approved' &&
          sellerAccountName &&
          rowData.connectedSellerObject?.paymentProviderMerchantId
        )
        ? (
          <ButtonWithIcon
            onClick={(e) => {
              e.stopPropagation()
              handleConnect(id)
            }}
            icon={<IconLink />}
            variation="tertiary"
          />
        )
        : undefined
      }
    },
    // name is required for the click event to work
    _VTEX_Table_Internal_lineActions: {
      // title and width are from the vtex.styleguide source code
      title: ' ',
      width: 70,
      cellRenderer: ({ rowData }: { rowData: SellerInvitation }) => {
        const { status } = rowData

        switch (status) {
          case 'Signed':
            return (
              <ActionMenu
                buttonProps={{
                  variation: 'tertiary',
                  icon: <IconOptionsDots />,
                }}
                options={lineActions
                  .filter((action) => !action.resend)
                  .map((action) => ({
                    ...action,
                    label: action.label({ rowData }),
                    onClick: () => action.onClick({ rowData }),
                  }))}
              />
            )

          case 'Prelead': {
            const action = lineActions.find((elem) => elem.resendPrelead)

            const options = [
              {
                label: action.label({ rowData }),
                onClick: () => {
                  action.onClick({ rowData })
                },
              },
            ]

            return (
              <ActionMenu
                buttonProps={{
                  variation: 'tertiary',
                  icon: <IconOptionsDots />,
                }}
                options={options}
              />
            )
          }

          case 'Approved': {
            const action = lineActions.find((elem) => elem.resend)

            const options = [
              {
                label: action.label({ rowData }),
                onClick: () => action.onClick({ rowData }),
              },
            ]

            return (
              <ActionMenu
                buttonProps={{
                  variation: 'tertiary',
                  icon: <IconOptionsDots />,
                }}
                options={options}
              />
            )
          }

          default:
            return undefined
        }
      },
    },
  },
})

function TableView() {
  const { showToast } = useContext(ToastContext)

  const handleShowToast = (message: string) => {
    showToast({
      message,
      duration: 10000,
    })
  }

  const handleConnect = async (id) => {
    try {
      setIsLoading(true)
      await axios.post(`${BASE_URL}/connectSeller/${id}`)
      setIsLoading(false)
      handleShowToast(
        intl.formatMessage({
          id: 'onboarding-seller.connect.succesfulConnect',
        })
      )
    } catch (e) {
      setIsLoading(false)
      handleShowToast(
        intl.formatMessage({
          id: 'onboarding-seller.connect.errorConnect',
        })
      )
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)
  const [totalizers, setTotalizers] = useState<TotalizersReponse[]>()

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const { modalData, setModalData, handleInviteResponse, lineActions } =
    useInviteResponse()

  // avoid recreating the schema, terrible things could happen >.<

  const intl = useIntl()

  const { navigate } = useRuntime()
  const [schema] = useState(jsonschema(lineActions, handleConnect))

  const {
    invitations,
    totalInvitations,
    currentPage,
    pageSize,
    hasReachedLastPage,
    filterStatements,
    currentItemFrom,
    currentItemTo,
    searchTerm,
    searchFilter,
    statusFilter,
  } = state

  useEffect(() => {
    async function getInvitations() {
      try {
        setIsLoading(true)
        const { data }: { data: PaginationResponse } = await axios.get(
          `${BASE_URL}/invitations`,
          {
            params: {
              page: currentPage,
              pageSize,
              where: statusFilter ?? '',
              keyword: searchFilter ?? '',
            },
          }
        )
        dispatch({ type: TableViewActions.loadPage, payload: data })
      } catch (e) {
        if(e.response.status !== 512) { // custom error to ignore "cannot find field 'status' in MD"
          setHasError(true)
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (!hasReachedLastPage && pageSize * currentPage > invitations.length) {
      // we need to load more data
      getInvitations()
    }
  }, [
    currentPage,
    pageSize,
    invitations,
    hasReachedLastPage,
    searchFilter,
    statusFilter,
  ])

  useEffect(() => {
    async function getTotalizers() {
      try {
        const { data } = await axios.get(`${BASE_URL}/invitations/totalizers`)
        const mappedData = data?.map((totalizer) => ({
          label: totalizer.label,
          value: getTotalizerWithColorValue(totalizer.label, totalizer.value),
        }))

        setTotalizers(mappedData)
      } finally {
        setIsLoading(false)
      }
    }

    getTotalizers()
  }, [])

  const handleInviteUpdate = async (message: string) => {
    const invite = await handleInviteResponse(message)

    dispatch({
      type: TableViewActions.handleInviteUpdate,
      payload: { invite },
    })
  }

  const handleFiltersChange = async (statements: Statement[] = []) => {
    const statusFilters = statements.find((e) => e.subject === 'status')

    if (!statusFilters) {
      dispatch({
        type: TableViewActions.updateStatusFilters,
        payload: { statements: [], filter: '' },
      })

      return
    }

    const filter = Object.keys(statusFilters.object)
      .filter((key) => statusFilters.object[key])
      .map((key) => `status=${key}`)
      .join(' OR ')

    dispatch({
      type: TableViewActions.updateStatusFilters,
      payload: { statements, filter },
    })
  }

  const renderFilterLabel = (st) => {
    if (!st || !st.object) {
      // you should treat empty object cases only for alwaysVisibleFilters

      return intl.formatMessage({
        id: 'onboarding-seller.table.filters.any',
      })
    }

    const keys = Object.keys(st.object)

    const isAllTrue = keys.every((key) => st.object[key])

    if (isAllTrue) {
      return intl.formatMessage({
        id: 'onboarding-seller.table.filters.all',
      })
    }

    const isAllFalse = keys.every((key) => !st.object[key])

    if (isAllFalse) {
      return intl.formatMessage({
        id: 'onboarding-seller.table.filters.none',
      })
    }

    return keys.filter((key) => st.object[key]).join(',')
  }

  return (
    <Layout
      fullWidth
      pageHeader={
        <PageHeader
          title={<FormattedMessage id="onboarding-seller.table.title" />}
        >
          <Button
            variation="primary"
            onClick={() =>
              navigate({
                to: '/admin/app/onboarding-seller/form',
              })
            }
          >
            <FormattedMessage id="onboarding-seller.table.newInviteFormButton" />
          </Button>
        </PageHeader>
      }
    >
      <PageBlock variation="full">
        <Table
          fullWidth
          schema={schema}
          items={state.slicedInvitations}
          totalizers={totalizers}
          loading={isLoading}
          emptyStateLabel={
            <React.Fragment>
              {isLoading ? (
                <Spinner/>
              ) : (
                <FormattedMessage id="onboarding-seller.table.emptyStateLabel" />
              )}
            </React.Fragment>
          }
          emptyStateChildren={
            <React.Fragment>
              {hasError && (
                <div className="mt5">
                  <Alert type="error">
                    <FormattedMessage id="onboarding-seller.table.error" />
                  </Alert>
                </div>
              )}
            </React.Fragment>
          }
          onRowClick={({ rowData }) => {
            window.open(`/admin/onboarding-seller/invitations/${rowData.id}`, '_blank');
          }}
          toolbar={{
            inputSearch: {
              value: searchTerm,
              placeholder: intl.formatMessage({
                id: 'onboarding-seller.table.search',
              }),
              onChange: (e) =>
                dispatch({
                  type: TableViewActions.updateSearchTerm,
                  payload: e.target.value,
                }),
              onClear: () =>
                dispatch({ type: TableViewActions.clearSearchTerm }),
              onSubmit: (e) =>
                dispatch({
                  type: TableViewActions.submitSearchTerm,
                  payload: e.target.value,
                }),
            },
            density: {
              buttonLabel: intl.formatMessage({
                id: 'onboarding-seller.table.density.buttonLabel',
              }),
              lowOptionLabel: (
                <FormattedMessage id="onboarding-seller.table.density.lowOptionLabel" />
              ),
              mediumOptionLabel: (
                <FormattedMessage id="onboarding-seller.table.density.mediumOptionLabel" />
              ),
              highOptionLabel: (
                <FormattedMessage id="onboarding-seller.table.density.highOptionLabel" />
              ),
            },
          }}
          pagination={{
            currentItemFrom,
            currentItemTo,
            totalItems: totalInvitations,
            rowsOptions: [10, 15, 25, 50],
            onNextClick: () => dispatch({ type: TableViewActions.nextPage }),
            onPrevClick: () =>
              dispatch({ type: TableViewActions.previousPage }),
            onRowsChange: (_, newPageSize) =>
              dispatch({
                type: TableViewActions.updatePageSize,
                payload: parseInt(newPageSize, 10),
              }),
            textShowRows: (
              <FormattedMessage id="onboarding-seller.table.pagination.textShowRows" />
            ),
            textOf: (
              <FormattedMessage id="onboarding-seller.table.pagination.textOf" />
            ),
          }}
          filters={{
            alwaysVisibleFilters: ['status'],
            statements: filterStatements,
            onChangeStatements: handleFiltersChange,
            collapseLeft: true,
            clearAllFiltersButtonLabel: intl.formatMessage({
              id: 'onboarding-seller.table.filters.clearAllFiltersButtonLabel',
            }),
            options: {
              status: {
                renderFilterLabel,
                label: intl.formatMessage({
                  id: 'onboarding-seller.table.status',
                }),
                verbs: [
                  {
                    label: intl.formatMessage({
                      id: 'onboarding-seller.table.filters.includes',
                    }),
                    value: 'includes',
                    object: (args) => <StatusSelector {...args} />,
                  },
                ],
              },
            },
          }}
        />
      </PageBlock>
      <InviteResponseModal
        isOpen={!!modalData}
        onClose={() => setModalData(undefined)}
        onSubmit={handleInviteUpdate}
        type={modalData?.type}
      />
    </Layout>
  )
}

function TableViewContainer() {
  return (
    <ToastProvider positioning="window">
      <TableView />
    </ToastProvider>
  )
}

export default TableViewContainer
