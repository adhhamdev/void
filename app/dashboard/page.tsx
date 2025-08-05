"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Key, Folder, Users, Activity, TrendingUp, Clock } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { EnvironmentSelector } from "@/components/environment-selector"
import { CreateSecretModal } from "@/components/create-secret-modal"
import { CreateProjectModal } from "@/components/create-project-modal"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"

interface Project {
  id: string
  name: string
  description: string
  secret_count: number
  folder_count: number
  last_activity: string
  environment: string
}

interface RecentActivity {
  id: string
  action: string
  resource_type: string
  resource_name: string
  user_name: string
  created_at: string
}

export default function Dashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSecrets: 0,
    totalProjects: 0,
    totalTeamMembers: 0,
    recentActivity: 0,
  })

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // Fetch user's organizations and projects
      const { data: orgMembers } = await supabase
        .from("organization_members")
        .select(`
          organization_id,
          organizations (
            id,
            name,
            projects (
              id,
              name,
              description,
              created_at,
              default_environment,
              secrets (count),
              folders (count)
            )
          )
        `)
        .eq("user_id", user?.id)

      // Process projects data
      const projectsData: Project[] = []
      let totalSecrets = 0
      let totalProjects = 0

      orgMembers?.forEach((member) => {
        member.organizations?.projects?.forEach((project) => {
          const secretCount = project.secrets?.[0]?.count || 0
          const folderCount = project.folders?.[0]?.count || 0

          projectsData.push({
            id: project.id,
            name: project.name,
            description: project.description || "",
            secret_count: secretCount,
            folder_count: folderCount,
            last_activity: project.created_at,
            environment: project.default_environment || "development",
          })

          totalSecrets += secretCount
          totalProjects += 1
        })
      })

      setProjects(projectsData)

      // Fetch recent activity
      const { data: activities } = await supabase
        .from("audit_logs")
        .select(`
          id,
          action,
          resource_type,
          metadata,
          created_at,
          profiles (full_name, email)
        `)
        .order("created_at", { ascending: false })
        .limit(10)

      const activityData: RecentActivity[] =
        activities?.map((activity) => ({
          id: activity.id,
          action: activity.action,
          resource_type: activity.resource_type,
          resource_name: activity.metadata?.secret_name || "Unknown",
          user_name: activity.profiles?.full_name || activity.profiles?.email || "Unknown",
          created_at: activity.created_at,
        })) || []

      setRecentActivity(activityData)

      // Update stats
      setStats({
        totalSecrets,
        totalProjects,
        totalTeamMembers: orgMembers?.length || 0,
        recentActivity: activityData.length,
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-2 text-slate-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
              <p className="text-slate-600 mt-1">Welcome back! Here's what's happening with your secrets.</p>
            </div>
            <div className="flex items-center space-x-3">
              <EnvironmentSelector />
              <CreateProjectModal />
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="p-6 pb-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total Secrets</p>
                    <p className="text-2xl font-semibold">{stats.totalSecrets}</p>
                    <p className="text-xs text-emerald-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12% from last month
                    </p>
                  </div>
                  <Key className="h-8 w-8 text-slate-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Projects</p>
                    <p className="text-2xl font-semibold">{stats.totalProjects}</p>
                    <p className="text-xs text-emerald-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +3 this month
                    </p>
                  </div>
                  <Folder className="h-8 w-8 text-slate-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Team Members</p>
                    <p className="text-2xl font-semibold">{stats.totalTeamMembers}</p>
                    <p className="text-xs text-slate-600 flex items-center mt-1">
                      <Users className="h-3 w-3 mr-1" />
                      Across all orgs
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-slate-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Recent Activity</p>
                    <p className="text-2xl font-semibold">{stats.recentActivity}</p>
                    <p className="text-xs text-slate-600 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      Last 24 hours
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto px-6 pb-6">
          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-6">
              {/* Search */}
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          <Link href={`/projects/${project.id}`} className="hover:underline">
                            {project.name}
                          </Link>
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {project.environment}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {project.description || "No description provided"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Key className="h-4 w-4 mr-1" />
                            {project.secret_count} secrets
                          </span>
                          <span className="flex items-center">
                            <Folder className="h-4 w-4 mr-1" />
                            {project.folder_count} folders
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Updated {formatTimeAgo(project.last_activity)}</span>
                        <CreateSecretModal
                          projectId={project.id}
                          projectName={project.name}
                          trigger={
                            <Button size="sm" variant="outline">
                              <Plus className="h-4 w-4 mr-1" />
                              Add Secret
                            </Button>
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                  <Folder className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    {searchQuery ? "No projects found" : "No projects yet"}
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {searchQuery ? "Try adjusting your search terms" : "Get started by creating your first project"}
                  </p>
                  {!searchQuery && <CreateProjectModal />}
                </div>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest actions across all your projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-slate-50">
                        <div className="flex-shrink-0">
                          <Activity className="h-5 w-5 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900">
                            {activity.user_name} {activity.action} {activity.resource_type}
                          </p>
                          <p className="text-sm text-slate-600">{activity.resource_name}</p>
                        </div>
                        <div className="flex-shrink-0 text-xs text-slate-500">{formatTimeAgo(activity.created_at)}</div>
                      </div>
                    ))}
                    {recentActivity.length === 0 && (
                      <div className="text-center py-8">
                        <Activity className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-600">No recent activity</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
