"use client"

import type React from "react"

import { Sidebar } from "@/components/sidebar"
import { MobileLayoutWrapper } from "@/components/mobile-layout-wrapper"
import { BulkOperationsProvider } from "@/contexts/bulk-operations-context"
import { OnboardingProvider } from "@/contexts/onboarding-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <BulkOperationsProvider>
      <OnboardingProvider>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
          <Sidebar />
          <MobileLayoutWrapper>
            <main className="flex-1 overflow-auto">
              <div className="p-6">{children}</div>
            </main>
          </MobileLayoutWrapper>
        </div>
      </OnboardingProvider>
    </BulkOperationsProvider>
  )
}
