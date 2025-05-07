"use client"

import { useState, useEffect } from "react"

const MAX_RECENT_SEARCHES = 5

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches")
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches))
      } catch (e) {
        console.error("Failed to parse recent searches:", e)
      }
    }
  }, [])

  // Add a new search to recent searches
  const addSearch = (query: string) => {
    if (!query.trim()) return

    setRecentSearches((prev) => {
      // Remove the query if it already exists
      const filtered = prev.filter((s) => s !== query)

      // Add the new query to the beginning
      const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES)

      // Save to localStorage
      localStorage.setItem("recentSearches", JSON.stringify(updated))

      return updated
    })
  }

  // Clear all recent searches
  const clearSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }

  return {
    recentSearches,
    addSearch,
    clearSearches,
  }
}
