"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Activity, Plus, Trash2, Edit, Users, Shield } from "lucide-react"

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAction, setFilterAction] = useState("all")
  const [filterUser, setFilterUser] = useState("all")

  // Mock audit logs data
  const auditLogs = [
    {
      id: "1",
      action: "Secret Created",
      target: "DATABASE_URL",
      user: "John Doe",
      userEmail: "john@company.com",
      timestamp: new Date("2024-01-15T10:30:00"),
      type: "create" as const,
      details: "Created new database connection secret",
      ipAddress: "192.168.1.100",
    },
    {
      id: "2",
      action: "Secret Updated",
      target: "API_KEY_STRIPE",
      user: "Jane Smith",
      userEmail: "jane@company.com",
      timestamp: new Date("2024-01-15T09:15:00"),
      type: "update" as const,
      details: "Updated Stripe API key value",
      ipAddress: "192.168.1.101",
    },
    {
      id: "3",
      action: "Team Member Added",
      target: "mike@company.com",
      user: "John Doe",
      userEmail: "john@company.com",
      timestamp: new Date("2024-01-14T16:45:00"),
      type: "team" as const,
      details: "Invited new team member with admin role",
      ipAddress: "192.168.1.100",
    },
    {
      id: "4",
      action: "Secret Deleted",
      target: "OLD_API_KEY",
      user: "Jane Smith",
      userEmail: "jane@company.com",
      timestamp: new Date("2024-01-14T14:20:00"),
      type: "delete" as const,
      details: "Permanently deleted deprecated API key",
      ipAddress: "192.168.1.101",
    },
  ]

  const getActionIcon = (type: string) => {
    switch (type) {
      case "create":
        return <Plus className="h-4 w-4 text-green-500" />
      case "update":
        return <Edit className="h-4 w-4 text-blue-500" />
      case "delete":
        return <Trash2 className="h-4 w-4 text-red-500" />
      case "team":
        return <Users className="h-4 w-4 text-purple-500" />
      case "access":
        return <Shield className="h-4 w-4 text-orange-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getActionBadge = (type: string) => {
    const variants = {
      create: "default",
      update: "secondary",
      delete: "destructive",
      team: "outline",
      access: "secondary",
    } as const
    return <Badge variant={variants[type as keyof typeof variants] || "outline"}>{type}</Badge>
  }

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesAction = filterAction === "all" || log.type === filterAction
    const matchesUser = filterUser === "all" || log.user === filterUser

    return matchesSearch && matchesAction && matchesUser
  })

  const uniqueUsers = [...new Set(auditLogs.map((log) => log.user))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">Track all activities and changes in your organization</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={filterAction} onValueChange={setFilterAction}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="create">Create</SelectItem>
            <SelectItem value="update">Update</SelectItem>
            <SelectItem value="delete">Delete</SelectItem>
            <SelectItem value="team">Team</SelectItem>
            <SelectItem value="access">Access</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterUser} onValueChange={setFilterUser}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by user" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            {uniqueUsers.map((user) => (
              <SelectItem key={user} value={user}>
                {user}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>
            Showing {filteredLogs.length} of {auditLogs.length} activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="mt-1">{getActionIcon(log.type)}</div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{log.action}</p>
                      {getActionBadge(log.type)}
                    </div>
                    <p className="text-sm text-muted-foreground">{log.timestamp.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Target:</span> {log.target}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">User:</span> {log.user} ({log.userEmail})
                    </p>
                    <p className="text-sm text-muted-foreground">{log.details}</p>
                    <p className="text-xs text-muted-foreground">IP Address: {log.ipAddress}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
