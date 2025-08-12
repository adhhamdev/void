"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

interface BulkOperationsContextType {
  selectedItems: Set<string>
  selectItem: (id: string) => void
  deselectItem: (id: string) => void
  selectAll: (ids: string[]) => void
  clearSelection: () => void
  isSelected: (id: string) => boolean
  selectedCount: number
  bulkMode: boolean
  setBulkMode: (enabled: boolean) => void
}

const BulkOperationsContext = createContext<BulkOperationsContextType | undefined>(undefined)

export function BulkOperationsProvider({ children }: { children: React.ReactNode }) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [bulkMode, setBulkMode] = useState(false)

  const selectItem = useCallback((id: string) => {
    setSelectedItems((prev) => new Set(prev).add(id))
  }, [])

  const deselectItem = useCallback((id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }, [])

  const selectAll = useCallback((ids: string[]) => {
    setSelectedItems(new Set(ids))
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedItems(new Set())
    setBulkMode(false)
  }, [])

  const isSelected = useCallback(
    (id: string) => {
      return selectedItems.has(id)
    },
    [selectedItems],
  )

  const selectedCount = selectedItems.size

  return (
    <BulkOperationsContext.Provider
      value={{
        selectedItems,
        selectItem,
        deselectItem,
        selectAll,
        clearSelection,
        isSelected,
        selectedCount,
        bulkMode,
        setBulkMode,
      }}
    >
      {children}
    </BulkOperationsContext.Provider>
  )
}

export function useBulkOperations() {
  const context = useContext(BulkOperationsContext)
  if (context === undefined) {
    throw new Error("useBulkOperations must be used within a BulkOperationsProvider")
  }
  return context
}
