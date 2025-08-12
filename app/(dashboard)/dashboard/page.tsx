"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Key, Users, Activity, TrendingUp, Shield, Clock, AlertTriangle } from "lucide-react"
import { AdvancedSearch } from "@/components/advanced-search"
import { OnboardingModal } from "@/components/onboarding-modal"
import { OnboardingChecklist } from "@/components/onboarding-checklist"
import { useOnboarding } from "@/contexts/onboarding-context"
import type { Project, RecentActivity } from "@/types"

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const { showOnboarding } = useOnboarding()

  useEffect(() => {
    // Mock data - replace with real API calls
    setTimeout(() => {
      setProjects([
        {
          id: "1",
          name: "Production API Keys",
          description: "Critical production environment secrets",
          secretCount: 12,
          lastUpdated: new Date("2024-01-15"),
          status: "active" as const,
        },
        {
          id: "2",
          name: "Development Environment",
          description: "Development and staging secrets",
          secretCount: 8,
          lastUpdated: new Date("2024-01-14"),
          status: "active" as const,
        },
        {
          id: "3",
          name: "Third-party Integrations",
          description: "External service API keys and tokens",
          secretCount: 15,
          lastUpdated: new Date("2024-01-13"),
          status: "active" as const,
        },
      ])

      setRecentActivity([
        {
          id: "1",
          action: "Secret Created",
          target: "DATABASE_URL",
          user: "John Doe",
          timestamp: new Date("2024-01-15T10:30:00"),
          type: "create" as const,
        },
        {
          id: "2",
          action: "Secret Updated",
          target: "API_KEY_STRIPE",
          user: "Jane Smith",
          timestamp: new Date("2024-01-15T09:15:00"),
          type: "update" as const,
        },
        {
          id: "3",
          action: "Team Member Added",
          target: "mike@company.com",
          user: "John Doe",
          timestamp: new Date("2024-01-14T16:45:00"),
          type: "team" as const,
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showOnboarding && <OnboardingModal />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your secrets and monitor your organization's security</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Secret
        </Button>
      </div>

      <OnboardingChecklist />

      <AdvancedSearch />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Secrets</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">2 pending invitations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Excellent security posture</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Actions in last 24h</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Your most recently updated projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{project.name}</p>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Key className="h-3 w-3" />
                    {project.secretCount} secrets
                    <Clock className="h-3 w-3 ml-2" />
                    {project.lastUpdated.toLocaleDateString()}
                  </div>
                </div>
                <Badge variant="secondary">{project.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in your organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="mt-1">
                  {activity.type === "create" && <Plus className="h-4 w-4 text-green-500" />}
                  {activity.type === "update" && <Activity className="h-4 w-4 text-blue-500" />}
                  {activity.type === "team" && <Users className="h-4 w-4 text-purple-500" />}
                  {activity.type === "delete" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.target}</p>
                  <p className="text-xs text-muted-foreground">
                    by {activity.user} • {activity.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
