"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Search, Key, Folder, Users, FileText, Clock, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface SearchResult {
  id: string
  title: string
  description: string
  type: "secret" | "project" | "folder" | "team" | "log"
  url: string
  metadata?: {
    environment?: string
    lastModified?: string
    secretType?: string
  }
}

interface GlobalSearchProps {
  trigger?: React.ReactNode
}

export function GlobalSearch({ trigger }: GlobalSearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recent-searches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Keyboard shortcut to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Search function
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      // Mock search results - in real app, this would call your search API
      const mockResults: SearchResult[] = [
        {
          id: "1",
          title: "DATABASE_URL",
          description: "Primary database connection string",
          type: "secret",
          url: "/secrets/1",
          metadata: {
            environment: "production",
            lastModified: "2 hours ago",
            secretType: "database-url",
          },
        },
        {
          id: "2",
          title: "Web Application",
          description: "Main web application secrets and configuration",
          type: "project",
          url: "/projects/2",
          metadata: {
            lastModified: "1 day ago",
          },
        },
        {
          id: "3",
          title: "Authentication",
          description: "Auth-related secrets and tokens",
          type: "folder",
          url: "/folders/3",
          metadata: {
            lastModified: "3 days ago",
          },
        },
        {
          id: "4",
          title: "Alex Chen",
          description: "alex@company.com - Admin",
          type: "team",
          url: "/team/4",
        },
      ].filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      setResults(mockResults)
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle search input change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  const handleSelect = (result: SearchResult) => {
    // Save to recent searches
    const newRecentSearches = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5)
    setRecentSearches(newRecentSearches)
    localStorage.setItem("recent-searches", JSON.stringify(newRecentSearches))

    // Navigate to result
    router.push(result.url)
    setOpen(false)
    setQuery("")
  }

  const handleRecentSearch = (searchTerm: string) => {
    setQuery(searchTerm)
    performSearch(searchTerm)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "secret":
        return <Key className="h-4 w-4" />
      case "project":
        return <Folder className="h-4 w-4" />
      case "folder":
        return <Folder className="h-4 w-4" />
      case "team":
        return <Users className="h-4 w-4" />
      case "log":
        return <FileText className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "secret":
        return "bg-emerald-100 text-emerald-700"
      case "project":
        return "bg-blue-100 text-blue-700"
      case "folder":
        return "bg-yellow-100 text-yellow-700"
      case "team":
        return "bg-purple-100 text-purple-700"
      case "log":
        return "bg-slate-100 text-slate-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        <Button
          variant="outline"
          className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64 bg-transparent"
          onClick={() => setOpen(true)}
        >
          <Search className="mr-2 h-4 w-4" />
          Search...
          <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      )}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search secrets, projects, team members..." value={query} onValueChange={setQuery} />
        <CommandList>
          <CommandEmpty>{isLoading ? "Searching..." : "No results found."}</CommandEmpty>

          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <CommandGroup heading="Recent Searches">
              {recentSearches.map((search, index) => (
                <CommandItem key={index} onSelect={() => handleRecentSearch(search)}>
                  <Clock className="mr-2 h-4 w-4" />
                  {search}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Search Results */}
          {results.length > 0 && (
            <>
              {!query && recentSearches.length > 0 && <CommandSeparator />}
              <CommandGroup heading="Results">
                {results.map((result) => (
                  <CommandItem key={result.id} onSelect={() => handleSelect(result)}>
                    <div className="flex items-center space-x-3 w-full">
                      {getTypeIcon(result.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium truncate">{result.title}</span>
                          <Badge className={`${getTypeColor(result.type)} text-xs`}>{result.type}</Badge>
                          {result.metadata?.environment && (
                            <Badge variant="outline" className="text-xs">
                              {result.metadata.environment}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{result.description}</p>
                        {result.metadata?.lastModified && (
                          <p className="text-xs text-muted-foreground">Updated {result.metadata.lastModified}</p>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {/* Quick Actions */}
          {!query && (
            <>
              {recentSearches.length > 0 && <CommandSeparator />}
              <CommandGroup heading="Quick Actions">
                <CommandItem onSelect={() => router.push("/dashboard")}>
                  <Folder className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </CommandItem>
                <CommandItem onSelect={() => router.push("/team")}>
                  <Users className="mr-2 h-4 w-4" />
                  Manage Team
                </CommandItem>
                <CommandItem onSelect={() => router.push("/logs")}>
                  <FileText className="mr-2 h-4 w-4" />
                  View Access Logs
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
