"use client"

import type React from "react"

import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationLinkProps {
  href: string
  icon: LucideIcon
  children: React.ReactNode
  isActive?: boolean
  onClick?: () => void
}

export function NavigationLink({ href, icon: Icon, children, isActive = false, onClick }: NavigationLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        isActive ? "bg-emerald-100 text-emerald-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{children}</span>
    </Link>
  )
}
