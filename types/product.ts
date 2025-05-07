export interface Product {
  id: string
  title: string
  description: string
  price: number
  currency: string
  image: string
  url: string
  source: string
  rating?: number
  reviews?: number
}

export interface SearchResult {
  products: Product[]
  totalResults: number
  source: string
}
