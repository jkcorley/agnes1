"use client"

import { X } from "lucide-react"

interface RecentSearchesProps {
  searches: string[]
  onSelect: (query: string) => void
  onClear: () => void
}

export function RecentSearches({ searches, onSelect, onClear }: RecentSearchesProps) {
  if (searches.length === 0) return null

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">Recent Searches</h3>
        <button onClick={onClear} className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          Clear All
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {searches.map((search) => (
          <button
            key={search}
            onClick={() => onSelect(search)}
            className="flex items-center gap-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-1 rounded-full transition-colors"
          >
            {search}
            <X className="h-3 w-3" />
          </button>
        ))}
      </div>
    </div>
  )
}
