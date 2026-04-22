import type { RequestFilters, RequestPriority, RequestStatus } from "../../api/types"
import { Button } from "../ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

type RequestFiltersProps = {
  filters: RequestFilters
  onChange: (filters: RequestFilters) => void
}

const ALL = "all"

export function RequestFiltersBar({ filters, onChange }: RequestFiltersProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Select
        value={filters.status ?? ALL}
        onValueChange={(value) =>
          onChange({
            ...filters,
            status: value === ALL ? undefined : (value as RequestStatus),
          })
        }
      >
        <SelectTrigger className="sm:w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All statuses</SelectItem>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="in_progress">In progress</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.priority ?? ALL}
        onValueChange={(value) =>
          onChange({
            ...filters,
            priority: value === ALL ? undefined : (value as RequestPriority),
          })
        }
      >
        <SelectTrigger className="sm:w-40">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All priorities</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>

      <Button
        type="button"
        variant="ghost"
        onClick={() => onChange({})}
        disabled={!filters.status && !filters.priority}
      >
        Clear
      </Button>
    </div>
  )
}
