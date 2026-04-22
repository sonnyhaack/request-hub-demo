import type {
  CreateCommentInput,
  CreateRequestInput,
  PatchRequestInput,
  RequestDetail,
  RequestFilters,
  RequestListItem,
  RequestSummary,
} from "./types"

const API_BASE = "/api"

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  })

  if (!response.ok) {
    let message = "The request could not be completed."
    try {
      const data = await response.json()
      message = formatApiError(data)
    } catch {
      message = response.statusText || message
    }
    throw new Error(message)
  }

  return response.json() as Promise<T>
}

function formatApiError(data: unknown): string {
  if (data && typeof data === "object") {
    const entries = Object.entries(data as Record<string, unknown>)
    if (entries.length > 0) {
      return entries
        .map(([field, value]) => {
          const detail = Array.isArray(value) ? value.join(" ") : String(value)
          return field === "detail" ? detail : `${field}: ${detail}`
        })
        .join(" ")
    }
  }
  return "The request could not be completed."
}

export async function getRequests(filters: RequestFilters) {
  const params = new URLSearchParams()
  if (filters.status) params.set("status", filters.status)
  if (filters.priority) params.set("priority", filters.priority)

  const query = params.toString()
  return request<RequestListItem[]>(`/requests/${query ? `?${query}` : ""}`)
}

export function getRequest(id: number) {
  return request<RequestDetail>(`/requests/${id}/`)
}

export function createRequest(data: CreateRequestInput) {
  return request<RequestListItem>("/requests/", {
    method: "POST",
    body: JSON.stringify(compactPayload(data)),
  })
}

export function patchRequest(id: number, data: PatchRequestInput) {
  return request<RequestListItem>(`/requests/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export function createComment(id: number, data: CreateCommentInput) {
  return request<Comment>(`/requests/${id}/comments/`, {
    method: "POST",
    body: JSON.stringify(compactPayload(data)),
  })
}

export function getSummary() {
  return request<RequestSummary>("/summary/")
}

function compactPayload<T extends Record<string, unknown>>(data: T) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined && value !== ""),
  )
}
