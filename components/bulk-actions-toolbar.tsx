"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { X, Trash2, FolderOpen, Download, Share2, MoreHorizontal, Loader2, Copy, Archive } from "lucide-react"
import { useBulkOperations } from "@/contexts/bulk-operations-context"
import { useToast } from "@/hooks/use-toast"

interface BulkActionsToolbarProps {
  onBulkDelete?: (ids: string[]) => Promise<void>
  onBulkMove?: (ids: string[], targetId: string) => Promise<void>
  onBulkExport?: (ids: string[]) => Promise<void>
  onBulkShare?: (ids: string[]) => void
  availableFolders?: Array<{ id: string; name: string }>
  availableProjects?: Array<{ id: string; name: string }>
}

export function BulkActionsToolbar({
  onBulkDelete,
  onBulkMove,
  onBulkExport,
  onBulkShare,
  availableFolders = [],
  availableProjects = [],
}: BulkActionsToolbarProps) {
  const { selectedItems, selectedCount, clearSelection } = useBulkOperations()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [moveTarget, setMoveTarget] = useState("")

  if (selectedCount === 0) return null

  const selectedIds = Array.from(selectedItems)

  const handleBulkDelete = async () => {
    if (!onBulkDelete) return

    const confirmed = confirm(
      `Are you sure you want to delete ${selectedCount} secret${selectedCount > 1 ? "s" : ""}? This action cannot be undone.`,
    )
    if (!confirmed) return

    setIsLoading(true)
    try {
      await onBulkDelete(selectedIds)
      toast({
        title: "Secrets deleted",
        description: `Successfully deleted ${selectedCount} secret${selectedCount > 1 ? "s" : ""}.`,
      })
      clearSelection()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete secrets",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkMove = async () => {
    if (!onBulkMove || !moveTarget) return

    setIsLoading(true)
    try {
      await onBulkMove(selectedIds, moveTarget)
      toast({
        title: "Secrets moved",
        description: `Successfully moved ${selectedCount} secret${selectedCount > 1 ? "s" : ""}.`,
      })
      clearSelection()
      setMoveTarget("")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to move secrets",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkExport = async () => {
    if (!onBulkExport) return

    setIsLoading(true)
    try {
      await onBulkExport(selectedIds)
      toast({
        title: "Export started",
        description: `Exporting ${selectedCount} secret${selectedCount > 1 ? "s" : ""}...`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to export secrets",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkShare = () => {
    if (onBulkShare) {
      onBulkShare(selectedIds)
    }
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-4 flex items-center space-x-4 min-w-[400px]">
        {/* Selection Info */}
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
            {selectedCount} selected
          </Badge>
          <Button variant="ghost" size="sm" onClick={clearSelection} className="h-6 w-6 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          {onBulkDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDelete}
              disabled={isLoading}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
          )}

          {onBulkExport && (
            <Button variant="outline" size="sm" onClick={handleBulkExport} disabled={isLoading}>
              <Download className="h-4 w-4" />
            </Button>
          )}

          {onBulkShare && (
            <Button variant="outline" size="sm" onClick={handleBulkShare} disabled={isLoading}>
              <Share2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Move Action */}
        {onBulkMove && (availableFolders.length > 0 || availableProjects.length > 0) && (
          <div className="flex items-center space-x-2">
            <Select value={moveTarget} onValueChange={setMoveTarget}>
              <SelectTrigger className="w-[180px] h-8">
                <SelectValue placeholder="Move to..." />
              </SelectTrigger>
              <SelectContent>
                {availableFolders.length > 0 && (
                  <>
                    <div className="px-2 py-1 text-xs font-medium text-slate-500">Folders</div>
                    {availableFolders.map((folder) => (
                      <SelectItem key={`folder-${folder.id}`} value={`folder-${folder.id}`}>
                        <div className="flex items-center">
                          <FolderOpen className="h-4 w-4 mr-2" />
                          {folder.name}
                        </div>
                      </SelectItem>
                    ))}
                  </>
                )}
                {availableProjects.length > 0 && (
                  <>
                    {availableFolders.length > 0 && (
                      <SelectItem value="separator" disabled>
                        ---
                      </SelectItem>
                    )}
                    <div className="px-2 py-1 text-xs font-medium text-slate-500">Projects</div>
                    {availableProjects.map((project) => (
                      <SelectItem key={`project-${project.id}`} value={`project-${project.id}`}>
                        <div className="flex items-center">
                          <Copy className="h-4 w-4 mr-2" />
                          {project.name}
                        </div>
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              onClick={handleBulkMove}
              disabled={!moveTarget || isLoading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Move
            </Button>
          </div>
        )}

        {/* More Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(selectedIds.join("\n"))}>
              <Copy className="mr-2 h-4 w-4" />
              Copy IDs
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Archive className="mr-2 h-4 w-4" />
              Archive Selected
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={clearSelection}>
              <X className="mr-2 h-4 w-4" />
              Clear Selection
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
