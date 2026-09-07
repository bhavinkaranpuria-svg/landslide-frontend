"use client"

import { AlertTriangle, Ban, Users } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { alerts, roads } from "@/lib/data"
import { useDistricts } from "@/lib/use-districts"
import { riskOrder } from "@/lib/risk"

export function StatCards() {
  const { t } = useLanguage()
  const { districts } = useDistricts()

  const activeAlerts = alerts.filter((a) => !a.acknowledged).length
  const roadsBlocked = roads.filter((r) => r.status === "blocked").length
  const peopleAtRisk = districts
    .filter((d) => riskOrder[d.riskLevel] >= 2)
    .reduce((sum, d) => sum + d.population, 0)

  const stats = [
    {
      label: t("activeAlerts"),
      value: activeAlerts.toString(),
      icon: AlertTriangle,
      accent: "text-risk-severe",
      bg: "bg-risk-severe/10",
    },
    {
      label: t("roadsBlocked"),
      value: roadsBlocked.toString(),
      icon: Ban,
      accent: "text-risk-high",
      bg: "bg-risk-high/10",
    },
    {
      label: t("peopleAtRisk"),
      value: peopleAtRisk >= 1000 ? `${(peopleAtRisk / 1000).toFixed(0)}k` : peopleAtRisk.toString(),
      icon: Users,
      accent: "text-accent",
      bg: "bg-accent/10",
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => {
        const Icon = s.icon
        return (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-3">
            <div className={`mb-2 flex size-8 items-center justify-center rounded-lg ${s.bg} ${s.accent}`}>
              <Icon className="size-4" aria-hidden />
            </div>
            <p className="font-display text-2xl font-bold leading-none">{s.value}</p>
            <p className="mt-1 text-[11px] leading-tight text-muted-foreground">{s.label}</p>
          </div>
        )
      })}
    </div>
  )
}
