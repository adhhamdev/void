"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  Key,
  Users,
  Settings,
  FileText,
  Shield,
  LogOut,
  User,
  ChevronDown,
  Menu,
  X,
} from "lucide-react"
import { NavigationLink } from "@/components/navigation-link"
import { useAuth } from "@/components/auth-provider"
import { useSwipe } from "@/hooks/use-swipe"
import { useIsMobile } from "@/hooks/use-mobile"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Secrets", href: "/secrets", icon: Key },
  { name: "Team", href: "/team", icon: Users },
  { name: "Logs", href: "/logs", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const swipeRef = useSwipe({
    onSwipeLeft: () => setIsMobileMenuOpen(false),
    onSwipeRight: () => setIsMobileMenuOpen(true),
  })

  const handleSignOut = async () => {
    await signOut()
  }

  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    }
    return user?.email?.charAt(0).toUpperCase() || "U"
  }

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isMobile && isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobile, isMobileMenuOpen])

  // Don't render desktop sidebar on mobile - handled by MobileNavigation
  if (isMobile) {
    return null
  }

  return (
    <>
      {/* Mobile menu button - only show on mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="shadow-lg bg-white hover:bg-slate-50"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile overlay with improved backdrop */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar with swipe support */}
      <div
        ref={swipeRef}
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-all duration-300 ease-out shadow-xl lg:shadow-none
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo with improved mobile spacing */}
          <div className="flex items-center space-x-3 px-6 py-5 border-b border-slate-200">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900">SecureVault</span>
              <p className="text-xs text-slate-500 mt-0.5">Secret Management</p>
            </div>
          </div>

          {/* Navigation with improved mobile touch targets */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => (
              <NavigationLink
                key={item.name}
                href={item.href}
                icon={item.icon}
                isActive={pathname.startsWith(item.href)}
                onClick={() => setIsMobileMenuOpen(false)}
                className="h-12 px-4 text-base" // Larger touch targets for mobile
              >
                {item.name}
              </NavigationLink>
            ))}
          </nav>

          {/* User Menu with improved mobile layout */}
          <div className="border-t border-slate-200 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-3 h-auto">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 text-sm font-medium">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  )
}
