export type RequestStatus = "open" | "in_progress" | "closed"
export type RequestPriority = "low" | "medium" | "high"

export type RequestSummary = Record<RequestStatus, number>

export type Comment = {
  id: number
  request: number
  author_name: string | null
  body: string
  created_at: string
}

export type RequestListItem = {
  id: number
  title: string
  description: string
  requester_name: string | null
  status: RequestStatus
  priority: RequestPriority
  created_at: string
  updated_at: string
}

export type RequestDetail = RequestListItem & {
  comments: Comment[]
}

export type RequestFilters = {
  status?: RequestStatus
  priority?: RequestPriority
}

export type CreateRequestInput = {
  title: string
  description: string
  requester_name?: string
  status?: RequestStatus
  priority?: RequestPriority
}

export type PatchRequestInput = {
  status?: RequestStatus
  priority?: RequestPriority
}

export type CreateCommentInput = {
  author_name?: string
  body: string
}
