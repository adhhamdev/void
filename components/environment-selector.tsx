"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Globe, Zap, Code } from "lucide-react"

export function EnvironmentSelector() {
  const [selectedEnv, setSelectedEnv] = useState("production")

  const environments = [
    { id: "production", name: "Production", icon: Globe, color: "bg-red-100 text-red-700" },
    { id: "staging", name: "Staging", icon: Zap, color: "bg-yellow-100 text-yellow-700" },
    { id: "development", name: "Development", icon: Code, color: "bg-green-100 text-green-700" },
  ]

  const currentEnv = environments.find((env) => env.id === selectedEnv)
  const CurrentIcon = currentEnv?.icon || Globe

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
          <CurrentIcon className="h-4 w-4" />
          <span>{currentEnv?.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {environments.map((env) => {
          const Icon = env.icon
          return (
            <DropdownMenuItem
              key={env.id}
              onClick={() => setSelectedEnv(env.id)}
              className="flex items-center space-x-2"
            >
              <Icon className="h-4 w-4" />
              <span>{env.name}</span>
              {env.id === selectedEnv && (
                <Badge variant="secondary" className="ml-auto">
                  Active
                </Badge>
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
