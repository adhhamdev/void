"use client"

import { useState, useEffect } from "react"
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
import { Search, Users, UserPlus, Mail, Shield, User, Crown, Eye, MoreHorizontal, UserX, Loader2 } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface TeamMember {
  id: string
  user: {
    id: string
    full_name: string
    email: string
    avatar_url?: string
  }
  role: string
  joined_at: string
  last_active?: string
  secretsAccess: number
}

interface PendingInvite {
  id: string
  email: string
  role: string
  created_at: string
  invited_by: {
    full_name: string
    email: string
  }
  status: string
}

export default function TeamManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("")
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const { toast } = useToast()

  const fetchTeamMembers = async () => {
    try {
      // For now, using mock organization ID - in real app, get from context/auth
      const orgId = "mock-org-id"
      const response = await fetch(`/api/organizations/${orgId}/members`)
      if (response.ok) {
        const data = await response.json()
        setTeamMembers(data.members || [])
      }
    } catch (error) {
      console.error("Failed to fetch team members:", error)
      // Fallback to mock data for demo
      setTeamMembers([
        {
          id: "1",
          user: {
            id: "1",
            full_name: "Alex Chen",
            email: "alex@company.com",
          },
          role: "owner",
          joined_at: "2024-01-01T00:00:00Z",
          last_active: "Now",
          secretsAccess: 45,
        },
        {
          id: "2",
          user: {
            id: "2",
            full_name: "Sarah Johnson",
            email: "sarah@company.com",
          },
          role: "admin",
          joined_at: "2024-01-05T00:00:00Z",
          last_active: "2 hours ago",
          secretsAccess: 32,
        },
      ])
    }
  }

  const fetchPendingInvites = async () => {
    try {
      const orgId = "mock-org-id"
      const response = await fetch(`/api/organizations/${orgId}/invitations`)
      if (response.ok) {
        const data = await response.json()
        setPendingInvites(data.invitations || [])
      }
    } catch (error) {
      console.error("Failed to fetch invitations:", error)
      // Fallback to mock data
      setPendingInvites([
        {
          id: "1",
          email: "john@company.com",
          role: "developer",
          created_at: "2024-01-14T00:00:00Z",
          invited_by: {
            full_name: "Alex Chen",
            email: "alex@company.com",
          },
          status: "pending",
        },
      ])
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true)
      await Promise.all([fetchTeamMembers(), fetchPendingInvites()])
      setIsLoadingData(false)
    }
    loadData()
  }, [])

  const handleSendInvite = async () => {
    if (!inviteEmail || !inviteRole) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const orgId = "mock-org-id"
      const response = await fetch(`/api/organizations/${orgId}/invitations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Invitation sent successfully",
        })
        setInviteEmail("")
        setInviteRole("")
        setIsInviteOpen(false)
        fetchPendingInvites() // Refresh the list
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to send invitation",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelInvite = async (inviteId: string) => {
    try {
      const response = await fetch(`/api/invitations/${inviteId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Invitation cancelled",
        })
        fetchPendingInvites() // Refresh the list
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to cancel invitation",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel invitation",
        variant: "destructive",
      })
    }
  }

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (isLoadingData) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
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
              <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
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
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={handleSendInvite}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Mail className="mr-2 h-4 w-4" />
                      )}
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
                      {teamMembers.filter((m) => m.last_active).length}
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
                      {teamMembers.filter((m) => m.role === "admin" || m.role === "owner").length}
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
                                  {member.user.full_name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                              <div>
                                <Link href={`/team/${member.id}`} className="font-medium hover:underline">
                                  {member.user.full_name}
                                </Link>
                                <p className="text-sm text-slate-600">{member.user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getRoleColor(member.role)} flex items-center space-x-1 w-fit`}>
                              {getRoleIcon(member.role)}
                              <span className="capitalize">{member.role}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>{member.secretsAccess}</TableCell>
                          <TableCell>{member.last_active || "Recently"}</TableCell>
                          <TableCell>{formatDate(member.joined_at)}</TableCell>
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
                                {member.role !== "owner" && (
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
                              <span className="capitalize">{invite.role}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>{invite.invited_by.full_name}</TableCell>
                          <TableCell>{formatDate(invite.created_at)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(invite.status)} className="capitalize">
                              {invite.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                Resend
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleCancelInvite(invite.id)}>
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
