"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { clearCart, deleteFromCart, getCart, updateCart } from "../apis-actions/cart/cart"
import { useSession } from "next-auth/react"
import Image from "next/image"
import toast from "react-hot-toast"
import Loading from "@/src/components/loading"
import { supabase } from "@/lib/supabase"
import emptyCart from "@/public/empty-cart.png"
import Link from "next/link"
import { addToWishlist } from "../apis-actions/wishlist/wishlist"
import { applyPromoCode } from "../apis-actions/promo_code/promo_code"
import { useState } from "react"

export default function page() {

    const { data: sessionData } = useSession()
    const queryClient = useQueryClient()

    const user_id = sessionData?.user?.id as string

    console.log("UserId", user_id)

    const [promoCode, setPromoCode] = useState("")
    const [discount, setDiscount] = useState(0)
    const [finalTotal, setFinalTotal] = useState<number | null>(null)
    const [promoId, setPromoId] = useState<string | null>(null)


    const { data: getCartData = [], isLoading: getCartLoading } = useQuery({
        queryKey: ['getCart', user_id],
        queryFn: () => getCart(user_id),
        enabled: !!user_id
    })

    const { data: cartTotal } = useQuery({
        queryKey: ["cartTotal"],
        queryFn: async () => {
            const { data, error } = await supabase.rpc("get_cart_total", { p_user_id: user_id })
            if (error) {
                throw error
            }
            return data
        },
        enabled: !!sessionData?.user
    })

    const { mutate: updateCartMutate, isPending: updatePending } = useMutation({
        mutationFn: updateCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getCart", user_id] }),
                queryClient.invalidateQueries({ queryKey: ['cartTotal'] }),
                toast.success("Quantity updated successfully")
        }
    })

    const { mutate: deleteCartMutate, isPending: deletePending } = useMutation({
        mutationFn: ({ product_id }: { product_id: string }) => deleteFromCart(user_id, product_id),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["getCart", user_id] }) }
    })

    const { isPending: clearCartPending, mutate: clearCartMutate } = useMutation({
        mutationFn: clearCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getCart", user_id] }),
                toast.success("Your cart cleared successfully")
        }
    })

    const { mutate: addToWishlistMutate } = useMutation({
        mutationFn: addToWishlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getWishlist", user_id] })
        }
    })

    const { mutate: promoCodeMutate } = useMutation({
        mutationFn: ({ code, orderTotal }: { code: string, orderTotal: number }) => applyPromoCode(code, orderTotal),
        onSuccess: (data) => {
            toast.success("promo code applied")
            queryClient.invalidateQueries({ queryKey: ["getCart", user_id] })
            setDiscount(data.discount)
            setFinalTotal(data.finalTotal)
            setPromoId(data.promoId)
        },
        onError: (error: any) => {
            console.log("Promo error:", error.message)
            toast.error(error.message)
        }

    })

    function handleCartUpdate(product_id: string, quantity: number) {
        updateCartMutate({ user_id, product_id, quantity })
    }

    if (getCartLoading || updatePending || deletePending || clearCartPending) {
        return <Loading></Loading>
    }

    function handleDeleteFromCart(product_id: string) {
        deleteCartMutate({ product_id })
        toast.success("Item deleted successfully")
    }

    function handleSaveForLater(product_id: string) {
        addToWishlistMutate({ user_id, product_id })
        deleteCartMutate({ product_id })

        toast.success("Item saved for later")
    }

    const originalPrice = getCartData.reduce(
        (total: number, item: any) =>
            total + item.products.original_price * item.quantity,
        0
    )



    return (
        <>
            <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-white">
                <section className="py-8 antialiased md:py-16">
                    <div className="mx-auto max-w-7xl px-4 2xl:px-0">
                        {/* Header */}
                        <div className="mb-8 flex items-start justify-between">
                            <div>
                                <h1 className="text-3xl py-1.5 font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent sm:text-4xl">
                                    Shopping Cart
                                </h1>
                                <p className="mt-2 text-gray-600">
                                    {getCartData?.length || 0} items in your cart
                                </p>
                            </div>

                            {/* Clear Cart Button */}
                            {getCartData && getCartData.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => clearCartMutate(user_id)}
                                    className="group cursor-pointer flex items-center gap-2 px-6 py-3 bg-white border-2 border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow-md"
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
                                    <span>Clear Cart</span>
                                </button>
                            )}
                        </div>

                        {getCartData.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 px-4 min-h-[600px]">
                                <div className="relative w-full max-w-md mx-auto">
                                    <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-3xl p-8 shadow-lg">
                                        <Image
                                            src={emptyCart}
                                            width={400}
                                            height={400}
                                            alt="Empty Cart"
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>
                                </div>
                                <div className="text-center mt-8 max-w-md">
                                    <h2 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                                        Your Cart is Empty
                                    </h2>
                                    <p className="text-gray-600 mb-8 text-lg">
                                        Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
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
                        ) :
                            <div className="mt-6 sm:mt-8 md:gap-8 lg:flex lg:items-start xl:gap-10">
                                {/* Cart Items Section */}
                                <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
                                    <div className="space-y-4">
                                        {getCartData?.map((getItems: any) => (
                                            <div
                                                key={getItems.id}
                                                className="group relative rounded-2xl border border-purple-100 bg-white p-6 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300"
                                            >
                                                <div className="flex flex-col md:flex-row md:items-center md:gap-6">
                                                    {/* Product Image */}
                                                    <div className="shrink-0 mb-4 md:mb-0">
                                                        <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-purple-50 to-pink-50 p-2">
                                                            <Image
                                                                width={160}
                                                                height={160}
                                                                className="rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
                                                                src={getItems.products.image_url}
                                                                alt="Product image"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Product Details */}
                                                    <div className="flex-1 space-y-4">
                                                        <div>
                                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                                                                {getItems.products.name}
                                                            </h3>
                                                            <div className="flex items-baseline gap-2 mb-4">
                                                                {getItems.products.original_price - getItems.products.price === 0 ? (
                                                                    <span className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                                        {getItems.products.original_price}
                                                                    </span>
                                                                ) : (
                                                                    <>
                                                                        <span className="text-xl font-medium text-gray-400 line-through">
                                                                            {getItems.products.original_price}
                                                                        </span>
                                                                        <span className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                                            {getItems.products.price}
                                                                        </span>
                                                                    </>
                                                                )}
                                                                <span className="text-lg font-semibold text-gray-600">
                                                                    EGP
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Quantity Controls */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-sm font-medium text-gray-600">Quantity:</span>
                                                                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleCartUpdate(getItems.product_id, getItems.quantity - 1)}
                                                                        className="inline-flex cursor-pointer h-8 w-8 items-center justify-center rounded-md bg-white border border-gray-200 hover:bg-purple-50 hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                                                    >
                                                                        <svg
                                                                            className="h-3 w-3 text-gray-700"
                                                                            aria-hidden="true"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 18 2"
                                                                        >
                                                                            <path
                                                                                stroke="currentColor"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={2}
                                                                                d="M1 1h16"
                                                                            />
                                                                        </svg>
                                                                    </button>
                                                                    <input
                                                                        type="text"
                                                                        readOnly
                                                                        className="w-12 border-0 bg-transparent text-center text-base font-bold text-gray-900 focus:outline-none focus:ring-0"
                                                                        value={getItems.quantity}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleCartUpdate(getItems.product_id, getItems.quantity + 1)}
                                                                        className="inline-flex cursor-pointer h-8 w-8 items-center justify-center rounded-md bg-white border border-gray-200 hover:bg-purple-50 hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                                                    >
                                                                        <svg
                                                                            className="h-3 w-3 text-gray-700"
                                                                            aria-hidden="true"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 18 18"
                                                                        >
                                                                            <path
                                                                                stroke="currentColor"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={2}
                                                                                d="M9 1v16M1 9h16"
                                                                            />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center gap-4">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleSaveForLater(getItems.product_id)}
                                                                className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                                                            >
                                                                <svg
                                                                    className="h-5 w-5"
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
                                                                Save for Later
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteFromCart(getItems.product_id)}
                                                                className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                                                            >
                                                                <svg
                                                                    className="h-5 w-5"
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
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Summary Section */}
                                <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
                                    {/* Order Summary Card */}
                                    <div className="space-y-6 rounded-2xl border border-purple-100 bg-white p-6 shadow-lg">
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            Order Summary
                                        </h2>

                                        <div className="space-y-4">
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-base text-gray-600">
                                                        Original price
                                                    </span>
                                                    <span className="text-base font-semibold text-gray-900">
                                                        {originalPrice} EGP
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-base text-gray-600">
                                                        Savings
                                                    </span>
                                                    <span className="text-base font-semibold text-green-600">
                                                        {originalPrice - cartTotal} EGP
                                                    </span>
                                                </div>
                                                {discount > 0 && (
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-base text-gray-600">Promo Discount</span>
                                                        <span className="text-base font-semibold text-green-600">
                                                            -{discount} EGP
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                                <span className="text-xl font-bold text-gray-900">
                                                    Total
                                                </span>
                                                <span className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                    {finalTotal ?? cartTotal} EGP
                                                </span>
                                            </div>
                                        </div>

                                        <Link
                                            href={promoId ? `/checkout?promo=${promoId}` : "/checkout"}
                                            className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2">
                                            <span className="text-base">Proceed to Checkout</span>
                                            <svg
                                                className="h-5 w-5"
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
                                                    d="M19 12H5m14 0-4 4m4-4-4-4"
                                                />
                                            </svg>
                                        </Link>

                                        <div className="flex items-center justify-center gap-2 pt-2">
                                            <span className="text-sm text-gray-500">or</span>
                                            <Link
                                                href="/"
                                                className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                                            >
                                                Continue Shopping
                                                <svg
                                                    className="h-4 w-4"
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
                                                        d="M19 12H5m14 0-4 4m4-4-4-4"
                                                    />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Voucher Card */}
                                    <div className="space-y-4 rounded-2xl border border-purple-100 bg-white p-6 shadow-lg">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            Have a Promo Code?
                                        </h3>
                                        <form className="space-y-4" onSubmit={(e) => {
                                            e.preventDefault()
                                            promoCodeMutate({ code: promoCode, orderTotal: cartTotal })
                                        }}>
                                            <div>
                                                <label
                                                    htmlFor="voucher"
                                                    className="mb-2 block text-sm font-medium text-gray-700"
                                                >
                                                    Enter voucher or gift card code
                                                </label>
                                                <input
                                                    type="text"
                                                    id="voucher"
                                                    value={promoCode}
                                                    onChange={(e) => setPromoCode(e.target.value)}
                                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 transition-all"
                                                    placeholder="Enter code"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                                            >
                                                Apply Code
                                            </button>
                                        </form>
                                    </div>

                                    {/* Trust Badges */}
                                    <div className="rounded-2xl border border-purple-100 bg-linear-to-br from-purple-50 to-pink-50 p-6">
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div className="space-y-2">
                                                <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <p className="text-xs font-semibold text-gray-900">Secure Payment</p>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <p className="text-xs font-semibold text-gray-900">Quality Guarantee</p>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                    </svg>
                                                </div>
                                                <p className="text-xs font-semibold text-gray-900">Easy Returns</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                    </div>
                </section>
            </div>
        </>

    )
}
