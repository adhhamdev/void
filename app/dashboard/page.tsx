"use client"

import Link from "next/link"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Folder, Terminal, Code, Copy } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { EnvironmentSelector } from "@/components/environment-selector"
import { SecretCard } from "@/components/secret-card"
import { TeamMemberCard } from "@/components/team-member-card"
import { CreateSecretModal } from "@/components/create-secret-modal"

export default function Dashboard() {
  const [selectedProject, setSelectedProject] = useState("web-app")
  const [searchQuery, setSearchQuery] = useState("")

  const projects = [
    { id: "web-app", name: "Web Application", secrets: 12, members: 4, environment: "production" },
    { id: "mobile-app", name: "Mobile App", secrets: 8, members: 3, environment: "staging" },
    { id: "api-service", name: "API Service", secrets: 15, members: 6, environment: "development" },
  ]

  const secrets = [
    {
      id: "1",
      name: "DATABASE_URL",
      description: "Primary database connection string",
      lastModified: "2 hours ago",
      environment: "production",
      type: "database",
    },
    {
      id: "2",
      name: "STRIPE_SECRET_KEY",
      description: "Payment processing secret key",
      lastModified: "1 day ago",
      environment: "production",
      type: "api",
    },
    {
      id: "3",
      name: "JWT_SECRET",
      description: "JSON Web Token signing secret",
      lastModified: "3 days ago",
      environment: "production",
      type: "auth",
    },
  ]

  const teamMembers = [
    {
      id: "1",
      name: "Alex Chen",
      email: "alex@company.com",
      role: "Admin",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@company.com",
      role: "Developer",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "3",
      name: "Mike Rodriguez",
      email: "mike@company.com",
      role: "Developer",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
              <EnvironmentSelector />
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search secrets..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <CreateSecretModal />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <Tabs defaultValue="secrets" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-md">
              <TabsTrigger value="secrets">Secrets</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="integrations">API & CLI</TabsTrigger>
            </TabsList>

            <TabsContent value="secrets" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {secrets.map((secret) => (
                  <SecretCard key={secret.id} secret={secret} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Link key={project.id} href={`/projects/${project.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center">
                            <Folder className="mr-2 h-5 w-5 text-slate-500" />
                            {project.name}
                          </CardTitle>
                          <Badge variant={project.environment === "production" ? "default" : "secondary"}>
                            {project.environment}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>{project.secrets} secrets</span>
                          <span>{project.members} members</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member) => (
                  <TeamMemberCard key={member.id} member={member} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Terminal className="mr-2 h-5 w-5" />
                      CLI Access
                    </CardTitle>
                    <CardDescription>Manage secrets from your terminal</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-slate-900 text-slate-100 p-3 rounded-md font-mono text-sm">
                      <div>$ npm install -g @securevault/cli</div>
                      <div>$ vault login</div>
                      <div>$ vault get DATABASE_URL</div>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Install Command
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="mr-2 h-5 w-5" />
                      API Access
                    </CardTitle>
                    <CardDescription>Integrate with your applications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>API Endpoint</Label>
                      <div className="flex">
                        <Input value="https://api.securevault.com/v1" readOnly className="rounded-r-none" />
                        <Button variant="outline" className="rounded-l-none bg-transparent">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button className="w-full">Generate API Key</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
