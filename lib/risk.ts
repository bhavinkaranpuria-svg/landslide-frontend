import type { RiskLevel, RoadStatus } from "./types"

// Raw hex values for Leaflet vector layers (can't use CSS vars there reliably)
export const riskHex: Record<RiskLevel, string> = {
  low: "#2fae72",
  moderate: "#e6b422",
  high: "#e8763a",
  severe: "#dc3838",
}

export const roadHex: Record<RoadStatus, string> = {
  open: "#2fae72",
  restricted: "#e6b422",
  blocked: "#dc3838",
}

// Tailwind token classes for badges/pills
export const riskBadge: Record<RiskLevel, string> = {
  low: "bg-risk-low/15 text-risk-low border-risk-low/30",
  moderate: "bg-risk-moderate/20 text-risk-moderate-foreground border-risk-moderate/40",
  high: "bg-risk-high/15 text-risk-high border-risk-high/30",
  severe: "bg-risk-severe/15 text-risk-severe border-risk-severe/30",
}

export const riskSolid: Record<RiskLevel, string> = {
  low: "bg-risk-low text-risk-low-foreground",
  moderate: "bg-risk-moderate text-risk-moderate-foreground",
  high: "bg-risk-high text-risk-high-foreground",
  severe: "bg-risk-severe text-risk-severe-foreground",
}

export const roadBadge: Record<RoadStatus, string> = {
  open: "bg-risk-low/15 text-risk-low border-risk-low/30",
  restricted: "bg-risk-moderate/20 text-risk-moderate-foreground border-risk-moderate/40",
  blocked: "bg-risk-severe/15 text-risk-severe border-risk-severe/30",
}

export const riskOrder: Record<RiskLevel, number> = {
  severe: 3,
  high: 2,
  moderate: 1,
  low: 0,
}
