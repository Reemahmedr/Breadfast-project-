"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getProductsByCategory } from "../../apis-actions/products/products"
import Loading from "@/src/components/loading"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { addToCart } from "../../apis-actions/cart/cart"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import { addToWishlist, deleteFromWishlist, getWishlish } from "../../apis-actions/wishlist/wishlist"
import { getTrendingProducts } from "../../apis-actions/products/trendingProducts"

export default function page() {
  const params = useParams()
  const categoryId = params.categoryId as string

  const queryClient = useQueryClient()

  const { data: sessionData } = useSession()
  const user_id = sessionData?.user.id as string

  const { data, isLoading: getProductsByCategoryLoading } = useQuery({ queryKey: ["productByCategory", categoryId], queryFn: () => getProductsByCategory(categoryId) })

  const { data: wishlistItems = [], isLoading: wishlistLoading } = useQuery({
    queryKey: ["getWishlist", user_id],
    queryFn: () => getWishlish(user_id),
    enabled: !!user_id
  })

  const { data: trendingDataId, isLoading: trendingIsLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: getTrendingProducts
  })

  const wishlistIds = wishlistItems.map((i: any) => i.product_id) ?? []

  const { mutate: addToCartMutate } = useMutation({
    mutationFn: addToCart,

    onSuccess: () => {
      toast.success("Added successfully to cart"),
        queryClient.invalidateQueries({ queryKey: ["getCart", user_id] })
    }
  })

  const { mutate: addToWishlistMutate } = useMutation({
    mutationFn: addToWishlist,
    onSuccess: () => {
      toast.success("Added to wishlist")
      queryClient.invalidateQueries({ queryKey: ["getWishlist", user_id] })
    },
    onError: () => {
      toast.error("Already in wishlist")
    }
  })

  const { mutate: deleteMuatate } = useMutation({
    mutationFn: ({ product_id }: { product_id: string }) => deleteFromWishlist(user_id, product_id),
    onSuccess: () => {
      toast.success("Item deleted from wishlist"),
        queryClient.invalidateQueries({ queryKey: ["getWishlist", user_id] })
    }
  })

  function handleAddToCart(product_id: string) {
    addToCartMutate({ user_id, product_id, quantity: 1 })
  }


  if (wishlistLoading || getProductsByCategoryLoading) {
    return <Loading></Loading>
  }

  if (!Array.isArray(data)) {
    return <p>No products found</p>
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((item) => {
          const isWishlisted = wishlistIds.includes(item.id)
          function handleToggleWishlist(product_id: string, isWishlisted: boolean) {
            if (!user_id) {
              toast.error("Login to save items")
              return
            }

            if (isWishlisted) {
              deleteMuatate({ product_id })
            } else {
              addToWishlistMutate({ user_id, product_id })
            }
          }
          const isTrending = trendingDataId?.includes(item.id);

          return (
            <div
              key={item.id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-purple-200 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden bg-linear-to-br from-purple-50 to-pink-50 aspect-square">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={item.image_url}
                  alt={item.name}
                />

                {/* Wishlist Heart Button */}
                <button
                  className={`absolute cursor-pointer top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 z-10
    ${isWishlisted
                      ? 'bg-linear-to-r from-purple-500 to-pink-500'
                      : 'bg-white/90 backdrop-blur-sm hover:bg-white'}`}
                  onClick={() => handleToggleWishlist(item.id, isWishlisted)}
                >
                  <svg
                    className={`w-5 h-5 transition-all duration-200 ${isWishlisted
                      ? 'fill-white text-white scale-110'
                      : 'fill-none text-gray-600 group-hover/heart:text-red-500 group-hover/heart:scale-110'
                      }`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                    />
                  </svg>
                </button>

                {/* Trending Badge */}
                {isTrending && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 bg-linear-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18.122 17.645a7.185 7.185 0 0 1-2.656 2.495 7.06 7.06 0 0 1-3.52.853 6.617 6.617 0 0 1-3.306-.718 6.73 6.73 0 0 1-2.54-2.266c-2.672-4.57.287-8.846.887-9.668A4.448 4.448 0 0 0 8.07 6.31 4.49 4.49 0 0 0 7.997 4c1.284.965 6.43 3.258 5.525 10.631 1.496-1.136 2.7-3.046 2.846-6.216 1.43 1.061 3.985 5.462 1.754 9.23Z"
                        />
                      </svg>
                      Trending
                    </span>
                  </div>
                )}

              </div>

              {/* Content Container */}
              <div className="p-6 flex flex-col grow">
                {/* Product Name */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 min-h-14 group-hover:text-purple-600 transition-colors">
                  {item.name}
                </h3>

                {/* Price Section */}
                <div className="mt-auto">
                  <div className="flex items-baseline gap-2 mb-4">
                    {item.original_price - item.price === 0 ? (
                      <span className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {item.original_price}
                      </span>
                    ) : (
                      <>
                        <span className="text-xl font-medium text-gray-400 line-through">
                          {item.original_price}
                        </span>
                        <span className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {item.price}
                        </span>
                      </>
                    )}
                    <span className="text-lg font-semibold text-gray-600">
                      EGP
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={() => handleAddToCart(item.id)}
                    className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 border-0"
                  >
                    <span>Add To Cart</span>
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 12H5m14 0-4 4m4-4-4-4"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
