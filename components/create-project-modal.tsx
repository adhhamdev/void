"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { generateMasterKey } from "@/lib/crypto"

interface CreateProjectModalProps {
  trigger?: React.ReactNode
}

export function CreateProjectModal({ trigger }: CreateProjectModalProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    environment: "development" as "development" | "staging" | "production",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      // First, create or get user's default organization
      const { data: orgMember } = await supabase
        .from("organization_members")
        .select("organization_id, organizations(*)")
        .eq("user_id", user.id)
        .single()

      let organizationId: string

      if (!orgMember) {
        // Create default organization for user
        const orgSlug = `${user.email?.split("@")[0]}-org-${Date.now()}`
        const encryptionKey = generateMasterKey()

        const { data: newOrg, error: orgError } = await supabase.rpc("create_organization", {
          org_name: `${user.email?.split("@")[0]}'s Organization`,
          org_slug: orgSlug,
          encryption_key_hash: encryptionKey,
        })

        if (orgError) throw orgError
        organizationId = newOrg
      } else {
        organizationId = orgMember.organization_id
      }

      // Create project
      const projectSlug = formData.name.toLowerCase().replace(/[^a-z0-9]/g, "-")

      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          name: formData.name,
          description: formData.description,
          slug: projectSlug,
          organization_id: organizationId,
          default_environment: formData.environment,
          created_by: user.id,
        })
        .select()
        .single()

      if (projectError) throw projectError

      // Log audit event
      await supabase.rpc("log_audit_event", {
        org_id: organizationId,
        action_type: "created",
        resource_type_param: "project",
        resource_id_param: project.id,
        metadata_param: { project_name: formData.name },
      })

      toast({
        title: "Project created",
        description: `${formData.name} has been created successfully.`,
      })

      setOpen(false)
      setFormData({ name: "", description: "", environment: "development" })

      // Refresh the page to show new project
      window.location.reload()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Create a new project to organize your secrets and manage team access.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                placeholder="My Awesome Project"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of your project..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="environment">Default Environment</Label>
              <Select
                value={formData.environment}
                onValueChange={(value: "development" | "staging" | "production") =>
                  setFormData({ ...formData, environment: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.name.trim()}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
