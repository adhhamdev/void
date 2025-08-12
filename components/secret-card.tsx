"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Copy, Edit, Trash2, Key, Database, Shield, Webhook, FileText, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SecretSharingModal } from "@/components/secret-sharing-modal"
import Link from "next/link"

interface Secret {
  id: string
  name: string
  description?: string
  lastModified: string
  environment: string
  type: string
}

interface SecretCardProps {
  secret: Secret
}

const getSecretIcon = (type: string) => {
  switch (type) {
    case "database":
      return Database
    case "auth":
      return Shield
    case "api":
      return Webhook
    case "certificate":
      return FileText
    default:
      return Key
  }
}

const getEnvironmentColor = (env: string) => {
  switch (env) {
    case "development":
      return "bg-blue-100 text-blue-700"
    case "staging":
      return "bg-yellow-100 text-yellow-700"
    case "production":
      return "bg-red-100 text-red-700"
    default:
      return "bg-slate-100 text-slate-700"
  }
}

export function SecretCard({ secret }: SecretCardProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const Icon = getSecretIcon(secret.type)

  const handleCopySecret = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would fetch and decrypt the secret
      // For now, we'll just show a placeholder
      await navigator.clipboard.writeText("***SECRET_VALUE***")
      toast({
        title: "Copied to clipboard",
        description: `${secret.name} has been copied to your clipboard.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy secret to clipboard.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSecret = async () => {
    if (!confirm(`Are you sure you want to delete ${secret.name}?`)) return

    setIsLoading(true)
    try {
      // Delete secret logic would go here
      toast({
        title: "Secret deleted",
        description: `${secret.name} has been deleted.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete secret.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-slate-500" />
            <CardTitle className="text-base">
              <Link href={`/secrets/${secret.id}`} className="hover:underline">
                {secret.name}
              </Link>
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getEnvironmentColor(secret.environment)}>{secret.environment}</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/secrets/${secret.id}`} className="flex items-center">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopySecret} disabled={isLoading}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Value
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <SecretSharingModal
                  secretId={secret.id}
                  secretName={secret.name}
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                  }
                />
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDeleteSecret} disabled={isLoading} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {secret.description && <CardDescription className="line-clamp-2">{secret.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Updated {secret.lastModified}</span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleCopySecret} disabled={isLoading}>
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <SecretSharingModal
              secretId={secret.id}
              secretName={secret.name}
              trigger={
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
