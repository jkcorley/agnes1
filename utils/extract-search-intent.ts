type SearchIntent = {
  query: string
  filters?: {
    minPrice?: number
    maxPrice?: number
    brand?: string
    category?: string
  }
}

export function extractSearchIntent(voiceText: string): SearchIntent {
  // Convert to lowercase for easier matching
  const text = voiceText.toLowerCase()

  // Default search intent
  const intent: SearchIntent = {
    query: voiceText,
    filters: {},
  }

  // Extract price range
  const priceRangeRegex = /(?:under|less than) \$?(\d+)/i
  const priceRangeMatch = text.match(priceRangeRegex)
  if (priceRangeMatch && priceRangeMatch[1]) {
    intent.filters!.maxPrice = Number.parseInt(priceRangeMatch[1], 10)

    // Remove the price filter from the query
    intent.query = intent.query.replace(priceRangeMatch[0], "").trim()
  }

  // Extract brand
  const brandRegex = /(?:by|from|brand) (apple|samsung|sony|google|amazon|microsoft|nike|adidas)/i
  const brandMatch = text.match(brandRegex)
  if (brandMatch && brandMatch[1]) {
    intent.filters!.brand = brandMatch[1]

    // Remove the brand filter from the query
    intent.query = intent.query.replace(brandMatch[0], "").trim()
  }

  // Extract category
  const categoryRegex = /(?:in|category) (electronics|clothing|shoes|books|home|kitchen|toys)/i
  const categoryMatch = text.match(categoryRegex)
  if (categoryMatch && categoryMatch[1]) {
    intent.filters!.category = categoryMatch[1]

    // Remove the category filter from the query
    intent.query = intent.query.replace(categoryMatch[0], "").trim()
  }

  // Clean up common phrases that aren't part of the actual search
  const cleanupPhrases = [
    "show me",
    "find me",
    "search for",
    "looking for",
    "i want",
    "i need",
    "can you find",
    "please find",
  ]

  for (const phrase of cleanupPhrases) {
    if (intent.query.toLowerCase().startsWith(phrase)) {
      intent.query = intent.query.substring(phrase.length).trim()
    }
  }

  return intent
}
