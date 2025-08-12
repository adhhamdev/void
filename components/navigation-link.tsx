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
  className?: string
}

export function NavigationLink({
  href,
  icon: Icon,
  children,
  isActive = false,
  onClick,
  className,
}: NavigationLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95", // Added active scale and improved styling
        isActive
          ? "bg-emerald-100 text-emerald-700 shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200",
        className,
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span className="truncate">{children}</span>
    </Link>
  )
}
