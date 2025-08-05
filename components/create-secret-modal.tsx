"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, EyeOff, Key, Plus } from "lucide-react"

interface CreateSecretModalProps {
  projectId?: string
  projectName?: string
  folderId?: string
  folderName?: string
  trigger?: React.ReactNode
}

export function CreateSecretModal({ projectId, projectName, folderId, folderName, trigger }: CreateSecretModalProps) {
  const [open, setOpen] = useState(false)
  const [secretName, setSecretName] = useState("")
  const [secretValue, setSecretValue] = useState("")
  const [description, setDescription] = useState("")
  const [secretType, setSecretType] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const secretTypes = [
    { id: "api-key", name: "API Key" },
    { id: "database-url", name: "Database URL" },
    { id: "auth-token", name: "Authentication Token" },
    { id: "webhook-secret", name: "Webhook Secret" },
    { id: "certificate", name: "Certificate" },
    { id: "other", name: "Other" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Reset form
    setSecretName("")
    setSecretValue("")
    setDescription("")
    setSecretType("")
    setIsVisible(false)
    setIsLoading(false)
    setOpen(false)
  }

  const getLocationText = () => {
    if (folderName && projectName) {
      return `${projectName} / ${folderName}`
    }
    if (projectName) {
      return projectName
    }
    return "Current location"
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Secret
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Key className="mr-2 h-5 w-5" />
            Create New Secret
          </DialogTitle>
          <DialogDescription>Add a new secret to {getLocationText()}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="secretName">Secret Name *</Label>
            <Input
              id="secretName"
              placeholder="e.g., DATABASE_URL, API_KEY"
              value={secretName}
              onChange={(e) => setSecretName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secretValue">Secret Value *</Label>
            <div className="relative">
              <Textarea
                id="secretValue"
                placeholder="Enter your secret value..."
                value={secretValue}
                onChange={(e) => setSecretValue(e.target.value)}
                rows={3}
                className="pr-12"
                required
                type={isVisible ? "text" : "password"}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(!isVisible)}
                className="absolute top-2 right-2 h-8 w-8 p-0"
              >
                {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="Brief description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secretType">Type (Optional)</Label>
            <Select value={secretType} onValueChange={setSecretType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {secretTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Secret"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
