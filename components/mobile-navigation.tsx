"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, Key, Users, Settings, FileText, Menu, Plus, Search, Bell } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { CreateSecretModal } from "@/components/create-secret-modal"
import { GlobalSearch } from "@/components/global-search"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Secrets", href: "/secrets", icon: Key },
  { name: "Team", href: "/team", icon: Users },
  { name: "Logs", href: "/logs", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface MobileNavigationProps {
  className?: string
}

export function MobileNavigation({ className }: MobileNavigationProps) {
  const { user } = useAuth()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <>
      {/* Mobile Header */}
      <header className={cn("lg:hidden bg-white border-b border-slate-200 px-4 py-3", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  <SheetHeader className="p-6 border-b border-slate-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                        <Key className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <SheetTitle className="text-left">SecureVault</SheetTitle>
                        <SheetDescription className="text-left">Secret Management</SheetDescription>
                      </div>
                    </div>
                  </SheetHeader>

                  {/* Navigation Links */}
                  <nav className="flex-1 p-4 space-y-2">
                    {navigation.map((item) => {
                      const isActive = pathname.startsWith(item.href)
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                            "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                            isActive
                              ? "bg-emerald-100 text-emerald-700 shadow-sm"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200",
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.name}</span>
                          {item.name === "Secrets" && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              12
                            </Badge>
                          )}
                        </Link>
                      )
                    })}
                  </nav>

                  {/* Quick Actions */}
                  <div className="border-t border-slate-200 p-4 space-y-3">
                    <CreateSecretModal
                      projectId="default"
                      projectName="Default Project"
                      trigger={
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-12">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Secret
                        </Button>
                      }
                    />
                    <Button
                      variant="outline"
                      className="w-full h-12 bg-transparent"
                      onClick={() => {
                        setIsOpen(false)
                        setShowSearch(true)
                      }}
                    >
                      <Search className="mr-2 h-4 w-4" />
                      Search Secrets
                    </Button>
                  </div>

                  {/* User Info */}
                  <div className="border-t border-slate-200 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-emerald-700">
                          {user?.email?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <h1 className="text-lg font-semibold text-slate-900">
              {navigation.find((item) => pathname.startsWith(item.href))?.name || "SecureVault"}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-2" onClick={() => setShowSearch(true)}>
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 relative">
              <Bell className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </Button>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      {showSearch && <GlobalSearch onClose={() => setShowSearch(false)} />}
    </>
  )
}

// Bottom Navigation for Mobile
export function MobileBottomNavigation() {
  const pathname = usePathname()

  const bottomNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Secrets", href: "/secrets", icon: Key },
    { name: "Team", href: "/team", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 z-40">
      <div className="flex items-center justify-around">
        {bottomNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-0",
                isActive ? "text-emerald-600 bg-emerald-50" : "text-slate-500 hover:text-slate-700 active:bg-slate-100",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium truncate">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
