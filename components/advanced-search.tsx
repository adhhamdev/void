"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, X, CalendarIcon, SlidersHorizontal } from "lucide-react"
import { format } from "date-fns"

interface SearchFilter {
  query: string
  environment: string[]
  secretType: string[]
  dateRange: {
    from?: Date
    to?: Date
  }
  status: string[]
  createdBy: string[]
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilter) => void
  placeholder?: string
  showEnvironmentFilter?: boolean
  showTypeFilter?: boolean
  showDateFilter?: boolean
  showStatusFilter?: boolean
  showUserFilter?: boolean
  className?: string
}

export function AdvancedSearch({
  onSearch,
  placeholder = "Search...",
  showEnvironmentFilter = true,
  showTypeFilter = true,
  showDateFilter = true,
  showStatusFilter = true,
  showUserFilter = true,
  className,
}: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<SearchFilter>({
    query: "",
    environment: [],
    secretType: [],
    dateRange: {},
    status: [],
    createdBy: [],
  })

  const [activeFilters, setActiveFilters] = useState<SearchFilter>({
    query: "",
    environment: [],
    secretType: [],
    dateRange: {},
    status: [],
    createdBy: [],
  })

  const handleApplyFilters = () => {
    setActiveFilters(filters)
    onSearch(filters)
    setIsOpen(false)
  }

  const handleClearFilters = () => {
    const clearedFilters: SearchFilter = {
      query: "",
      environment: [],
      secretType: [],
      dateRange: {},
      status: [],
      createdBy: [],
    }
    setFilters(clearedFilters)
    setActiveFilters(clearedFilters)
    onSearch(clearedFilters)
  }

  const handleQuickSearch = (query: string) => {
    const quickFilters = { ...activeFilters, query }
    setActiveFilters(quickFilters)
    onSearch(quickFilters)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (activeFilters.environment.length > 0) count++
    if (activeFilters.secretType.length > 0) count++
    if (activeFilters.dateRange.from || activeFilters.dateRange.to) count++
    if (activeFilters.status.length > 0) count++
    if (activeFilters.createdBy.length > 0) count++
    return count
  }

  const removeFilter = (type: keyof SearchFilter, value?: string) => {
    const newFilters = { ...activeFilters }

    if (type === "dateRange") {
      newFilters.dateRange = {}
    } else if (Array.isArray(newFilters[type]) && value) {
      newFilters[type] = (newFilters[type] as string[]).filter((item) => item !== value)
    }

    setActiveFilters(newFilters)
    onSearch(newFilters)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Quick Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder={placeholder}
            value={activeFilters.query}
            onChange={(e) => handleQuickSearch(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="relative bg-transparent">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
              {getActiveFilterCount() > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">{getActiveFilterCount()}</Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Advanced Search</DialogTitle>
              <DialogDescription>Use advanced filters to find exactly what you're looking for</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Search Query */}
              <div className="space-y-2">
                <Label htmlFor="search-query">Search Query</Label>
                <Input
                  id="search-query"
                  placeholder="Enter search terms..."
                  value={filters.query}
                  onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Environment Filter */}
                {showEnvironmentFilter && (
                  <div className="space-y-2">
                    <Label>Environment</Label>
                    <div className="space-y-2">
                      {["development", "staging", "production"].map((env) => (
                        <div key={env} className="flex items-center space-x-2">
                          <Checkbox
                            id={`env-${env}`}
                            checked={filters.environment.includes(env)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFilters({
                                  ...filters,
                                  environment: [...filters.environment, env],
                                })
                              } else {
                                setFilters({
                                  ...filters,
                                  environment: filters.environment.filter((e) => e !== env),
                                })
                              }
                            }}
                          />
                          <Label htmlFor={`env-${env}`} className="capitalize">
                            {env}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Secret Type Filter */}
                {showTypeFilter && (
                  <div className="space-y-2">
                    <Label>Secret Type</Label>
                    <div className="space-y-2">
                      {["api-key", "database-url", "auth-token", "webhook-secret", "certificate", "other"].map(
                        (type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={`type-${type}`}
                              checked={filters.secretType.includes(type)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilters({
                                    ...filters,
                                    secretType: [...filters.secretType, type],
                                  })
                                } else {
                                  setFilters({
                                    ...filters,
                                    secretType: filters.secretType.filter((t) => t !== type),
                                  })
                                }
                              }}
                            />
                            <Label htmlFor={`type-${type}`} className="capitalize">
                              {type.replace("-", " ")}
                            </Label>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Date Range Filter */}
              {showDateFilter && (
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="flex items-center space-x-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dateRange.from ? (
                            filters.dateRange.to ? (
                              <>
                                {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                                {format(filters.dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(filters.dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={filters.dateRange.from}
                          selected={{
                            from: filters.dateRange.from,
                            to: filters.dateRange.to,
                          }}
                          onSelect={(range) =>
                            setFilters({
                              ...filters,
                              dateRange: { from: range?.from, to: range?.to },
                            })
                          }
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}

              {/* Status Filter */}
              {showStatusFilter && (
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex flex-wrap gap-2">
                    {["active", "inactive", "expired", "pending"].map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={filters.status.includes(status)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters({
                                ...filters,
                                status: [...filters.status, status],
                              })
                            } else {
                              setFilters({
                                ...filters,
                                status: filters.status.filter((s) => s !== status),
                              })
                            }
                          }}
                        />
                        <Label htmlFor={`status-${status}`} className="capitalize">
                          {status}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleClearFilters}>
                Clear All
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleApplyFilters}>Apply Filters</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Filters */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.environment.map((env) => (
            <Badge key={`env-${env}`} variant="secondary" className="flex items-center gap-1">
              Environment: {env}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("environment", env)} />
            </Badge>
          ))}
          {activeFilters.secretType.map((type) => (
            <Badge key={`type-${type}`} variant="secondary" className="flex items-center gap-1">
              Type: {type.replace("-", " ")}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("secretType", type)} />
            </Badge>
          ))}
          {(activeFilters.dateRange.from || activeFilters.dateRange.to) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Date: {activeFilters.dateRange.from && format(activeFilters.dateRange.from, "MMM dd")}
              {activeFilters.dateRange.to && ` - ${format(activeFilters.dateRange.to, "MMM dd")}`}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("dateRange")} />
            </Badge>
          )}
          {activeFilters.status.map((status) => (
            <Badge key={`status-${status}`} variant="secondary" className="flex items-center gap-1">
              Status: {status}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("status", status)} />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
