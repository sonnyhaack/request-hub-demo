import type { RequestListItem } from "../../api/types"
import { cn } from "../../lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { PriorityBadge, StatusBadge } from "./badges"
import { formatDate } from "./format"
import { RequestFiltersBar } from "./request-filters"
import type { RequestFilters } from "../../api/types"

type RequestTableProps = {
  requests: RequestListItem[]
  selectedId: number | null
  loading: boolean
  filters: RequestFilters
  onFiltersChange: (filters: RequestFilters) => void
  onSelect: (request: RequestListItem) => void
}

export function RequestTable({
  requests,
  selectedId,
  loading,
  filters,
  onFiltersChange,
  onSelect,
}: RequestTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Requests</CardTitle>
          <p className="mt-1 text-xs text-slate-500">Sorted by newest first</p>
        </div>
        <RequestFiltersBar filters={filters} onChange={onFiltersChange} />
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-28 text-center text-slate-500">
                    Loading requests...
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-28 text-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-700">No requests found</p>
                      <p className="text-xs text-slate-500">
                        Clear filters or create a new request.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow
                    key={request.id}
                    className={cn(
                      "cursor-pointer border-l-2 border-l-transparent hover:bg-slate-50/80",
                      selectedId === request.id && "border-l-blue-600 bg-blue-50/70",
                    )}
                    onClick={() => onSelect(request)}
                  >
                    <TableCell className="min-w-64">
                      <p className="font-medium text-slate-950">{request.title}</p>
                      <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                        {request.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={request.status} />
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={request.priority} />
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {request.requester_name ?? "Not provided"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-slate-500">
                      {formatDate(request.created_at)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
