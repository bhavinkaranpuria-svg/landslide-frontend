"use client"

import { Hospital, School, Waypoints, Home, Tent } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { infrastructure } from "@/lib/data"
import { riskOrder } from "@/lib/risk"
import type { AssetType } from "@/lib/types"
import { RiskBadge } from "@/components/risk-badge"

const assetIcon: Record<AssetType, typeof Home> = {
  village: Home,
  hospital: Hospital,
  school: School,
  bridge: Waypoints,
  shelter: Tent,
}

export function ResponsePriority() {
  const { t } = useLanguage()
  const ranked = [...infrastructure]
    .sort((a, b) => riskOrder[b.riskLevel] - riskOrder[a.riskLevel])
    .slice(0, 5)

  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <h2 className="font-display text-sm font-semibold">{t("responsePriority")}</h2>
      <ol className="mt-3 flex flex-col gap-2">
        {ranked.map((a, i) => {
          const Icon = assetIcon[a.type]
          return (
            <li key={a.id} className="flex items-center gap-3 rounded-xl border border-border bg-background p-2.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/12 font-display text-xs font-bold text-primary">
                {i + 1}
              </span>
              <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{a.name}</p>
                <p className="text-[11px] capitalize text-muted-foreground">
                  {a.type}
                  {a.people ? ` · ${a.people.toLocaleString()} people` : ""}
                </p>
              </div>
              <RiskBadge level={a.riskLevel} />
            </li>
          )
        })}
      </ol>
    </section>
  )
}
