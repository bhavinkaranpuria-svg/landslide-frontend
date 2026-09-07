"use client"

import type { ReactNode } from "react"
import { LanguageProvider } from "@/lib/i18n"
import { OfflineProvider } from "@/lib/offline"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <OfflineProvider>{children}</OfflineProvider>
    </LanguageProvider>
  )
}
