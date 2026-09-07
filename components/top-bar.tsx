"use client"

import { Mountain, Wifi, WifiOff, Globe, Check } from "lucide-react"
import { useState } from "react"
import { languages, useLanguage, type Lang } from "@/lib/i18n"
import { useOffline } from "@/lib/offline"
import { cn } from "@/lib/utils"

export function TopBar() {
  const { t, lang, setLang } = useLanguage()
  const { online, toggle, pending } = useOffline()
  const [langOpen, setLangOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Mountain className="size-5" aria-hidden />
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate font-display text-sm font-semibold tracking-tight">{t("appName")}</p>
            <p className="truncate text-[11px] text-muted-foreground">{t("appTagline")}</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Language selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1.5 text-xs font-medium hover:bg-secondary"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
            >
              <Globe className="size-3.5" aria-hidden />
              <span className="uppercase">{lang}</span>
            </button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} aria-hidden />
                <ul
                  role="listbox"
                  className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border border-border bg-popover shadow-lg"
                >
                  {languages.map((l) => (
                    <li key={l.code}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={lang === l.code}
                        onClick={() => {
                          setLang(l.code as Lang)
                          setLangOpen(false)
                        }}
                        className="flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-secondary"
                      >
                        <span>{l.native}</span>
                        {lang === l.code && <Check className="size-4 text-primary" aria-hidden />}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Connectivity toggle (simulates low-network / offline) */}
          <button
            type="button"
            onClick={toggle}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium transition-colors",
              online
                ? "border-risk-low/40 bg-risk-low/10 text-risk-low"
                : "border-accent/40 bg-accent/10 text-accent",
            )}
            title="Toggle connectivity (demo)"
          >
            {online ? <Wifi className="size-3.5" aria-hidden /> : <WifiOff className="size-3.5" aria-hidden />}
            <span className="hidden sm:inline">{online ? t("online") : t("offline")}</span>
            {!online && pending > 0 && (
              <span className="rounded-full bg-accent px-1.5 text-[10px] font-bold text-accent-foreground">
                {pending}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
