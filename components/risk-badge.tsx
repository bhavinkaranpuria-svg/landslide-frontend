"use client"

import { useLanguage } from "@/lib/i18n"
import { riskBadge } from "@/lib/risk"
import type { RiskLevel } from "@/lib/types"
import { cn } from "@/lib/utils"

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  const { t } = useLanguage()
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        riskBadge[level],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {t(level)}
    </span>
  )
}
