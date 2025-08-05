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
import { ArrowLeft, Eye, EyeOff, Copy, Save, History, Users, Shield, AlertTriangle, CheckCircle } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import Link from "next/link"

export default function SecretDetail() {
  const [isVisible, setIsVisible] = useState(false)
  const [secretValue, setSecretValue] = useState("sk_live_51H7J8K2eZvKYlo2C...")
  const [description, setDescription] = useState("Primary Stripe secret key for payment processing")

  const versions = [
    {
      id: "v3",
      value: "sk_live_51H7J8K2eZvKYlo2C...",
      createdBy: "Alex Chen",
      createdAt: "2024-01-15 14:30:25",
      status: "current",
      changes: "Updated key rotation",
    },
    {
      id: "v2",
      value: "sk_live_51G6I7J1dYuJXkn1B...",
      createdBy: "Sarah Johnson",
      createdAt: "2024-01-10 09:15:42",
      status: "archived",
      changes: "Security update",
    },
    {
      id: "v1",
      value: "sk_live_51F5H6I0cXtIWjm0A...",
      createdBy: "Mike Rodriguez",
      createdAt: "2024-01-05 16:22:18",
      status: "archived",
      changes: "Initial creation",
    },
  ]

  const accessLog = [
    {
      user: "Production API",
      action: "Retrieved",
      timestamp: "2024-01-15 14:45:12",
      ip: "10.0.1.100",
      status: "success",
    },
    {
      user: "Alex Chen",
      action: "Updated",
      timestamp: "2024-01-15 14:30:25",
      ip: "192.168.1.100",
      status: "success",
    },
    {
      user: "Staging API",
      action: "Retrieved",
      timestamp: "2024-01-15 12:20:33",
      ip: "10.0.2.50",
      status: "success",
    },
    {
      user: "Unknown",
      action: "Failed Access",
      timestamp: "2024-01-15 11:15:45",
      ip: "203.0.113.42",
      status: "failed",
    },
  ]

  const teamAccess = [
    {
      name: "Alex Chen",
      email: "alex@company.com",
      role: "Admin",
      permissions: "Full Access",
      lastAccess: "2 hours ago",
    },
    {
      name: "Sarah Johnson",
      email: "sarah@company.com",
      role: "Developer",
      permissions: "Read/Write",
      lastAccess: "1 day ago",
    },
    {
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
                <h1 className="text-2xl font-semibold text-slate-900">STRIPE_SECRET_KEY</h1>
                <p className="text-slate-600 mt-1">Payment processing secret key</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-red-100 text-red-700">Production</Badge>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="versions">Versions</TabsTrigger>
              <TabsTrigger value="access">Access Log</TabsTrigger>
              <TabsTrigger value="team">Team Access</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Secret Configuration</CardTitle>
                      <CardDescription>Manage the secret value and metadata</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Secret Name</Label>
                        <Input id="name" defaultValue="STRIPE_SECRET_KEY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="value">Secret Value</Label>
                        <div className="flex space-x-2">
                          <div className="flex-1 relative">
                            <Input
                              id="value"
                              type={isVisible ? "text" : "password"}
                              value={secretValue}
                              onChange={(e) => setSecretValue(e.target.value)}
                              className="pr-20"
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsVisible(!isVisible)}
                                className="h-6 w-6 p-0"
                              >
                                {isVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="environment">Environment</Label>
                          <Input id="environment" defaultValue="Production" readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="type">Type</Label>
                          <Input id="type" defaultValue="API Key" readOnly />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        Security Info
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Encryption</span>
                        <Badge variant="default">AES-256</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Created</span>
                        <span className="text-sm">Jan 5, 2024</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Last Modified</span>
                        <span className="text-sm">2 hours ago</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Version</span>
                        <span className="text-sm">v3</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Usage Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Total Accesses</span>
                        <span className="text-sm font-medium">1,247</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">This Month</span>
                        <span className="text-sm font-medium">89</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Last Access</span>
                        <span className="text-sm font-medium">2 hours ago</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="versions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <History className="mr-2 h-5 w-5" />
                    Version History
                  </CardTitle>
                  <CardDescription>Track changes and revert to previous versions if needed</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Version</TableHead>
                        <TableHead>Value Preview</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Changes</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {versions.map((version) => (
                        <TableRow key={version.id}>
                          <TableCell className="font-medium">{version.id}</TableCell>
                          <TableCell className="font-mono text-sm">{version.value}</TableCell>
                          <TableCell>{version.createdBy}</TableCell>
                          <TableCell>{version.createdAt}</TableCell>
                          <TableCell>{version.changes}</TableCell>
                          <TableCell>
                            <Badge variant={version.status === "current" ? "default" : "secondary"}>
                              {version.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {version.status !== "current" && (
                              <Button variant="outline" size="sm">
                                Restore
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="access" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Access History</CardTitle>
                  <CardDescription>Recent access attempts for this secret</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User/Service</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accessLog.map((log, index) => (
                        <TableRow key={index}>
                          <TableCell>{log.user}</TableCell>
                          <TableCell>{log.action}</TableCell>
                          <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                          <TableCell>{log.timestamp}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {log.status === "success" ? (
                                <CheckCircle className="h-4 w-4 text-emerald-600" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                              )}
                              <Badge
                                variant={log.status === "success" ? "default" : "destructive"}
                                className={
                                  log.status === "success"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-red-100 text-red-700"
                                }
                              >
                                {log.status}
                              </Badge>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Team Access
                  </CardTitle>
                  <CardDescription>Manage who can access this secret</CardDescription>
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
                      {teamAccess.map((member, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-slate-600">{member.email}</p>
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
          </Tabs>
        </main>
      </div>
    </div>
  )
}
