import Image from "next/image"
import type { Product } from "@/types/product"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { StarIcon } from "lucide-react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full bg-gray-100">
        <Image
          src={product.image || "/placeholder.svg?height=200&width=200"}
          alt={product.title}
          fill
          className="object-contain p-2"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
          {product.source}
        </div>
      </div>
      <CardContent className="flex-grow p-4">
        <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.title}</h3>
        <p className="text-gray-500 text-xs line-clamp-3">{product.description}</p>

        {product.rating && (
          <div className="flex items-center mt-2">
            <StarIcon className="h-3 w-3 text-yellow-500 mr-1" />
            <span className="text-xs">{product.rating.toFixed(1)}</span>
            {product.reviews && <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="font-bold">
          {product.currency === "USD" ? "$" : product.currency} {product.price.toFixed(2)}
        </div>
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full transition-colors"
        >
          View
        </a>
      </CardFooter>
    </Card>
  )
}
