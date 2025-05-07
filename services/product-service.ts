import type { Product, SearchResult } from "@/types/product"
import { extractSearchIntent } from "@/utils/extract-search-intent"

// Mock product data for development and fallback
const mockProducts: Record<string, Product[]> = {
  google: [
    {
      id: "google-1",
      title: "iPhone 15 Pro Max - 256GB - Deep Blue",
      description: "Apple's latest flagship phone with A17 Pro chip and titanium design",
      price: 1199.99,
      currency: "USD",
      image: "/placeholder.svg?height=200&width=200&text=iPhone+15+Pro",
      url: "https://example.com/iphone15pro",
      source: "Google Shopping",
      rating: 4.8,
      reviews: 1245,
    },
    {
      id: "google-2",
      title: "Samsung Galaxy S23 Ultra - 512GB - Phantom Black",
      description: "Samsung's premium smartphone with S Pen and 200MP camera",
      price: 1099.99,
      currency: "USD",
      image: "/placeholder.svg?height=200&width=200&text=Galaxy+S23+Ultra",
      url: "https://example.com/galaxys23ultra",
      source: "Google Shopping",
      rating: 4.7,
      reviews: 982,
    },
  ],
  amazon: [
    {
      id: "amazon-1",
      title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
      description: "Industry-leading noise cancellation with exceptional sound quality",
      price: 349.99,
      currency: "USD",
      image: "/placeholder.svg?height=200&width=200&text=Sony+WH-1000XM5",
      url: "https://example.com/sonywh1000xm5",
      source: "Amazon",
      rating: 4.6,
      reviews: 3782,
    },
    {
      id: "amazon-2",
      title: "Apple AirPods Pro (2nd Generation)",
      description: "Active Noise Cancellation, Transparency mode, Spatial Audio",
      price: 249.99,
      currency: "USD",
      image: "/placeholder.svg?height=200&width=200&text=AirPods+Pro",
      url: "https://example.com/airpodspro",
      source: "Amazon",
      rating: 4.7,
      reviews: 5621,
    },
  ],
  walmart: [
    {
      id: "walmart-1",
      title: "Ninja DualBrew Pro Coffee Maker",
      description: "Coffee System with 12-Cup Carafe, Single-Serve",
      price: 199.99,
      currency: "USD",
      image: "/placeholder.svg?height=200&width=200&text=Ninja+Coffee",
      url: "https://example.com/ninjacoffee",
      source: "Walmart",
      rating: 4.5,
      reviews: 1876,
    },
    {
      id: "walmart-2",
      title: "Dyson V11 Torque Drive Cordless Vacuum",
      description: "Intelligent cordless vacuum with up to 60 minutes of run time",
      price: 599.99,
      currency: "USD",
      image: "/placeholder.svg?height=200&width=200&text=Dyson+V11",
      url: "https://example.com/dysonv11",
      source: "Walmart",
      rating: 4.8,
      reviews: 2341,
    },
  ],
}

export async function searchProducts(voiceText: string): Promise<SearchResult[]> {
  try {
    const intent = extractSearchIntent(voiceText)
    const query = intent.query
    const filters = intent.filters

    const results: SearchResult[] = []

    // Fetch from Google Shopping
    const googleProducts = await fetchGoogleShoppingProducts(query, filters)
    if (googleProducts) {
      results.push(googleProducts)
    }

    // Fetch from Amazon
    const amazonProducts = await fetchAmazonProducts(query, filters)
    if (amazonProducts) {
      results.push(amazonProducts)
    }

    // Add Walmart as another source
    const walmartProducts = await fetchWalmartProducts(query, filters)
    if (walmartProducts) {
      results.push(walmartProducts)
    }

    // If no results were found, use mock data
    if (results.length === 0) {
      console.log("No API results found, using mock data")
      results.push({
        products: [...mockProducts.google, ...mockProducts.amazon, ...mockProducts.walmart],
        totalResults: 6,
        source: "Mock Data",
      })
    }

    return results
  } catch (error) {
    console.error("Error searching products:", error)

    // Return mock data as fallback
    return [
      {
        products: [...mockProducts.google, ...mockProducts.amazon, ...mockProducts.walmart],
        totalResults: 6,
        source: "Mock Data (Fallback)",
      },
    ]
  }
}

