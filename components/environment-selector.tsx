"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Globe } from "lucide-react"

const environments = [
  { value: "development", label: "Development", color: "bg-blue-100 text-blue-700" },
  { value: "staging", label: "Staging", color: "bg-yellow-100 text-yellow-700" },
  { value: "production", label: "Production", color: "bg-red-100 text-red-700" },
]

export function EnvironmentSelector() {
  const [selectedEnv, setSelectedEnv] = useState("production")

  const currentEnv = environments.find((env) => env.value === selectedEnv)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
          <Globe className="h-4 w-4" />
          <Badge className={currentEnv?.color}>{currentEnv?.label}</Badge>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {environments.map((env) => (
          <DropdownMenuItem
            key={env.value}
            onClick={() => setSelectedEnv(env.value)}
            className="flex items-center space-x-2"
          >
            <Badge className={env.color}>{env.label}</Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
