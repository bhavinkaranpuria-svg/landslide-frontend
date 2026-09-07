"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { Layers, Route, MapPin, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { districts } from "@/lib/data"
import { riskHex, roadHex } from "@/lib/risk"
import type { RiskLevel, RoadStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const RiskMap = dynamic(() => import("./risk-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden />
    </div>
  ),
})

const riskLegend: { level: RiskLevel; label: string }[] = [
  { level: "low", label: "Low" },
  { level: "moderate", label: "Moderate" },
  { level: "high", label: "High" },
  { level: "severe", label: "Severe" },
]

const roadLegend: { status: RoadStatus; label: string }[] = [
  { status: "open", label: "Open" },
  { status: "restricted", label: "Restricted" },
  { status: "blocked", label: "Blocked" },
]

export function MapView({ initialDistrict }: { initialDistrict?: string }) {
  const { t } = useLanguage()
  const [focus, setFocus] = useState<string | undefined>(initialDistrict)
  const [showZones, setShowZones] = useState(true)
  const [showRoads, setShowRoads] = useState(true)
  const [showAssets, setShowAssets] = useState(true)

  const toggles = [
    { on: showZones, set: setShowZones, icon: Layers, label: "Risk zones" },
    { on: showRoads, set: setShowRoads, icon: Route, label: "Roads" },
    { on: showAssets, set: setShowAssets, icon: MapPin, label: "Assets" },
  ]

  return (
    <div className="flex flex-col gap-3">
      {/* District quick-select */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <button
          type="button"
          onClick={() => setFocus(undefined)}
          className={cn(
            "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            !focus ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card",
          )}
        >
          All region
        </button>
        {districts.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setFocus(d.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              focus === d.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card",
            )}
          >
            <span className="size-2 rounded-full" style={{ backgroundColor: riskHex[d.riskLevel] }} aria-hidden />
            {d.name}
          </button>
        ))}
      </div>

      {/* Map canvas */}
      <div className="relative h-[58vh] min-h-80 overflow-hidden rounded-2xl border border-border">
        <RiskMap focusDistrict={focus} showZones={showZones} showRoads={showRoads} showAssets={showAssets} />

        {/* Layer toggles */}
        <div className="absolute right-3 top-3 z-[400] flex flex-col gap-1.5">
          {toggles.map((tg) => {
            const Icon = tg.icon
            return (
              <button
                key={tg.label}
                type="button"
                onClick={() => tg.set((v) => !v)}
                aria-pressed={tg.on}
                title={tg.label}
                className={cn(
                  "flex size-9 items-center justify-center rounded-lg border shadow-sm backdrop-blur transition-colors",
                  tg.on
                    ? "border-primary/40 bg-primary text-primary-foreground"
                    : "border-border bg-card/90 text-muted-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden />
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 z-[400] rounded-xl border border-border bg-card/90 p-2.5 backdrop-blur">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Risk heatmap
          </p>
          <div className="flex flex-col gap-1">
            {riskLegend.map((r) => (
              <div key={r.level} className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: riskHex[r.level] }} aria-hidden />
                <span className="text-[11px]">{t(r.level)}</span>
              </div>
            ))}
          </div>
          <p className="mb-1 mt-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {t("roadStatus")}
          </p>
          <div className="flex flex-col gap-1">
            {roadLegend.map((r) => (
              <div key={r.status} className="flex items-center gap-1.5">
                <span className="h-1 w-3 rounded" style={{ backgroundColor: roadHex[r.status] }} aria-hidden />
                <span className="text-[11px]">{t(r.status)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="px-1 text-[11px] leading-relaxed text-muted-foreground">
        GIS layers overlay AI-predicted risk zones, live road connectivity, and vulnerable infrastructure. Tap a
        district to zoom, or use the layer toggles to focus the view.
      </p>
    </div>
  )
}
