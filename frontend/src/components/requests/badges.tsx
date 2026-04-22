import type { RequestPriority, RequestStatus } from "../../api/types"
import { Badge } from "../ui/badge"
import { priorityLabels, statusLabels } from "./format"

export function StatusBadge({ status }: { status: RequestStatus }) {
  const className =
    status === "open"
      ? "border-blue-100 bg-blue-50/80 text-blue-700"
      : status === "in_progress"
        ? "border-sky-100 bg-sky-50/80 text-sky-700"
        : "border-emerald-100 bg-emerald-50/80 text-emerald-700"

  return <Badge className={className}>{statusLabels[status]}</Badge>
}

export function PriorityBadge({ priority }: { priority: RequestPriority }) {
  const className =
    priority === "high"
      ? "border-rose-100 bg-rose-50/80 text-rose-700"
      : priority === "medium"
        ? "border-slate-200 bg-slate-50 text-slate-700"
        : "border-slate-100 bg-white text-slate-500"

  return <Badge className={className}>{priorityLabels[priority]}</Badge>
}
