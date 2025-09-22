"use client"

import { useState, useEffect } from "react"
import { Activity } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { SummaryCards } from "@/components/summary-cards"
import { ClinicCard } from "@/components/clinic-card"
import { fetchWaitTimes, calculateSummary } from "@/lib/api"

interface WaitTimeData {
  clinic: string
  waitTime: number
  waitTimeDisplay: string
  queueLength?: number
  status: "short" | "moderate" | "long"
  patientsInPastFourHours?: string
  patientsInPastTwelveHours?: string
  patientsInPastTwentyFourHours?: string
}

interface SummaryStats {
  averageWaitTime: number
  longestWait: { clinic: string; time: number }
  shortestWait: { clinic: string; time: number }
}

export default function ClinicDashboard() {
  const [waitTimes, setWaitTimes] = useState<WaitTimeData[]>([])
  const [summary, setSummary] = useState<SummaryStats | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [lastApiUpdate, setLastApiUpdate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingMockData, setUsingMockData] = useState(false)

  const loadWaitTimes = async () => {
    try {
      setError(null)
      const result = await fetchWaitTimes()

      setWaitTimes(result.data)
      setSummary(calculateSummary(result.data))
      setUsingMockData(result.usingMockData)
      setError(result.error)
      setLastUpdated(new Date())
      if (result.lastUpdate) {
        setLastApiUpdate(result.lastUpdate)
      }
      setLoading(false)
    } catch (err) {
      setError("Failed to load data")
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWaitTimes()

    const interval = setInterval(loadWaitTimes, 60000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="h-5 w-5 animate-pulse" />
              <span>Loading clinic data...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader lastUpdated={lastUpdated} usingMockData={usingMockData} error={error} onRetry={loadWaitTimes} />

      <main className="max-w-7xl mx-auto p-6">
        {summary && <SummaryCards summary={summary} />}

        {lastApiUpdate && !usingMockData && (
          <div className="mb-6 text-center">
            <span className="text-sm text-muted-foreground">
              API Last Updated: {new Date(lastApiUpdate).toLocaleString()}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {waitTimes.map((clinic, index) => (
            <ClinicCard key={index} clinic={clinic} />
          ))}
        </div>

        {waitTimes.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">No clinic data available</div>
          </div>
        )}
      </main>
    </div>
  )
}
