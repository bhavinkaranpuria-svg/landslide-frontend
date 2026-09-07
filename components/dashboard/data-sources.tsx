"use client"

import { Satellite, Radio, CloudRain, Mountain, Database } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { dataSources } from "@/lib/data"
import { cn } from "@/lib/utils"

const icons: Record<string, typeof Radio> = {
  imd: CloudRain,
  soil: Radio,
  sat: Satellite,
  terrain: Mountain,
  history: Database,
}

export function DataSources() {
  const { t } = useLanguage()

  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <h2 className="font-display text-sm font-semibold">{t("dataSources")}</h2>
      <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {dataSources.map((s) => {
          const Icon = icons[s.id] ?? Database
          const live = s.status === "live"
          return (
            <li key={s.id} className="flex items-center gap-3 rounded-xl border border-border bg-background p-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground/70">
                <Icon className="size-4" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{s.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">{s.detail}</p>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-muted-foreground">
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    live ? "bg-risk-low" : "bg-muted-foreground/40",
                  )}
                  aria-hidden
                />
                {live ? "Live" : "Cached"}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
