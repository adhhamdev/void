"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Users, UserPlus, Mail, Shield, User, Crown, Eye, MoreHorizontal, UserX } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

export default function TeamManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("")

  const teamMembers = [
    {
      id: "1",
      name: "Alex Chen",
      email: "alex@company.com",
      role: "Owner",
      status: "Active",
      lastActive: "Now",
      secretsAccess: 45,
      joinedDate: "Jan 1, 2024",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@company.com",
      role: "Admin",
      status: "Active",
      lastActive: "2 hours ago",
      secretsAccess: 32,
      joinedDate: "Jan 5, 2024",
    },
    {
      id: "3",
      name: "Mike Rodriguez",
      email: "mike@company.com",
      role: "Developer",
      status: "Active",
      lastActive: "1 day ago",
      secretsAccess: 18,
      joinedDate: "Jan 10, 2024",
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily@company.com",
      role: "Developer",
      status: "Inactive",
      lastActive: "1 week ago",
      secretsAccess: 12,
      joinedDate: "Jan 8, 2024",
    },
    {
      id: "5",
      name: "David Wilson",
      email: "david@company.com",
      role: "Viewer",
      status: "Active",
      lastActive: "3 hours ago",
      secretsAccess: 5,
      joinedDate: "Jan 12, 2024",
    },
  ]

  const pendingInvites = [
    {
      id: "1",
      email: "john@company.com",
      role: "Developer",
      invitedBy: "Alex Chen",
      invitedDate: "Jan 14, 2024",
      status: "Pending",
    },
    {
      id: "2",
      email: "lisa@company.com",
      role: "Viewer",
      invitedBy: "Sarah Johnson",
      invitedDate: "Jan 13, 2024",
      status: "Pending",
    },
  ]

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "owner":
        return <Crown className="h-4 w-4 text-yellow-600" />
      case "admin":
        return <Shield className="h-4 w-4 text-red-600" />
      case "developer":
        return <User className="h-4 w-4 text-blue-600" />
      case "viewer":
        return <Eye className="h-4 w-4 text-slate-600" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "owner":
        return "bg-yellow-100 text-yellow-700"
      case "admin":
        return "bg-red-100 text-red-700"
      case "developer":
        return "bg-blue-100 text-blue-700"
      case "viewer":
        return "bg-slate-100 text-slate-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-emerald-100 text-emerald-700"
      case "inactive":
        return "bg-slate-100 text-slate-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Team Management</h1>
              <p className="text-slate-600 mt-1">Manage team members and their access permissions</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search team members..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>Send an invitation to join your team</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="colleague@company.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={inviteRole} onValueChange={setInviteRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                          <SelectItem value="developer">Developer - Read/write access</SelectItem>
                          <SelectItem value="admin">Admin - Full access except billing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                      <Mail className="mr-2 h-4 w-4" />
                      Send Invitation
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
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
                    <p className="text-sm text-slate-600">Total Members</p>
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
                    <p className="text-sm text-slate-600">Active Members</p>
                    <p className="text-2xl font-semibold text-emerald-600">
                      {teamMembers.filter((m) => m.status === "Active").length}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-emerald-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Pending Invites</p>
                    <p className="text-2xl font-semibold text-yellow-600">{pendingInvites.length}</p>
                  </div>
                  <UserPlus className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Admins</p>
                    <p className="text-2xl font-semibold">
                      {teamMembers.filter((m) => m.role === "Admin" || m.role === "Owner").length}
                    </p>
                  </div>
                  <Crown className="h-8 w-8 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto px-6 pb-6">
          <Tabs defaultValue="members" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="members">Team Members</TabsTrigger>
              <TabsTrigger value="invites">Pending Invites</TabsTrigger>
            </TabsList>

            <TabsContent value="members" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage your team members and their permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Secrets Access</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Joined</TableHead>
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
                                <Link href={`/team/${member.id}`} className="font-medium hover:underline">
                                  {member.name}
                                </Link>
                                <p className="text-sm text-slate-600">{member.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getRoleColor(member.role)} flex items-center space-x-1 w-fit`}>
                              {getRoleIcon(member.role)}
                              <span>{member.role}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                          </TableCell>
                          <TableCell>{member.secretsAccess}</TableCell>
                          <TableCell>{member.lastActive}</TableCell>
                          <TableCell>{member.joinedDate}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Shield className="mr-2 h-4 w-4" />
                                  Change Role
                                </DropdownMenuItem>
                                {member.role !== "Owner" && (
                                  <DropdownMenuItem className="text-red-600">
                                    <UserX className="mr-2 h-4 w-4" />
                                    Remove Member
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invites" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Invitations</CardTitle>
                  <CardDescription>Manage pending team invitations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Invited By</TableHead>
                        <TableHead>Invited Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingInvites.map((invite) => (
                        <TableRow key={invite.id}>
                          <TableCell className="font-medium">{invite.email}</TableCell>
                          <TableCell>
                            <Badge className={`${getRoleColor(invite.role)} flex items-center space-x-1 w-fit`}>
                              {getRoleIcon(invite.role)}
                              <span>{invite.role}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>{invite.invitedBy}</TableCell>
                          <TableCell>{invite.invitedDate}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(invite.status)}>{invite.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                Resend
                              </Button>
                              <Button variant="outline" size="sm">
                                Cancel
                              </Button>
                            </div>
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
