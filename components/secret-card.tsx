"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, EyeOff, Copy, MoreHorizontal, Database, Key, Globe, History, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

interface Secret {
  id: string
  name: string
  description: string
  lastModified: string
  environment: string
  type: string
}

interface SecretCardProps {
  secret: Secret
}

export function SecretCard({ secret }: SecretCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "database":
        return Database
      case "api":
        return Globe
      case "auth":
        return Key
      default:
        return Key
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "database":
        return "bg-blue-100 text-blue-700"
      case "api":
        return "bg-purple-100 text-purple-700"
      case "auth":
        return "bg-emerald-100 text-emerald-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const handleCopy = () => {
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const TypeIcon = getTypeIcon(secret.type)

  return (
    <Link href={`/secrets/${secret.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className={`p-1.5 rounded-md ${getTypeColor(secret.type)}`}>
                <TypeIcon className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base">{secret.name}</CardTitle>
                <CardDescription className="text-sm">{secret.description}</CardDescription>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <History className="mr-2 h-4 w-4" />
                  View History
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-slate-100 rounded-md p-2 font-mono text-sm">
              {isVisible ? "sk_live_51H..." : "••••••••••••••••"}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsVisible(!isVisible)} className="h-8 w-8 p-0">
              {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 w-8 p-0">
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <Badge variant={secret.environment === "production" ? "default" : "secondary"}>{secret.environment}</Badge>
            <span className="text-slate-500">Updated {secret.lastModified}</span>
          </div>

          {isCopied && <div className="text-xs text-emerald-600 font-medium">Copied to clipboard!</div>}
        </CardContent>
      </Card>
    </Link>
  )
}
