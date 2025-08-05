"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Folder, Key } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { EnvironmentSelector } from "@/components/environment-selector"
import { SecretCard } from "@/components/secret-card"
import { CreateSecretModal } from "@/components/create-secret-modal"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function FolderDetail() {
  const params = useParams()
  const folderName = "Authentication" // This would come from API
  const projectName = "Web Application" // This would come from API
  const projectId = "web-app" // This would come from API

  const secrets = [
    {
      id: "1",
      name: "JWT_SECRET",
      description: "JSON Web Token signing secret",
      lastModified: "2 hours ago",
      environment: "production",
      type: "auth",
    },
    {
      id: "2",
      name: "OAUTH_CLIENT_SECRET",
      description: "OAuth client secret for authentication",
      lastModified: "1 day ago",
      environment: "production",
      type: "auth",
    },
    {
      id: "3",
      name: "SESSION_SECRET",
      description: "Session encryption secret",
      lastModified: "3 days ago",
      environment: "production",
      type: "auth",
    },
  ]

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={`/projects/${projectId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to {projectName}
                </Button>
              </Link>
              <div>
                <div className="flex items-center space-x-2">
                  <Folder className="h-6 w-6 text-slate-500" />
                  <h1 className="text-2xl font-semibold text-slate-900">{folderName}</h1>
                </div>
                <p className="text-slate-600 mt-1">
                  {projectName} / {folderName}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <EnvironmentSelector />
              <CreateSecretModal
                projectId={projectId}
                projectName={projectName}
                folderId={params.id as string}
                folderName={folderName}
              />
            </div>
          </div>
        </header>

        {/* Stats Card */}
        <div className="p-6 pb-0">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Secrets in this folder</p>
                  <p className="text-2xl font-semibold">{secrets.length}</p>
                </div>
                <Key className="h-8 w-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto px-6 pb-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {secrets.map((secret) => (
                <SecretCard key={secret.id} secret={secret} />
              ))}
            </div>

            {secrets.length === 0 && (
              <div className="text-center py-12">
                <Folder className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No secrets yet</h3>
                <p className="text-slate-600 mb-4">Get started by creating your first secret in this folder.</p>
                <CreateSecretModal
                  projectId={projectId}
                  projectName={projectName}
                  folderId={params.id as string}
                  folderName={folderName}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
