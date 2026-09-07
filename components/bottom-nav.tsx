"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Map, Bell, CameraIcon } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const items = [
    { href: "/", label: t("nav_dashboard"), icon: LayoutDashboard },
    { href: "/map", label: t("nav_map"), icon: Map },
    { href: "/alerts", label: t("nav_alerts"), icon: Bell },
    { href: "/report", label: t("nav_report"), icon: CameraIcon },
  ]

  return (
    <nav
      className="sticky bottom-0 z-30 border-t border-border bg-card/90 backdrop-blur-md"
      aria-label="Primary"
    >
      <div className="mx-auto flex max-w-3xl items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-12 items-center justify-center rounded-full transition-colors",
                  active && "bg-primary/12",
                )}
              >
                <Icon className="size-5" aria-hidden />
              </span>
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
