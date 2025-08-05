"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Key, Users, Settings, History, Folder, ChevronDown, ChevronRight, Plus } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavigationLink } from "./navigation-link"

export function Sidebar() {
  const [expandedProjects, setExpandedProjects] = useState<string[]>(["web-app"])
  const pathname = usePathname()

  const projects = [
    {
      id: "web-app",
      name: "Web Application",
      folders: ["Authentication", "Database", "External APIs"],
      environment: "production",
    },
    {
      id: "mobile-app",
      name: "Mobile App",
      folders: ["Push Notifications", "Analytics"],
      environment: "staging",
    },
    {
      id: "api-service",
      name: "API Service",
      folders: ["Core Services", "Third Party"],
      environment: "development",
    },
  ]

  const toggleProject = (projectId: string) => {
    setExpandedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId],
    )
  }

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <Shield className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">SecureVault</h2>
            <p className="text-xs text-slate-500">Enterprise</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="space-y-1">
          <NavigationLink href="/dashboard">
            <Key className="mr-3 h-4 w-4" />
            All Secrets
          </NavigationLink>
          <NavigationLink href="/team">
            <Users className="mr-3 h-4 w-4" />
            Team
          </NavigationLink>
          <NavigationLink href="/logs">
            <History className="mr-3 h-4 w-4" />
            Access Logs
          </NavigationLink>
          <NavigationLink href="/settings">
            <Settings className="mr-3 h-4 w-4" />
            Settings
          </NavigationLink>
        </div>

        <div className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-700">Projects</h3>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="space-y-1">
            {projects.map((project) => (
              <div key={project.id}>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-2 h-auto"
                  onClick={() => toggleProject(project.id)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      {expandedProjects.includes(project.id) ? (
                        <ChevronDown className="mr-2 h-3 w-3" />
                      ) : (
                        <ChevronRight className="mr-2 h-3 w-3" />
                      )}
                      <Folder className="mr-2 h-4 w-4 text-slate-500" />
                      <Link href={`/projects/${project.id}`} className="text-sm hover:underline">
                        {project.name}
                      </Link>
                    </div>
                    <Badge variant={project.environment === "production" ? "default" : "secondary"} className="text-xs">
                      {project.environment.slice(0, 4)}
                    </Badge>
                  </div>
                </Button>

                {expandedProjects.includes(project.id) && (
                  <div className="ml-6 space-y-1">
                    {project.folders.map((folder, index) => (
                      <Link key={folder} href={`/folders/${project.id}-${index}`}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-sm text-slate-600 h-8 hover:bg-slate-100"
                        >
                          <Folder className="mr-2 h-3 w-3" />
                          {folder}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <Link href="/settings">
        <div className="p-4 border-t border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-emerald-700">AC</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">Alex Chen</p>
              <p className="text-xs text-slate-500 truncate">alex@company.com</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
