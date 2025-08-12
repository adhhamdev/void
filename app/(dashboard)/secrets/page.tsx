"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { SecretCard } from "@/components/secret-card"
import { CreateSecretModal } from "@/components/create-secret-modal"

export default function SecretsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Mock secrets data
  const secrets = [
    {
      id: "1",
      name: "DATABASE_URL",
      description: "Primary database connection string",
      type: "database" as const,
      environment: "production" as const,
      lastUpdated: new Date("2024-01-15"),
      createdBy: "John Doe",
    },
    {
      id: "2",
      name: "API_KEY_STRIPE",
      description: "Stripe payment processing API key",
      type: "api_key" as const,
      environment: "production" as const,
      lastUpdated: new Date("2024-01-14"),
      createdBy: "Jane Smith",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Secrets</h1>
          <p className="text-muted-foreground">Manage your organization's secrets and API keys</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Secret
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search secrets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {secrets.map((secret) => (
          <SecretCard key={secret.id} secret={secret} />
        ))}
      </div>

      <CreateSecretModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </div>
  )
}
