"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { MobileNavigation, MobileBottomNavigation } from "@/components/mobile-navigation"
import { Sidebar } from "@/components/sidebar"
import { cn } from "@/lib/utils"

interface MobileLayoutWrapperProps {
  children: React.ReactNode
  className?: string
}

export function MobileLayoutWrapper({ children, className }: MobileLayoutWrapperProps) {
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex h-screen bg-slate-50">
        <div className="flex-1">{children}</div>
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-slate-50 pb-16">
        <MobileNavigation />
        <main className={cn("flex-1", className)}>{children}</main>
        <MobileBottomNavigation />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className={cn("flex-1 overflow-hidden", className)}>{children}</main>
    </div>
  )
}
