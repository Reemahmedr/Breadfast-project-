"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { clearWishlist, deleteFromWishlist, getWishlish } from "../apis-actions/wishlist/wishlist"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Loading from "@/src/components/loading"
import toast from "react-hot-toast"
import { addToCart } from "../apis-actions/cart/cart"

export default function page() {

    const { data: sessionData } = useSession()
    const queryClient = useQueryClient()

    const user_id = sessionData?.user.id as string
    const { data: wishlistItems = [], isLoading } = useQuery({
        queryKey: ["getWishlist", user_id],
        queryFn: () => getWishlish(user_id),
        enabled: !!user_id
    })

    const { mutate: deleteMuatate } = useMutation({
        mutationFn: ({ product_id }: { product_id: string }) => deleteFromWishlist(user_id, product_id),
        onSuccess: () => {
            toast.success("Item deleted from wishlist"),
                queryClient.invalidateQueries({ queryKey: ["getWishlist", user_id] })
        }
    })

    const { mutate: clearMutate, isPending: clearPending } = useMutation({
        mutationFn: clearWishlist,
        onSuccess: () => {
            toast.success("Wishlist cleared"),
                queryClient.invalidateQueries({ queryKey: ["getWishlist", user_id] })
        }
    })

    const { mutate: addToCartMutate } = useMutation({
        mutationFn: addToCart,

        onSuccess: () => {
            toast.success("Added successfully to cart"),
                queryClient.invalidateQueries({ queryKey: ["getCart", user_id] })
        }
    })

    function handleDeleteFromWishlist(product_id: string) {
        deleteMuatate({ product_id })
    }

    if (isLoading || clearPending) {
        return <Loading></Loading>
    }
    return (
        <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-white">
            <section className="py-8 antialiased md:py-16">
                <div className="mx-auto max-w-7xl px-4 2xl:px-0">
                    {/* Header */}
                    <div className="mb-8 flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl py-3.5 font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent sm:text-4xl">
                                My Wishlist
                            </h1>
                            <p className="mt-2 text-gray-600">
                                {wishlistItems.length} items saved for later
                            </p>
                        </div>

                        {/* Clear Wishlist Button */}
                        {wishlistItems.length > 0 && (
                            <Button
                                type="button"
                                onClick={() => clearMutate(user_id)}
                                className="group flex items-center gap-2 px-6 py-3 bg-white border-2 border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                <svg
                                    className="w-5 h-5 group-hover:scale-110 transition-transform"
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
                                        d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                                    />
                                </svg>
                                <span>Clear All</span>
                            </Button>
                        )}
                    </div>

                    {/* Empty State */}
                    {wishlistItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4 min-h-[600px]">
                            <div className="relative w-full max-w-md mx-auto">
                                <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-3xl p-12 shadow-lg text-center">
                                    <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-md">
                                        <svg
                                            className="w-16 h-16 text-purple-400"
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
                                                d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center mt-8 max-w-md">
                                <h2 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                                    Your Wishlist is Empty
                                </h2>
                                <p className="text-gray-600 mb-8 text-lg">
                                    Save your favorite items here to buy them later!
                                </p>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    <svg
                                        className="w-5 h-5"
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
                                            d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
                                        />
                                    </svg>
                                    <span>Start Shopping</span>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {wishlistItems.map((item: any) => (
                                <div
                                    key={item.product_id}
                                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-purple-200 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col relative"
                                >
                                    {/* Remove from Wishlist Button */}
                                    <Button
                                        onClick={() => handleDeleteFromWishlist(item.product_id)}
                                        className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-all duration-200 group/remove"
                                    >
                                        <svg
                                            className="w-5 h-5 text-gray-600 group-hover/remove:text-red-500 transition-colors"
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
                                                d="M6 18 17.94 6M18 18 6.06 6"
                                            />
                                        </svg>
                                    </Button>

                                    {/* Wishlist Heart Badge */}
                                    <div className="absolute top-4 left-4 z-10">
                                        <div className="w-10 h-10 bg-linear-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                            <svg
                                                className="w-5 h-5 fill-white text-white"
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
                                        </div>
                                    </div>

                                    {/* Image Container */}
                                    <div className="relative overflow-hidden bg-linear-to-br from-purple-50 to-pink-50 aspect-square">
                                        <Image
                                            width={1000}
                                            height={1000}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            src={item.products.image_url}
                                            alt={item.products.name}
                                        />
                                    </div>

                                    {/* Content Container */}
                                    <div className="p-6 flex flex-col grow">
                                        {/* Product Name */}
                                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 min-h-14 group-hover:text-purple-600 transition-colors">
                                            {item.products.name}
                                        </h3>

                                        {/* Price Section */}
                                        <div className="mt-auto">
                                            <div className="flex items-baseline gap-2 mb-4">
                                                {item.products.original_price - item.products.price === 0 ? (
                                                    <span className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                        {item.products.original_price}
                                                    </span>
                                                ) : (
                                                    <>
                                                        <span className="text-xl font-medium text-gray-400 line-through">
                                                            {item.products.original_price}
                                                        </span>
                                                        <span className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                            {item.products.price}
                                                        </span>
                                                    </>
                                                )}
                                                <span className="text-lg font-semibold text-gray-600">
                                                    EGP
                                                </span>
                                            </div>

                                            {/* Add to Cart Button */}
                                            <Button
                                                onClick={() => addToCartMutate({ user_id, product_id: item.product_id, quantity: 1 })}
                                                className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2">
                                                <svg
                                                    className="w-5 h-5"
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
                                                        d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
                                                    />
                                                </svg>
                                                <span>Add to Cart</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Shopping Tips Section */}
                    {wishlistItems.length > 0 && (
                        <div className="mt-12 rounded-2xl border border-purple-100 bg-linear-to-br from-purple-50 to-pink-50 p-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                <div className="space-y-3">
                                    <div className="mx-auto w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
                                        <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Price Alerts</h3>
                                    <p className="text-sm text-gray-600">Get notified when prices drop on your saved items</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="mx-auto w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
                                        <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Special Offers</h3>
                                    <p className="text-sm text-gray-600">Exclusive deals on wishlist items just for you</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="mx-auto w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
                                        <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Easy Sharing</h3>
                                    <p className="text-sm text-gray-600">Share your wishlist with friends and family</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
