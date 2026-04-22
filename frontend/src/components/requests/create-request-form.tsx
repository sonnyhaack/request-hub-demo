import { useState } from "react"

import type { CreateRequestInput, RequestPriority } from "../../api/types"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Textarea } from "../ui/textarea"

type CreateRequestFormProps = {
  onCreate: (input: CreateRequestInput) => Promise<void>
}

export function CreateRequestForm({ onCreate }: CreateRequestFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [requesterName, setRequesterName] = useState("")
  const [priority, setPriority] = useState<RequestPriority>("medium")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await onCreate({
        title,
        description,
        requester_name: requesterName,
        priority,
      })
      setTitle("")
      setDescription("")
      setRequesterName("")
      setPriority("medium")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to create request.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="bg-white/80">
      <CardHeader className="py-4">
        <CardTitle>Create request</CardTitle>
        <p className="mt-1 text-xs text-slate-500">New requests start open with medium priority</p>
      </CardHeader>
      <CardContent className="py-4">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
            <div className="space-y-1.5">
              <Label htmlFor="request-title">Title</Label>
              <Input
                id="request-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Short request title"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="request-description">Description</Label>
              <Textarea
                id="request-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the request"
                required
                className="min-h-9 lg:h-9"
              />
            </div>
          </div>
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_auto] lg:items-end">
            <div className="space-y-1.5">
              <Label htmlFor="requester-name">Requester</Label>
              <Input
                id="requester-name"
                value={requesterName}
                onChange={(event) => setRequesterName(event.target.value)}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as RequestPriority)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={submitting} className="lg:w-auto">
              {submitting ? "Creating..." : "Create request"}
            </Button>
          </div>
          {error ? (
            <div className="rounded-md border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
        </form>
      </CardContent>
    </Card>
  )
}
