export type RiskLevel = "low" | "moderate" | "high" | "severe"

export type RoadStatus = "open" | "restricted" | "blocked"

export type LatLng = [number, number]

export interface District {
  id: string
  name: string
  state: string
  center: LatLng
  riskLevel: RiskLevel
  riskScore: number // 0-100, model confidence-weighted risk index
  population: number
  trend: "up" | "down" | "flat"
  rainfall24h: number // mm
  soilMoisture: number // % saturation
  slope: number // avg degrees
}

export interface RiskZone {
  id: string
  districtId: string
  center: LatLng
  radius: number // meters
  riskLevel: RiskLevel
  riskScore: number
}

export interface Road {
  id: string
  name: string
  path: LatLng[]
  status: RoadStatus
  note: string
}

export type AssetType = "village" | "hospital" | "school" | "bridge" | "shelter"

export interface Infrastructure {
  id: string
  name: string
  type: AssetType
  position: LatLng
  riskLevel: RiskLevel
  people?: number
}

export type AlertChannel = "sms" | "app" | "siren"

export interface AlertItem {
  id: string
  title: string
  district: string
  level: RiskLevel
  time: string // ISO
  message: string
  channels: AlertChannel[]
  audiences: string[]
  acknowledged: boolean
}

export interface ForecastPoint {
  label: string // e.g. "Now", "+6h"
  rainfall: number // mm
  risk: number // 0-100
}

export type ReportCategory = "crack" | "slope-movement" | "blocked-road" | "water-seepage" | "other"

export type ReportStatus = "queued" | "syncing" | "synced"

export interface FieldReport {
  id: string
  category: ReportCategory
  description: string
  location: LatLng
  place: string
  reporter: string
  time: string
  severity: RiskLevel
  status: ReportStatus
  photo: string // local asset path
}
