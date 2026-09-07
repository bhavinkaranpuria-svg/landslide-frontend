"use client"

import { useState } from "react"
import { MessageSquare, Smartphone, Siren, MapPin, Check, BellRing } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { alerts as seedAlerts } from "@/lib/data"
import { riskHex, riskSolid } from "@/lib/risk"
import type { AlertChannel, AlertItem } from "@/lib/types"
import { cn } from "@/lib/utils"

const channelIcon: Record<AlertChannel, typeof Siren> = {
  sms: MessageSquare,
  app: Smartphone,
  siren: Siren,
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.round(hrs / 24)}d ago`
}

export function AlertsFeed() {
  const { t } = useLanguage()
  const [alerts, setAlerts] = useState<AlertItem[]>(seedAlerts)
  const [filter, setFilter] = useState<"all" | "active">("active")

  const acknowledge = (id: string) =>
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)))

  const visible = filter === "active" ? alerts.filter((a) => !a.acknowledged) : alerts
  const activeCount = alerts.filter((a) => !a.acknowledged).length

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="inline-flex rounded-full border border-border bg-card p-0.5">
          {(["active", "all"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors",
                filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              {f === "active" ? `${t("activeAlerts")} (${activeCount})` : "All"}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-12 text-center">
          <Check className="size-8 text-risk-low" aria-hidden />
          <p className="text-sm font-medium">All alerts acknowledged</p>
          <p className="text-xs text-muted-foreground">You&apos;re up to date across all districts.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {visible.map((a) => (
            <li
              key={a.id}
              className="overflow-hidden rounded-2xl border border-border bg-card"
              style={{ borderLeftWidth: 4, borderLeftColor: riskHex[a.level] }}
            >
              <div className="p-4">
                <div className="flex items-start gap-2">
                  <span
                    className={cn(
                      "mt-0.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                      riskSolid[a.level],
                    )}
                  >
                    <BellRing className="size-3" aria-hidden />
                    {t(a.level)}
                  </span>
                  <span className="ml-auto text-[11px] text-muted-foreground">{timeAgo(a.time)}</span>
                </div>

                <h3 className="mt-2 font-display text-base font-semibold leading-tight text-balance">{a.title}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3.5" aria-hidden />
                  {a.district}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">{a.message}</p>

                {/* Audiences */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {a.audiences.map((aud) => (
                    <span
                      key={aud}
                      className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground"
                    >
                      {aud}
                    </span>
                  ))}
                </div>

                {/* Delivery */}
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-3">
                  <div className="flex items-center gap-2">
                    {a.channels.map((c) => {
                      const Icon = channelIcon[c]
                      return (
                        <span
                          key={c}
                          className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground"
                          title={`Delivered via ${c.toUpperCase()}`}
                        >
                          <Icon className="size-3.5 text-primary" aria-hidden />
                          {c.toUpperCase()}
                        </span>
                      )
                    })}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-risk-low" aria-hidden />
                    Sent in EN · हिन्दी · नेपाली
                  </div>
                </div>
              </div>

              {!a.acknowledged && (
                <button
                  type="button"
                  onClick={() => acknowledge(a.id)}
                  className="flex w-full items-center justify-center gap-1.5 border-t border-border bg-secondary/50 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-secondary"
                >
                  <Check className="size-4" aria-hidden />
                  {t("acknowledge")}
                </button>
              )}
              {a.acknowledged && (
                <div className="flex w-full items-center justify-center gap-1.5 border-t border-border bg-risk-low/8 py-2 text-xs font-medium text-risk-low">
                  <Check className="size-3.5" aria-hidden />
                  {t("acknowledged")}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
