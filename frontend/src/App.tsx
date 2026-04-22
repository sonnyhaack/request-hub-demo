import { useCallback, useEffect, useState } from "react"

import {
  createComment,
  createRequest,
  getRequest,
  getRequests,
  getSummary,
  patchRequest,
} from "./api/client"
import type {
  CreateCommentInput,
  CreateRequestInput,
  PatchRequestInput,
  RequestDetail,
  RequestFilters,
  RequestListItem,
  RequestSummary,
} from "./api/types"
import { AppShell } from "./components/layout/app-shell"
import { CreateRequestForm } from "./components/requests/create-request-form"
import { RequestDetail as RequestDetailPanel } from "./components/requests/request-detail"
import { RequestTable } from "./components/requests/request-table"
import { SummaryCards } from "./components/requests/summary-cards"

function App() {
  const [requests, setRequests] = useState<RequestListItem[]>([])
  const [summary, setSummary] = useState<RequestSummary | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<RequestDetail | null>(null)
  const [filters, setFilters] = useState<RequestFilters>({})
  const [loadingList, setLoadingList] = useState(true)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadList = useCallback(async () => {
    setLoadingList(true)
    setError(null)
    try {
      const [requestData, summaryData] = await Promise.all([
        getRequests(filters),
        getSummary(),
      ])
      setRequests(requestData)
      setSummary(summaryData)
      setSelectedId((currentId) => currentId ?? requestData[0]?.id ?? null)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to load requests.")
    } finally {
      setLoadingList(false)
    }
  }, [filters])

  const loadDetail = useCallback(async (id: number) => {
    setLoadingDetail(true)
    setError(null)
    try {
      setSelectedRequest(await getRequest(id))
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to load request.")
    } finally {
      setLoadingDetail(false)
    }
  }, [])

  useEffect(() => {
    void loadList()
  }, [loadList])

  useEffect(() => {
    if (selectedId) {
      void loadDetail(selectedId)
    } else {
      setSelectedRequest(null)
    }
  }, [loadDetail, selectedId])

  async function refresh() {
    setRefreshing(true)
    try {
      await loadList()
      if (selectedId) {
        await loadDetail(selectedId)
      }
    } finally {
      setRefreshing(false)
    }
  }

  async function handleCreate(input: CreateRequestInput) {
    const created = await createRequest(input)
    setSelectedId(created.id)
    await loadList()
  }

  async function handleUpdate(id: number, input: PatchRequestInput) {
    const currentRequest = requests.find((request) => request.id === id)
    const updated = await patchRequest(id, input)

    setRequests((currentRequests) => {
      const nextRequests = currentRequests.map((request) =>
        request.id === id ? updated : request,
      )

      return matchesFilters(updated, filters)
        ? nextRequests
        : nextRequests.filter((request) => request.id !== id)
    })

    setSelectedRequest((currentRequest) =>
      currentRequest?.id === id ? { ...currentRequest, ...updated } : currentRequest,
    )

    if (currentRequest && currentRequest.status !== updated.status) {
      setSummary((currentSummary) =>
        currentSummary
          ? {
              ...currentSummary,
              [currentRequest.status]: Math.max(
                currentSummary[currentRequest.status] - 1,
                0,
              ),
              [updated.status]: currentSummary[updated.status] + 1,
            }
          : currentSummary,
      )
    }
  }

  async function handleComment(id: number, input: CreateCommentInput) {
    await createComment(id, input)
    await loadDetail(id)
  }

  return (
    <AppShell onRefresh={refresh} refreshing={refreshing}>
      <div className="mx-auto max-w-[1500px] space-y-5">
        <div className="rounded-lg border border-slate-200/80 bg-white px-5 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-blue-700">
                Request Hub Demo
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                Request management
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Track internal requests, priorities, and discussion.
              </p>
            </div>
            <div className="w-full xl:max-w-xl">
              <SummaryCards summary={summary} loading={loadingList} compact />
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-md border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
            {error}
          </div>
        ) : null}

        <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_460px]">
          <div className="space-y-6">
            <RequestTable
              requests={requests}
              selectedId={selectedId}
              loading={loadingList}
              filters={filters}
              onFiltersChange={(nextFilters) => {
                setFilters(nextFilters)
                setSelectedId(null)
              }}
              onSelect={(request) => setSelectedId(request.id)}
            />
            <CreateRequestForm onCreate={handleCreate} />
          </div>
          <RequestDetailPanel
            request={selectedRequest}
            loading={loadingDetail}
            onUpdate={handleUpdate}
            onComment={handleComment}
          />
        </div>
      </div>
    </AppShell>
  )
}

function matchesFilters(request: RequestListItem, filters: RequestFilters) {
  return (
    (!filters.status || request.status === filters.status) &&
    (!filters.priority || request.priority === filters.priority)
  )
}

export default App
