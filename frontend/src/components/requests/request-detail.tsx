import { useEffect, useState } from "react"

import type {
  CreateCommentInput,
  PatchRequestInput,
  RequestDetail as RequestDetailType,
  RequestPriority,
  RequestStatus,
} from "../../api/types"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../ui/select"
import { Textarea } from "../ui/textarea"
import { PriorityBadge, StatusBadge } from "./badges"
import { formatDate, priorityLabels, statusLabels } from "./format"

type RequestDetailProps = {
  request: RequestDetailType | null
  loading: boolean
  onUpdate: (id: number, input: PatchRequestInput) => Promise<void>
  onComment: (id: number, input: CreateCommentInput) => Promise<void>
}

export function RequestDetail({
  request,
  loading,
  onUpdate,
  onComment,
}: RequestDetailProps) {
  const [status, setStatus] = useState<RequestStatus>("open")
  const [priority, setPriority] = useState<RequestPriority>("medium")
  const [authorName, setAuthorName] = useState("")
  const [body, setBody] = useState("")
  const [saving, setSaving] = useState(false)
  const [commenting, setCommenting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (request) {
      setStatus(request.status)
      setPriority(request.priority)
      setError(null)
    }
  }, [request])

  if (loading && !request) {
    return (
      <Card>
        <CardContent className="flex h-72 items-center justify-center text-sm text-slate-500">
          Loading request detail...
        </CardContent>
      </Card>
    )
  }

  if (!request) {
    return (
      <Card>
        <CardContent className="flex h-72 items-center justify-center text-center">
          <div className="max-w-64 space-y-1">
            <p className="text-sm font-medium text-slate-700">No request selected</p>
            <p className="text-sm text-slate-500">
              Select a row to inspect status, priority, and comments.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  async function updateRequest(nextStatus: RequestStatus, nextPriority: RequestPriority) {
    if (!request) return
    setSaving(true)
    setError(null)

    try {
      await onUpdate(request.id, { status: nextStatus, priority: nextPriority })
    } catch (error) {
      setStatus(request.status)
      setPriority(request.priority)
      setError(error instanceof Error ? error.message : "Unable to update request.")
    } finally {
      setSaving(false)
    }
  }

  function handleStatusChange(value: string) {
    const nextStatus = value as RequestStatus
    setStatus(nextStatus)
    void updateRequest(nextStatus, priority)
  }

  function handlePriorityChange(value: string) {
    const nextPriority = value as RequestPriority
    setPriority(nextPriority)
    void updateRequest(status, nextPriority)
  }

  async function handleComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!request) return
    setCommenting(true)
    setError(null)

    try {
      await onComment(request.id, { author_name: authorName, body })
      setAuthorName("")
      setBody("")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to add comment.")
    } finally {
      setCommenting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>{request.title}</CardTitle>
              {loading ? (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                  Loading detail
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Created {formatDate(request.created_at)}
            </p>
          </div>
          <div className="flex gap-2">
            <StatusBadge status={request.status} />
            <PriorityBadge priority={request.priority} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm leading-6 text-slate-700">{request.description}</p>
          <p className="mt-3 text-xs text-slate-500">
            Requester: {request.requester_name ?? "Not provided"}
          </p>
        </div>

        <div className="space-y-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={handleStatusChange} disabled={saving}>
                <SelectTrigger>
                  <span>{statusLabels[status]}</span>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={handlePriorityChange} disabled={saving}>
                <SelectTrigger>
                  <span>{priorityLabels[priority]}</span>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(priorityLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            {saving ? "Saving changes..." : "Changes save when selected."}
          </p>
        </div>

        <div className="border-t border-slate-100 pt-5">
          <h3 className="text-sm font-semibold text-slate-950">Comments</h3>
          <div className="mt-3 space-y-3">
            {request.comments.length === 0 ? (
              <div className="rounded-md border border-dashed border-slate-200 bg-slate-50/70 px-3 py-4 text-sm text-slate-500">
                No comments yet.
              </div>
            ) : (
              request.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-md border border-slate-100 bg-slate-50/80 px-3 py-2.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-medium text-slate-700">
                      {comment.author_name ?? "Anonymous"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDate(comment.created_at)}
                    </p>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{comment.body}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <form className="space-y-3 border-t border-slate-100 pt-5" onSubmit={handleComment}>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="comment-author">Author</Label>
              <Input
                id="comment-author"
                value={authorName}
                onChange={(event) => setAuthorName(event.target.value)}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="comment-body">Comment</Label>
              <Textarea
                id="comment-body"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Add a short update"
                required
                className="min-h-24"
              />
            </div>
          </div>
          {error ? (
            <div className="rounded-md border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
          <div className="flex justify-end">
            <Button type="submit" disabled={commenting}>
              {commenting ? "Adding..." : "Add comment"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
