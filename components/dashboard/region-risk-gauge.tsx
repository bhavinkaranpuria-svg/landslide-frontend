"use client"

import { useLanguage } from "@/lib/i18n"
import { useDistricts } from "@/lib/use-districts"
import type { RiskLevel } from "@/lib/types"

function levelFromScore(score: number): RiskLevel {
  if (score >= 80) return "severe"
  if (score >= 65) return "high"
  if (score >= 45) return "moderate"
  return "low"
}

const arcColor: Record<RiskLevel, string> = {
  low: "var(--risk-low)",
  moderate: "var(--risk-moderate)",
  high: "var(--risk-high)",
  severe: "var(--risk-severe)",
}

export function RegionRiskGauge() {
  const { t } = useLanguage()
  const { districts } = useDistricts()

  // Population-weighted regional risk index
  const totalPop = districts.reduce((s, d) => s + d.population, 0)
  const index = Math.round(districts.reduce((s, d) => s + d.riskScore * d.population, 0) / totalPop)
  const level = levelFromScore(index)

  const radius = 74
  const circumference = Math.PI * radius // semicircle
  const dash = (index / 100) * circumference

  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold">{t("regionRisk")}</h2>
        <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          AI model v3.2
        </span>
      </div>

      <div className="mt-2 flex items-center gap-5">
        <div className="relative shrink-0">
          <svg width="180" height="104" viewBox="0 0 180 104" aria-hidden>
            <path
              d="M 16 96 A 74 74 0 0 1 164 96"
              fill="none"
              stroke="var(--muted)"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M 16 96 A 74 74 0 0 1 164 96"
              fill="none"
              stroke={arcColor[level]}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
            <span className="font-display text-4xl font-bold leading-none tabular-nums">{index}</span>
            <span className="text-[11px] text-muted-foreground">/ 100</span>
          </div>
        </div>

        <div className="min-w-0">
          <p
            className="font-display text-lg font-bold capitalize"
            style={{ color: arcColor[level] }}
          >
            {t(level)}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Sustained monsoon rainfall and near-saturated soils are driving elevated slope-failure probability
            across the region. Next 12–18h are critical.
          </p>
        </div>
      </div>
    </section>
  )
}