async function fetchGoogleShoppingProducts(query: string, filters?: any): Promise<SearchResult | null> {
  try {
    // Check if RapidAPI key is available
    if (!process.env.NEXT_PUBLIC_RAPID_API_KEY) {
      console.warn("RapidAPI key not found, using mock data for Google Shopping")
      return {
        products: mockProducts.google,
        totalResults: mockProducts.google.length,
        source: "Google Shopping (Mock)",
      }
    }

    let url = `https://google-shopping-product-search.p.rapidapi.com/search?q=${encodeURIComponent(query)}&country=us&language=en`

    // Add filters to the URL if they exist
    if (filters?.maxPrice) {
      url += `&max_price=${filters.maxPrice}`
    }

    if (filters?.brand) {
      url += `&brand=${encodeURIComponent(filters.brand)}`
    }

    if (filters?.category) {
      url += `&category=${encodeURIComponent(filters.category)}`
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
        "X-RapidAPI-Host": "google-shopping-product-search.p.rapidapi.com",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`Google Shopping API error: ${response.status}`)
    }

    const data = await response.json()

    // Transform the response to our Product interface
    const products: Product[] =
      data.products?.map((item: any) => ({
        id: item.product_id || `google-${Math.random().toString(36).substring(2, 15)}`,
        title: item.title || "Unknown Product",
        description: item.description || "",
        price: Number.parseFloat(item.price?.value || "0"),
        currency: item.price?.currency || "USD",
        image: item.thumbnail || "/placeholder.svg?height=200&width=200",
        url: item.link || "",
        source: "Google Shopping",
        rating: item.rating?.value || undefined,
        reviews: item.rating?.count || undefined,
      })) || []

    return {
      products,
      totalResults: data.total_results || products.length,
      source: "Google Shopping",
    }
  } catch (error) {
    console.error("Error fetching from Google Shopping:", error)
    // Return mock data as fallback
    return {
      products: mockProducts.google,
      totalResults: mockProducts.google.length,
      source: "Google Shopping (Mock)",
    }
  }
}

async function fetchAmazonProducts(query: string, filters?: any): Promise<SearchResult | null> {
  try {
    // Check if RapidAPI key is available
    if (!process.env.NEXT_PUBLIC_RAPID_API_KEY) {
      console.warn("RapidAPI key not found, using mock data for Amazon")
      return {
        products: mockProducts.amazon,
        totalResults: mockProducts.amazon.length,
        source: "Amazon (Mock)",
      }
    }

    let url = `https://amazon-product-search1.p.rapidapi.com/search?query=${encodeURIComponent(query)}&country=us`

    // Add filters to the URL if they exist
    if (filters?.maxPrice) {
      url += `&max_price=${filters.maxPrice}`
    }

    if (filters?.brand) {
      url += `&brand=${encodeURIComponent(filters.brand)}`
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
        "X-RapidAPI-Host": "amazon-product-search1.p.rapidapi.com",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`Amazon API error: ${response.status}`)
    }

    const data = await response.json()

    // Transform the response to our Product interface
    const products: Product[] =
      data.results?.map((item: any) => ({
        id: item.asin || `amazon-${Math.random().toString(36).substring(2, 15)}`,
        title: item.title || "Unknown Product",
        description: item.description || "",
        price: Number.parseFloat(item.price?.current_price || "0"),
        currency: "USD",
        image: item.thumbnail || "/placeholder.svg?height=200&width=200",
        url: item.url || "",
        source: "Amazon",
        rating: item.reviews?.rating || undefined,
        reviews: item.reviews?.total_reviews || undefined,
      })) || []

    return {
      products,
      totalResults: data.total_results || products.length,
      source: "Amazon",
    }
  } catch (error) {
    console.error("Error fetching from Amazon:", error)
    // Return mock data as fallback
    return {
      products: mockProducts.amazon,
      totalResults: mockProducts.amazon.length,
      source: "Amazon (Mock)",
    }
  }
}

async function fetchWalmartProducts(query: string, filters?: any): Promise<SearchResult | null> {
  try {
    // Check if RapidAPI key is available
    if (!process.env.NEXT_PUBLIC_RAPID_API_KEY) {
      console.warn("RapidAPI key not found, using mock data for Walmart")
      return {
        products: mockProducts.walmart,
        totalResults: mockProducts.walmart.length,
        source: "Walmart (Mock)",
      }
    }

    let url = `https://walmart-product-search.p.rapidapi.com/search?query=${encodeURIComponent(query)}`

    // Add filters to the URL if they exist
    if (filters?.maxPrice) {
      url += `&max_price=${filters.maxPrice}`
    }

    if (filters?.brand) {
      url += `&brand=${encodeURIComponent(filters.brand)}`
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
        "X-RapidAPI-Host": "walmart-product-search.p.rapidapi.com",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`Walmart API error: ${response.status}`)
    }

    const data = await response.json()

    // Transform the response to our Product interface
    const products: Product[] =
      data.items?.map((item: any) => ({
        id: item.id || `walmart-${Math.random().toString(36).substring(2, 15)}`,
        title: item.title || "Unknown Product",
        description: item.description || "",
        price: Number.parseFloat(item.price?.current_price || "0"),
        currency: "USD",
        image: item.image || "/placeholder.svg?height=200&width=200",
        url: item.product_url || "",
        source: "Walmart",
        rating: item.rating?.average || undefined,
        reviews: item.rating?.count || undefined,
      })) || []

    return {
      products,
      totalResults: data.total_count || products.length,
      source: "Walmart",
    }
  } catch (error) {
    console.error("Error fetching from Walmart:", error)
    // Return mock data as fallback
    return {
      products: mockProducts.walmart,
      totalResults: mockProducts.walmart.length,
      source: "Walmart (Mock)",
    }
  }
}
