"use client"

import { useState, useEffect } from "react"
import { useVoiceRecognition } from "@/hooks/use-voice-recognition"
import { searchProductsAction } from "./actions"
import { VoiceButton } from "@/components/voice-button"
import { SearchBar } from "@/components/search-bar"
import { ProductGrid } from "@/components/product-grid"
import type { Product, SearchResult } from "@/types/product"
import { toast } from "@/components/ui/use-toast"
import { VoiceFeedback } from "@/components/voice-feedback"
import { extractSearchIntent } from "@/utils/extract-search-intent"
import { useRecentSearches } from "@/hooks/use-recent-searches"
import { RecentSearches } from "@/components/recent-searches"
import { VoiceTips } from "@/components/voice-tips"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [transcript, setTranscript] = useState("")
  const [sdkInitError, setSdkInitError] = useState<string | null>(null)

  const { recentSearches, addSearch, clearSearches } = useRecentSearches()

  const handleVoiceResult = (text: string) => {
    setTranscript(text)
    setSearchQuery(text)

    // Extract search intent
    const intent = extractSearchIntent(text)

    // Use the cleaned query for search
    handleSearch(intent.query)

    // Show toast with recognized intent
    if (Object.keys(intent.filters || {}).length > 0) {
      toast({
        title: "Search filters detected",
        description: `Searching for "${intent.query}" with filters: ${JSON.stringify(intent.filters)}`,
      })
    }
  }

  const {
    isRecording,
    isInitialized,
    isLoading: isVoiceLoading,
    startRecording,
    stopRecording,
  } = useVoiceRecognition({
    onResult: handleVoiceResult,
    onError: (error) => {
      setSdkInitError(error.message)
      toast({
        title: "Voice Recognition Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) return

    setIsSearching(true)
    try {
      // Add to recent searches
      addSearch(query)

      const { results, error } = await searchProductsAction(query)

      if (error) {
        toast({
          title: "Search Error",
          description: error,
          variant: "destructive",
        })
        return
      }

      setSearchResults(results)

      // Combine products from all sources
      const allProducts = results.flatMap((result) => result.products)
      setProducts(allProducts)
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Failed to search products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    if (transcript && !isRecording) {
      const timer = setTimeout(() => {
        setTranscript("")
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [transcript, isRecording])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Agnes v2.1</h1>
          <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />

          {/* Add recent searches component */}
          <div className="max-w-3xl mx-auto">
            <RecentSearches searches={recentSearches} onSelect={handleSearch} onClear={clearSearches} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {sdkInitError && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-medium text-yellow-800">Voice SDK Initialization Warning</h3>
            <p className="text-sm text-yellow-700">
              {sdkInitError}. Using mock voice recognition instead. Your searches will still work.
            </p>
          </div>
        )}

        {searchQuery && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Search results for "{searchQuery}"</h2>

            {searchResults.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {searchResults.map((result) => (
                  <div key={result.source} className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    {result.source}: {result.totalResults} results
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <ProductGrid products={products} isLoading={isSearching} />

        {!searchQuery && !products.length && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Welcome to Agnes v2.1</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Use the search bar or tap the microphone button to search for products across multiple platforms.
            </p>

            {/* Add voice tips component */}
            <div className="max-w-md mx-auto">
              <VoiceTips />
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleToggleRecording}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                disabled={!isInitialized && !!sdkInitError}
              >
                Try Voice Search
              </button>
            </div>
          </div>
        )}
      </main>

      <VoiceFeedback isRecording={isRecording} transcript={transcript} />
      <VoiceButton isRecording={isRecording} isLoading={isVoiceLoading} onClick={handleToggleRecording} />
    </div>
  )
}
