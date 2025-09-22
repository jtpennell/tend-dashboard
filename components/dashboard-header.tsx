"use client"

import { Clock } from "lucide-react"

interface DashboardHeaderProps {
  lastUpdated: Date | null
  usingMockData: boolean
  error: string | null
  onRetry: () => void
}

export function DashboardHeader({ lastUpdated, usingMockData, error, onRetry }: DashboardHeaderProps) {
  return (
    <header className="border-b border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Tend Dashboard</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Last updated: {lastUpdated?.toLocaleTimeString() || "Never"}</span>
            </div>
            <div className={`h-2 w-2 rounded-full ${usingMockData ? "bg-warning" : "bg-success"} animate-pulse`} />
            {usingMockData && <span className="text-xs text-warning">Demo Mode</span>}
          </div>
        </div>
        {error && (
          <div className="mt-2 px-3 py-2 bg-warning/10 border border-warning/20 rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm text-warning">{error}</span>
              <button onClick={onRetry} className="text-xs text-warning hover:text-warning/80 underline">
                Retry API
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
