"use client"

import { useEffect, useState } from "react"
import { fetchDistricts } from "./api"
import { districts as mockDistricts } from "./data"
import type { District } from "./types"

/**
 * Renders instantly with the existing mock data (no loading flicker),
 * then swaps in live data from the backend once it arrives. If the
 * backend is unreachable, it silently keeps the mock data — same
 * behavior as the app's existing offline handling.
 */
export function useDistricts() {
  const [districts, setDistricts] = useState<District[]>(mockDistricts)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    let cancelled = false

    fetchDistricts().then((data) => {
      if (!cancelled && data && data.length > 0) {
        setDistricts(data)
        setIsLive(true)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  return { districts, isLive }
}
