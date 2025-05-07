"use server"

import { searchProducts } from "@/services/product-service"
import type { SearchResult } from "@/types/product"

export async function searchProductsAction(query: string): Promise<{
  results: SearchResult[]
  error?: string
}> {
  try {
    if (!query || query.trim() === "") {
      return { results: [] }
    }

    const results = await searchProducts(query)
    return { results }
  } catch (error) {
    console.error("Error in searchProductsAction:", error)
    return {
      results: [],
      error: "Failed to search products. Please try again.",
    }
  }
}
