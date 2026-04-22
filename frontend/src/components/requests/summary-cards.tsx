import { CheckCircle2, Clock3, Inbox } from "lucide-react"

import type { RequestSummary } from "../../api/types"
import { Card, CardContent } from "../ui/card"

type SummaryCardsProps = {
  summary: RequestSummary | null
  loading: boolean
  compact?: boolean
}

const cards = [
  { key: "open" as const, label: "Open", icon: Inbox },
  { key: "in_progress" as const, label: "In progress", icon: Clock3 },
  { key: "closed" as const, label: "Closed", icon: CheckCircle2 },
]

export function SummaryCards({ summary, loading, compact = false }: SummaryCardsProps) {
  return (
    <div className={compact ? "grid gap-3 sm:grid-cols-3" : "grid gap-4 sm:grid-cols-3"}>
      {cards.map((item) => {
        const Icon = item.icon
        return (
          <Card key={item.key} className="bg-white/95">
            <CardContent className={compact ? "flex items-center justify-between p-3" : "flex items-center justify-between p-5"}>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {item.label}
                </p>
                <p className={compact ? "mt-1 text-2xl font-semibold tracking-tight text-slate-950" : "mt-2 text-3xl font-semibold tracking-tight text-slate-950"}>
                  {loading ? "-" : summary?.[item.key] ?? 0}
                </p>
              </div>
              <div className={compact ? "flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-blue-600" : "flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-blue-600"}>
                <Icon className={compact ? "h-4 w-4" : "h-5 w-5"} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
