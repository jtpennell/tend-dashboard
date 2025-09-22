import { NextResponse } from "next/server"

interface ApiWaitTime {
  id: string
  name: string
  waitTimeInMinutes: number
  waitTimeForDisplay: string
  patientsInQueue?: number
  patientsInPastFourHours?: string
  patientsInPastTwelveHours?: string
  patientsInPastTwentyFourHours?: string
}

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

const mockData: WaitTimeData[] = [
  { clinic: "Auckland Central", waitTime: 8, waitTimeDisplay: "in 8 minutes", queueLength: 3, status: "short" },
  { clinic: "Wellington CBD", waitTime: 15, waitTimeDisplay: "in 15 minutes", queueLength: 7, status: "moderate" },
  { clinic: "Christchurch Main", waitTime: 35, waitTimeDisplay: "in 35 minutes", queueLength: 12, status: "long" },
  { clinic: "Hamilton East", waitTime: 22, waitTimeDisplay: "in 22 minutes", queueLength: 9, status: "moderate" },
  { clinic: "Tauranga Bay", waitTime: 5, waitTimeDisplay: "in 5 minutes", queueLength: 2, status: "short" },
  { clinic: "Dunedin Central", waitTime: 18, waitTimeDisplay: "in 18 minutes", queueLength: 6, status: "moderate" },
  { clinic: "Online Now", waitTime: 2, waitTimeDisplay: "in 2 minutes", queueLength: 15, status: "short" },
  { clinic: "Medical Certificate", waitTime: 12, waitTimeDisplay: "in 12 minutes", queueLength: 4, status: "moderate" },
]

export async function GET() {
  try {
    const apiKey = process.env.API_KEY ?? 'JT_Pennell'

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const headers: HeadersInit = {
      Accept: "application/json",
    }

    if (apiKey) {
      headers["x-api-key"] = apiKey
    }

    const response = await fetch("https://api.tend.nz/recruitment/clinical-wait-time", {
      signal: controller.signal,
      headers,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const apiResponse = await response.json()

    const transformedData: WaitTimeData[] = apiResponse.data.waitTimes.map((item: ApiWaitTime) => ({
      clinic: item.name,
      waitTime: item.waitTimeInMinutes,
      waitTimeDisplay: item.waitTimeForDisplay,
      queueLength: item.patientsInQueue,
      status: item.waitTimeInMinutes < 30 ? "short" : item.waitTimeInMinutes > 120 ? "long" : "moderate",
      patientsInPastFourHours: item.patientsInPastFourHours,
      patientsInPastTwelveHours: item.patientsInPastTwelveHours,
      patientsInPastTwentyFourHours: item.patientsInPastTwentyFourHours,
    }))

    return NextResponse.json({
      data: transformedData,
      usingMockData: false,
      error: null,
      lastUpdate: apiResponse.data.lastUpdate,
    })
  } catch (err) {
    return NextResponse.json({
      data: mockData,
      usingMockData: true,
      error: process.env.API_KEY ?? 'JT_Pennell'
        ? "API unavailable - using demo data"
        : "API key required - using demo data",
    })
  }
}
