"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import {
  Camera,
  MapPin,
  Crosshair,
  Check,
  CloudOff,
  Clock,
  RefreshCw,
  Split,
  MoveDiagonal,
  Ban,
  Droplet,
  CircleHelp,
} from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { useOffline } from "@/lib/offline"
import { initialReports } from "@/lib/data"
import { riskHex } from "@/lib/risk"
import type { FieldReport, ReportCategory, RiskLevel } from "@/lib/types"
import { cn } from "@/lib/utils"

const categories: { id: ReportCategory; label: string; icon: typeof Split }[] = [
  { id: "crack", label: "Crack", icon: Split },
  { id: "slope-movement", label: "Slope movement", icon: MoveDiagonal },
  { id: "blocked-road", label: "Blocked road", icon: Ban },
  { id: "water-seepage", label: "Water seepage", icon: Droplet },
  { id: "other", label: "Other", icon: CircleHelp },
]

const severities: RiskLevel[] = ["low", "moderate", "high", "severe"]

function timeAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.round(hrs / 24)}d ago`
}

export function ReportFlow() {
  const { t } = useLanguage()
  const { online, addPending } = useOffline()
  const fileRef = useRef<HTMLInputElement>(null)

  const [reports, setReports] = useState<FieldReport[]>(initialReports)
  const [category, setCategory] = useState<ReportCategory>("crack")
  const [severity, setSeverity] = useState<RiskLevel>("moderate")
  const [description, setDescription] = useState("")
  const [photo, setPhoto] = useState<string | null>(null)
  const [coords, setCoords] = useState<[number, number] | null>([27.33, 88.61])
  const [locating, setLocating] = useState(false)
  const [justSubmitted, setJustSubmitted] = useState(false)

  const capturePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setPhoto(URL.createObjectURL(file))
  }

  const getLocation = () => {
    setLocating(true)
    // Simulate a GPS fix with slight jitter around the region
    setTimeout(() => {
      setCoords([27.33 + (Math.random() - 0.5) * 0.4, 88.55 + (Math.random() - 0.5) * 0.4])
      setLocating(false)
    }, 900)
  }

  const submit = () => {
    if (!coords) return
    const newReport: FieldReport = {
      id: `r${Date.now()}`,
      category,
      description: description || "(no description provided)",
      location: coords,
      place: "Current location",
      reporter: "You (Field)",
      time: new Date().toISOString(),
      severity,
      status: online ? "synced" : "queued",
      photo: photo ?? "/reports/crack-road.png",
    }
    setReports((prev) => [newReport, ...prev])
    if (!online) addPending()

    // reset
    setDescription("")
    setPhoto(null)
    setCategory("crack")
    setSeverity("moderate")
    setJustSubmitted(true)
    setTimeout(() => setJustSubmitted(false), 2500)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Composer */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="font-display text-sm font-semibold">{t("newReport")}</h2>

        {/* Photo capture */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          capture="environment"
          onChange={capturePhoto}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="relative mt-3 flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-background text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          {photo ? (
            <Image src={photo || "/placeholder.svg"} alt="Captured report" fill className="object-cover" unoptimized />
          ) : (
            <span className="flex flex-col items-center gap-1.5">
              <Camera className="size-7" aria-hidden />
              <span className="text-sm font-medium">Capture photo / video</span>
              <span className="text-[11px]">Geo-tag is attached automatically</span>
            </span>
          )}
        </button>

        {/* Category */}
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Category</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const Icon = c.icon
              const active = category === c.id
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background",
                  )}
                >
                  <Icon className="size-3.5" aria-hidden />
                  {c.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Severity */}
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Observed severity</p>
          <div className="grid grid-cols-4 gap-2">
            {severities.map((s) => {
              const active = severity === s
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeverity(s)}
                  className={cn(
                    "rounded-lg border py-2 text-xs font-semibold capitalize transition-all",
                    active ? "text-white" : "border-border bg-background text-muted-foreground",
                  )}
                  style={active ? { backgroundColor: riskHex[s], borderColor: riskHex[s] } : undefined}
                >
                  {t(s)}
                </button>
              )
            })}
          </div>
        </div>

        {/* Description */}
        <div className="mt-4">
          <label htmlFor="desc" className="mb-2 block text-xs font-medium text-muted-foreground">
            Description
          </label>
          <textarea
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe what you see — crack length, movement, water, blocked lanes…"
            className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-ring/30"
          />
        </div>

        {/* Geo-tag */}
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-background p-3">
          <MapPin className="size-4 shrink-0 text-primary" aria-hidden />
          <div className="min-w-0 flex-1 text-xs">
            {coords ? (
              <>
                <p className="font-medium">Geo-tagged</p>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {coords[0].toFixed(4)}, {coords[1].toFixed(4)}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">No location yet</p>
            )}
          </div>
          <button
            type="button"
            onClick={getLocation}
            className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-secondary"
          >
            <Crosshair className={cn("size-3.5", locating && "animate-spin")} aria-hidden />
            {locating ? "Locating…" : "Update"}
          </button>
        </div>

        {!online && (
          <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-accent/10 p-2.5 text-[11px] font-medium text-accent">
            <CloudOff className="size-3.5 shrink-0" aria-hidden />
            {t("offlineQueueNote")}
          </p>
        )}

        <button
          type="button"
          onClick={submit}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 active:opacity-80"
        >
          {justSubmitted ? (
            <>
              <Check className="size-4" aria-hidden />
              Submitted
            </>
          ) : (
            <>
              <Camera className="size-4" aria-hidden />
              {t("submitReport")}
            </>
          )}
        </button>
      </section>

      {/* Recent reports */}
      <section>
        <h2 className="mb-2 px-1 font-display text-sm font-semibold">Recent field reports</h2>
        <ul className="flex flex-col gap-3">
          {reports.map((r) => (
            <li key={r.id} className="flex gap-3 rounded-2xl border border-border bg-card p-3">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                <Image src={r.photo || "/placeholder.svg"} alt={r.category} fill className="object-cover" unoptimized />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase text-white"
                    style={{ backgroundColor: riskHex[r.severity] }}
                  >
                    {t(r.severity)}
                  </span>
                  <span className="truncate text-xs font-medium capitalize">{r.category.replace("-", " ")}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{r.description}</p>
                <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" aria-hidden />
                    {r.place}
                  </span>
                  <span>{timeAgo(r.time)}</span>
                  <SyncBadge status={r.status} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function SyncBadge({ status }: { status: FieldReport["status"] }) {
  if (status === "synced")
    return (
      <span className="flex items-center gap-1 text-risk-low">
        <Check className="size-3" aria-hidden />
        Synced
      </span>
    )
  if (status === "syncing")
    return (
      <span className="flex items-center gap-1 text-primary">
        <RefreshCw className="size-3 animate-spin" aria-hidden />
        Syncing
      </span>
    )
  return (
    <span className="flex items-center gap-1 text-accent">
      <Clock className="size-3" aria-hidden />
      Queued
    </span>
  )
}
