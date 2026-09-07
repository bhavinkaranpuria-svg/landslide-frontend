"use client"

import Link from "next/link"
import { ArrowUpRight, Droplets, CloudRain, TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { useDistricts } from "@/lib/use-districts"
import { riskHex } from "@/lib/risk"
import { RiskBadge } from "@/components/risk-badge"

const trendIcon = { up: TrendingUp, down: TrendingDown, flat: Minus }
const trendColor = { up: "text-risk-severe", down: "text-risk-low", flat: "text-muted-foreground" }

export function DistrictRiskList() {
  const { t } = useLanguage()
  const { districts } = useDistricts()
  const sorted = [...districts].sort((a, b) => b.riskScore - a.riskScore)

  return (
    <section className="rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between px-4 pt-4">
        <h2 className="font-display text-sm font-semibold">{t("riskByDistrict")}</h2>
        <Link href="/map" className="flex items-center gap-1 text-xs font-medium text-primary">
          {t("viewMap")}
          <ArrowUpRight className="size-3.5" aria-hidden />
        </Link>
      </div>

      <ul className="mt-2 divide-y divide-border">
        {sorted.map((d) => {
          const Trend = trendIcon[d.trend]
          return (
            <li key={d.id}>
              <Link
                href={`/map?district=${d.id}`}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary/60"
              >
                <div
                  className="flex h-11 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: riskHex[d.riskLevel] }}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold">{d.name}</p>
                    <Trend className={`size-3.5 ${trendColor[d.trend]}`} aria-hidden />
                  </div>
                  <p className="truncate text-[11px] text-muted-foreground">{d.state}</p>
                  <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CloudRain className="size-3" aria-hidden />
                      {d.rainfall24h}mm
                    </span>
                    <span className="flex items-center gap-1">
                      <Droplets className="size-3" aria-hidden />
                      {d.soilMoisture}%
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="font-display text-lg font-bold tabular-nums" style={{ color: riskHex[d.riskLevel] }}>
                    {d.riskScore}
                  </span>
                  <RiskBadge level={d.riskLevel} />
                </div>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
