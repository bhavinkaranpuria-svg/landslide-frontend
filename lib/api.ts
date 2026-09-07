import type { District } from "./types"

// Set NEXT_PUBLIC_API_URL in .env.local once the backend is deployed.
// Falls back to your local backend for development.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

/**
 * Fetches live districts from the backend. Returns null on any failure
 * (backend offline, network error, etc.) so callers can fall back to
 * cached/mock data instead of crashing the dashboard.
 */
export async function fetchDistricts(): Promise<District[] | null> {
  try {
    const res = await fetch(`${API_URL}/districts`, { cache: "no-store" })
    if (!res.ok) return null
    const data = await res.json()
    return data as District[]
  } catch {
    return null
  }
}
