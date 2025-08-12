"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Share2, UserPlus, Loader2, Trash2, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SecretPermission {
  id: string
  permission_level: string
  granted_at: string
  expires_at?: string
  user: {
    id: string
    full_name: string
    email: string
    avatar_url?: string
  }
  granted_by_user: {
    full_name: string
    email: string
  }
}

interface TeamMember {
  id: string
  full_name: string
  email: string
  avatar_url?: string
}

interface SecretSharingModalProps {
  secretId: string
  secretName: string
  trigger?: React.ReactNode
}

export function SecretSharingModal({ secretId, secretName, trigger }: SecretSharingModalProps) {
  const [open, setOpen] = useState(false)
  const [permissions, setPermissions] = useState<SecretPermission[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isGranting, setIsGranting] = useState(false)
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedPermission, setSelectedPermission] = useState("read")
  const [expiresAt, setExpiresAt] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      loadPermissions()
      loadTeamMembers()
    }
  }, [open])

  const loadPermissions = async () => {
    try {
      const response = await fetch(`/api/secrets/${secretId}/permissions`)
      if (response.ok) {
        const data = await response.json()
        setPermissions(data.permissions || [])
      }
    } catch (error) {
      console.error("Failed to load permissions:", error)
    }
  }

  const loadTeamMembers = async () => {
    try {
      // This would need to be implemented to get organization members
      // For now, using mock data
      setTeamMembers([
        {
          id: "1",
          full_name: "Sarah Johnson",
          email: "sarah@company.com",
        },
        {
          id: "2",
          full_name: "Mike Rodriguez",
          email: "mike@company.com",
        },
        {
          id: "3",
          full_name: "Emily Davis",
          email: "emily@company.com",
        },
      ])
    } catch (error) {
      console.error("Failed to load team members:", error)
    }
  }

  const handleGrantAccess = async () => {
    if (!selectedUser || !selectedPermission) {
      toast({
        title: "Error",
        description: "Please select a user and permission level",
        variant: "destructive",
      })
      return
    }

    setIsGranting(true)
    try {
      const response = await fetch(`/api/secrets/${secretId}/permissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: selectedUser,
          permission_level: selectedPermission,
          expires_at: expiresAt || null,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Access granted successfully",
        })
        setSelectedUser("")
        setSelectedPermission("read")
        setExpiresAt("")
        loadPermissions() // Refresh the list
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to grant access",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to grant access",
        variant: "destructive",
      })
    } finally {
      setIsGranting(false)
    }
  }

  const handleRevokeAccess = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to revoke access for ${userName}?`)) return

    try {
      const response = await fetch(`/api/secrets/${secretId}/permissions?user_id=${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Access revoked successfully",
        })
        loadPermissions() // Refresh the list
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to revoke access",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke access",
        variant: "destructive",
      })
    }
  }

  const getPermissionColor = (level: string) => {
    switch (level) {
      case "admin":
        return "bg-red-100 text-red-700"
      case "write":
        return "bg-blue-100 text-blue-700"
      case "read":
        return "bg-slate-100 text-slate-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const getPermissionLabel = (level: string) => {
    switch (level) {
      case "admin":
        return "Admin"
      case "write":
        return "Read/Write"
      case "read":
        return "Read Only"
      default:
        return level
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const availableUsers = teamMembers.filter(
    (member) => !permissions.some((permission) => permission.user.id === member.id),
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Share Secret</DialogTitle>
          <DialogDescription>Manage who can access "{secretName}" and their permission levels</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Grant New Access */}
          <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-4 w-4" />
              <h4 className="font-medium">Grant Access</h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user">Team Member</Label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        <div className="flex items-center space-x-2">
                          <span>{member.full_name}</span>
                          <span className="text-sm text-slate-500">({member.email})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="permission">Permission Level</Label>
                <Select value={selectedPermission} onValueChange={setSelectedPermission}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read">Read Only - Can view secret</SelectItem>
                    <SelectItem value="write">Read/Write - Can view and edit</SelectItem>
                    <SelectItem value="admin">Admin - Full control</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expires">Expires (Optional)</Label>
              <Input
                id="expires"
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>

            <Button onClick={handleGrantAccess} disabled={isGranting || !selectedUser} className="w-full">
              {isGranting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
              Grant Access
            </Button>
          </div>

          {/* Current Permissions */}
          <div className="space-y-4">
            <h4 className="font-medium">Current Access</h4>

            {permissions.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">
                No one has been granted specific access to this secret yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Permission</TableHead>
                    <TableHead>Granted</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={permission.user.avatar_url || "/placeholder.svg"} />
                            <AvatarFallback>
                              {permission.user.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{permission.user.full_name}</p>
                            <p className="text-sm text-slate-500">{permission.user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPermissionColor(permission.permission_level)}>
                          {getPermissionLabel(permission.permission_level)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">{formatDate(permission.granted_at)}</TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {permission.expires_at ? (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(permission.expires_at)}</span>
                          </div>
                        ) : (
                          "Never"
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevokeAccess(permission.user.id, permission.user.full_name)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
