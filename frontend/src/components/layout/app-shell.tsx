import { ClipboardList, LayoutDashboard, RefreshCw } from "lucide-react"

import { Button } from "../ui/button"

type AppShellProps = {
  children: React.ReactNode
  onRefresh: () => void
  refreshing: boolean
}

export function AppShell({ children, onRefresh, refreshing }: AppShellProps) {
  return (
    <div className="min-h-screen text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white/95 lg:block">
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight">Request Hub</p>
            <p className="text-xs text-slate-500">Internal operations</p>
          </div>
        </div>
        <nav className="px-3 py-5">
          <div className="flex items-center gap-2 rounded-md border border-blue-100 bg-blue-50/80 px-3 py-2 text-sm font-medium text-blue-700">
            <LayoutDashboard className="h-4 w-4" />
            Requests
          </div>
          <div className="mt-6 rounded-lg border border-slate-100 bg-slate-50/70 p-3">
            <p className="text-xs font-medium text-slate-700">Phase 1 scope</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Requests, comments, filters, and summary counts.
            </p>
          </div>
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-sm font-semibold text-slate-950 lg:hidden">
                Request Hub
              </p>
              <p className="text-xs text-slate-500">Frontend connected to the Django API</p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={onRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={refreshing ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
              {refreshing ? "Refreshing" : "Refresh"}
            </Button>
          </div>
        </header>
        <main className="px-4 py-7 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
