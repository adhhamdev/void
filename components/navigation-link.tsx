"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"

interface NavigationLinkProps {
  href: string
  children: ReactNode
  className?: string
}

export function NavigationLink({ href, children, className = "" }: NavigationLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + "/")

  return (
    <Link href={href}>
      <Button
        variant={isActive ? "default" : "ghost"}
        className={`w-full justify-start ${
          isActive ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
        } ${className}`}
      >
        {children}
      </Button>
    </Link>
  )
}
