"use client"

import { CloudOff, RefreshCw } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { useOffline } from "@/lib/offline"

export function OfflineBanner() {
  const { online, pending } = useOffline()
  const { t } = useLanguage()

  if (online) return null

  return (
    <div className="border-b border-accent/40 bg-accent/10">
      <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-2 text-xs font-medium text-accent">
        <CloudOff className="size-4 shrink-0" aria-hidden />
        <span>
          {t("offline")} — {t("appName")} is running on cached data.
        </span>
        {pending > 0 && (
          <span className="ml-auto flex items-center gap-1 text-muted-foreground">
            <RefreshCw className="size-3.5" aria-hidden />
            {pending} {t("pendingSync")}
          </span>
        )}
      </div>
    </div>
  )
}
