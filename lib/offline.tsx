"use client"

import { createContext, useCallback, useContext, useState, type ReactNode } from "react"

interface OfflineCtx {
  online: boolean
  toggle: () => void
  pending: number
  addPending: () => void
  clearPending: () => void
}

const Ctx = createContext<OfflineCtx | null>(null)

export function OfflineProvider({ children }: { children: ReactNode }) {
  const [online, setOnline] = useState(true)
  const [pending, setPending] = useState(1) // one report starts queued offline

  const toggle = useCallback(() => {
    setOnline((v) => {
      const next = !v
      if (next) setPending(0) // coming back online flushes the queue
      return next
    })
  }, [])

  const addPending = useCallback(() => setPending((p) => p + 1), [])
  const clearPending = useCallback(() => setPending(0), [])

  return (
    <Ctx.Provider value={{ online, toggle, pending, addPending, clearPending }}>{children}</Ctx.Provider>
  )
}

export function useOffline() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useOffline must be used within OfflineProvider")
  return ctx
}
