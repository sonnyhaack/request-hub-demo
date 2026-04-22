import type { RequestPriority, RequestStatus } from "../../api/types"

export const statusLabels: Record<RequestStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  closed: "Closed",
}

export const priorityLabels: Record<RequestPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}
