"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Download, Eye, Key, Users, Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import Link from "next/link"

export default function AccessLogs() {
  const [searchQuery, setSearchQuery] = useState("")

  const logs = [
    {
      id: "1",
      action: "Secret Accessed",
      secret: "DATABASE_URL",
      user: "Alex Chen",
      timestamp: "2024-01-15 14:30:25",
      ip: "192.168.1.100",
      status: "success",
      method: "API",
    },
    {
      id: "2",
      action: "Secret Created",
      secret: "STRIPE_SECRET_KEY",
      user: "Sarah Johnson",
      timestamp: "2024-01-15 13:45:12",
      ip: "192.168.1.101",
      status: "success",
      method: "Dashboard",
    },
    {
      id: "3",
      action: "Failed Access Attempt",
      secret: "JWT_SECRET",
      user: "Unknown",
      timestamp: "2024-01-15 12:15:33",
      ip: "203.0.113.42",
      status: "failed",
      method: "API",
    },
    {
      id: "4",
      action: "Secret Updated",
      secret: "REDIS_URL",
      user: "Mike Rodriguez",
      timestamp: "2024-01-15 11:20:45",
      ip: "192.168.1.102",
      status: "success",
      method: "CLI",
    },
    {
      id: "5",
      action: "Team Member Added",
      secret: "N/A",
      user: "Alex Chen",
      timestamp: "2024-01-15 10:05:18",
      ip: "192.168.1.100",
      status: "success",
      method: "Dashboard",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-slate-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-emerald-100 text-emerald-700"
      case "failed":
        return "bg-red-100 text-red-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const getActionIcon = (action: string) => {
    if (action.includes("Access")) return <Eye className="h-4 w-4" />
    if (action.includes("Secret")) return <Key className="h-4 w-4" />
    if (action.includes("Team")) return <Users className="h-4 w-4" />
    return <Shield className="h-4 w-4" />
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Access Logs</h1>
              <p className="text-slate-600 mt-1">Monitor all secret access and security events</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search logs..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
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
                    <p className="text-sm text-slate-600">Total Events</p>
                    <p className="text-2xl font-semibold">1,247</p>
                  </div>
                  <Shield className="h-8 w-8 text-slate-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Successful Access</p>
                    <p className="text-2xl font-semibold text-emerald-600">1,198</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-emerald-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Failed Attempts</p>
                    <p className="text-2xl font-semibold text-red-600">49</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Active Users</p>
                    <p className="text-2xl font-semibold">12</p>
                  </div>
                  <Users className="h-8 w-8 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Logs Table */}
        <main className="flex-1 overflow-auto px-6 pb-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>All secret access and security events from the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Secret</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getActionIcon(log.action)}
                          <span>{log.action}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/secrets/${log.id}`}
                          className="bg-slate-100 px-2 py-1 rounded text-sm hover:bg-slate-200 transition-colors"
                        >
                          {log.secret}
                        </Link>
                      </TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.method}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(log.status)}
                          <Badge className={getStatusColor(log.status)}>{log.status}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">{log.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
