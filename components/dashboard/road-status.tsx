"use client"

import { Ban, TriangleAlert, CircleCheck } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { roads } from "@/lib/data"
import { roadBadge } from "@/lib/risk"
import type { RoadStatus as RoadStatusType } from "@/lib/types"
import { cn } from "@/lib/utils"

const statusIcon: Record<RoadStatusType, typeof Ban> = {
  open: CircleCheck,
  restricted: TriangleAlert,
  blocked: Ban,
}

export function RoadStatus() {
  const { t } = useLanguage()
  const order: Record<RoadStatusType, number> = { blocked: 0, restricted: 1, open: 2 }
  const sorted = [...roads].sort((a, b) => order[a.status] - order[b.status])

  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <h2 className="font-display text-sm font-semibold">{t("roadStatus")}</h2>
      <ul className="mt-3 flex flex-col gap-2.5">
        {sorted.map((r) => {
          const Icon = statusIcon[r.status]
          return (
            <li key={r.id} className="flex items-start gap-3 rounded-xl border border-border bg-background p-3">
              <Icon
                className={cn(
                  "mt-0.5 size-4 shrink-0",
                  r.status === "open" && "text-risk-low",
                  r.status === "restricted" && "text-risk-moderate-foreground",
                  r.status === "blocked" && "text-risk-severe",
                )}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-tight">{r.name}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{r.note}</p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase",
                  roadBadge[r.status],
                )}
              >
                {t(r.status)}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
