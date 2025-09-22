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

export async function fetchWaitTimes(): Promise<{
  data: WaitTimeData[]
  usingMockData: boolean
  error: string | null
  lastUpdate?: string
}> {
  try {
    const response = await fetch("/api/wait-times", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (err) {
    return {
      data: [],
      usingMockData: true,
      error: "Failed to fetch wait times",
    }
  }
}

export function calculateSummary(data: WaitTimeData[]) {
  if (data.length === 0) return null;

  const avgWait = data.reduce((sum, clinic) => sum + clinic.waitTime, 0) / data.length;
  const longest = data.reduce(
    (max, clinic) => (clinic.waitTime > max.time ? { clinic: clinic.clinic, time: clinic.waitTime } : max),
    { clinic: "", time: 0 },
  );
  const shortest = data.reduce(
    (min, clinic) => (clinic.waitTime < min.time ? { clinic: clinic.clinic, time: clinic.waitTime } : min),
    { clinic: "", time: Number.POSITIVE_INFINITY },
  );

  const formatTime = (minutes: number) => {
    if (minutes >= 1440) {
      const days = Math.floor(minutes / 1440);
      return `${days} ${days === 1 ? "day" : "days"}`;
    } else if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      return `${hours} ${hours === 1 ? "hour" : "hours"}`;
    } else {
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
    }
  };

  return {
    averageWaitTime: formatTime(Math.round(avgWait)),
    longestWait: { ...longest, time: formatTime(longest.time) },
    shortestWait: { ...shortest, time: formatTime(shortest.time) },
  };
}
