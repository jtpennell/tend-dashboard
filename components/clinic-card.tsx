"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

interface ClinicCardProps {
  clinic: WaitTimeData
}

export function ClinicCard({ clinic }: ClinicCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "short":
        return "text-success"
      case "moderate":
        return "text-warning"
      case "long":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case "short":
        return "bg-success/10 border-success/20"
      case "moderate":
        return "bg-warning/10 border-warning/20"
      case "long":
        return "bg-destructive/10 border-destructive/20"
      default:
        return "bg-muted/10"
    }
  }

  return (
    <Card className={`bg-card border transition-all hover:shadow-lg ${getStatusBg(clinic.status)}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium text-foreground text-balance">{clinic.clinic}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Wait Time</span>
            <div className={`text-2xl font-bold ${getStatusColor(clinic.status)}`}>{clinic.waitTimeDisplay}</div>
          </div>

          {clinic.queueLength !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Queue Length</span>
              <span className="text-sm font-medium text-foreground">{clinic.queueLength} patients</span>
            </div>
          )}

          {clinic.patientsInPastTwentyFourHours && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">24h Patients</span>
              <span className="text-sm font-medium text-foreground">{clinic.patientsInPastTwentyFourHours}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                clinic.status === "short"
                  ? "bg-success"
                  : clinic.status === "moderate"
                    ? "bg-warning"
                    : "bg-destructive"
              }`}
            />
            <span className={`text-xs font-medium ${getStatusColor(clinic.status)}`}>
              {clinic.status === "short" ? "Short Wait" : clinic.status === "moderate" ? "Moderate Wait" : "Long Wait"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
