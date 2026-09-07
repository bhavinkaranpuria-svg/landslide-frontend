"use client"

import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { CloudRain } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { forecast } from "@/lib/data"

export function ForecastChart() {
  const { t } = useLanguage()

  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold">{t("forecastTitle")}</h2>
        <span className="flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          <CloudRain className="size-3" aria-hidden />
          IMD feed
        </span>
      </div>

      <div className="mt-3 h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecast} margin={{ top: 6, right: 4, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--risk-high)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--risk-high)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "var(--popover)",
                color: "var(--popover-foreground)",
                fontSize: 12,
              }}
              labelStyle={{ fontWeight: 600 }}
              formatter={(value: number, name: string) => [
                name === "risk" ? `${value} risk` : `${value} mm`,
                name === "risk" ? "Risk index" : "Rainfall",
              ]}
            />
            <Area
              type="monotone"
              dataKey="risk"
              stroke="var(--risk-high)"
              strokeWidth={2.5}
              fill="url(#riskFill)"
            />
            <Line
              type="monotone"
              dataKey="rainfall"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={false}
              strokeDasharray="4 3"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center justify-center gap-5 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-risk-high" aria-hidden />
          Predicted risk index
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-primary" aria-hidden style={{ borderStyle: "dashed" }} />
          Rainfall (mm)
        </span>
      </div>
    </section>
  )
}
