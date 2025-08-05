"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Settings, Users, Key, Folder, Plus, MoreHorizontal, Trash2, Edit } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { EnvironmentSelector } from "@/components/environment-selector"
import { SecretCard } from "@/components/secret-card"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useParams } from "next/navigation"
import { CreateSecretModal } from "@/components/create-secret-modal"
import { CreateFolderModal } from "@/components/create-folder-modal"

export default function ProjectDetail() {
  const [projectName, setProjectName] = useState("Web Application")
  const [projectDescription, setProjectDescription] = useState("Main web application secrets and configuration")
  const params = useParams()

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
      name: "REDIS_URL",
      description: "Redis cache connection string",
      lastModified: "1 day ago",
      environment: "production",
      type: "database",
    },
    {
      id: "3",
      name: "JWT_SECRET",
      description: "JSON Web Token signing secret",
      lastModified: "3 days ago",
      environment: "production",
      type: "auth",
    },
    {
      id: "4",
      name: "STRIPE_WEBHOOK_SECRET",
      description: "Stripe webhook endpoint secret",
      lastModified: "1 week ago",
      environment: "production",
      type: "api",
    },
  ]

  const folders = [
    {
      id: "1",
      name: "Authentication",
      secretCount: 5,
      lastModified: "2 hours ago",
    },
    {
      id: "2",
      name: "Database",
      secretCount: 3,
      lastModified: "1 day ago",
    },
    {
      id: "3",
      name: "External APIs",
      secretCount: 8,
      lastModified: "3 days ago",
    },
    {
      id: "4",
      name: "Payment Processing",
      secretCount: 4,
      lastModified: "1 week ago",
    },
  ]

  const teamMembers = [
    {
      id: "1",
      name: "Alex Chen",
      email: "alex@company.com",
      role: "Admin",
      permissions: "Full Access",
      lastAccess: "2 hours ago",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@company.com",
      role: "Developer",
      permissions: "Read/Write",
      lastAccess: "1 day ago",
    },
    {
      id: "3",
      name: "Mike Rodriguez",
      email: "mike@company.com",
      role: "Developer",
      permissions: "Read Only",
      lastAccess: "3 days ago",
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
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">{projectName}</h1>
                <p className="text-slate-600 mt-1">Manage project secrets and team access</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <EnvironmentSelector />
              <CreateSecretModal projectId={params.id as string} projectName={projectName} />
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
                    <p className="text-2xl font-semibold">{secrets.length}</p>
                  </div>
                  <Key className="h-8 w-8 text-slate-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Folders</p>
                    <p className="text-2xl font-semibold">{folders.length}</p>
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
                    <p className="text-2xl font-semibold">{teamMembers.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-slate-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Environment</p>
                    <p className="text-2xl font-semibold">
                      <Badge className="bg-red-100 text-red-700">Production</Badge>
                    </p>
                  </div>
                  <Settings className="h-8 w-8 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto px-6 pb-6">
          <Tabs defaultValue="secrets" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl">
              <TabsTrigger value="secrets">Secrets</TabsTrigger>
              <TabsTrigger value="folders">Folders</TabsTrigger>
              <TabsTrigger value="team">Team Access</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="secrets" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {secrets.map((secret) => (
                  <SecretCard key={secret.id} secret={secret} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="folders" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Project Folders</CardTitle>
                      <CardDescription>Organize your secrets into logical groups</CardDescription>
                    </div>
                    <CreateFolderModal projectId={params.id as string} projectName={projectName} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {folders.map((folder, index) => (
                      <Card key={folder.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <Link
                              href={`/folders/${params.id}-${index}`}
                              className="flex items-center space-x-2 flex-1"
                            >
                              <Folder className="h-5 w-5 text-slate-500" />
                              <CardTitle className="text-base hover:underline">{folder.name}</CardTitle>
                            </Link>
                            <div className="flex items-center space-x-1">
                              <CreateSecretModal
                                projectId={params.id as string}
                                projectName={projectName}
                                folderId={folder.id}
                                folderName={folder.name}
                                trigger={
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                }
                              />
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Rename
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between text-sm text-slate-600">
                            <span>{folder.secretCount} secrets</span>
                            <span>Updated {folder.lastModified}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Team Access</CardTitle>
                      <CardDescription>Manage who can access this project</CardDescription>
                    </div>
                    <Link href="/team">
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Member
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Team Member</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead>Last Access</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-emerald-700">
                                  {member.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">{member.name}</p>
                                <p className="text-sm text-slate-600">{member.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{member.role}</Badge>
                          </TableCell>
                          <TableCell>{member.permissions}</TableCell>
                          <TableCell>{member.lastAccess}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Edit Access
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Settings</CardTitle>
                    <CardDescription>Configure project details and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="projectName">Project Name</Label>
                      <Input id="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="projectDescription">Description</Label>
                      <Textarea
                        id="projectDescription"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="defaultEnvironment">Default Environment</Label>
                      <Input id="defaultEnvironment" defaultValue="Production" readOnly />
                    </div>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">Save Changes</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Danger Zone</CardTitle>
                    <CardDescription>Irreversible and destructive actions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                      <div>
                        <h4 className="font-medium text-red-800">Archive Project</h4>
                        <p className="text-sm text-red-600">Hide this project from the dashboard</p>
                      </div>
                      <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100 bg-transparent">
                        Archive
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                      <div>
                        <h4 className="font-medium text-red-800">Delete Project</h4>
                        <p className="text-sm text-red-600">Permanently delete this project and all secrets</p>
                      </div>
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Project
                      </Button>
                    </div>
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
