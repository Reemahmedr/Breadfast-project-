"use client"

import { Elements } from "@stripe/react-stripe-js"
import { stripePromise } from "@/lib/stripe-client"
import { useEffect, useRef, useState } from "react"
import CheckoutForm from "@/src/components/CheckoutForm"
import Loading from "@/src/components/loading"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { supabase } from "@/lib/supabase"
import toast from "react-hot-toast"
import { createOrders } from "../apis-actions/orders/orders"
import { useSearchParams } from "next/navigation"
import { getAddress } from "../apis-actions/address/address"
import { getCheckoutPreview } from "../apis-actions/checkout/preview/preview"
import { clearCart } from "../apis-actions/cart/cart"

export default function CheckoutPage() {
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const searchParams = useSearchParams()
    const promoFromUrl = searchParams.get("promo") || null

    const { data: sessionData } = useSession()
    const hasInitialized = useRef(false)

    const queryClient = useQueryClient()

    const user_id = sessionData?.user?.id as string

    const { mutate: createOrderMutate, isPending } = useMutation({
        mutationFn: createOrders,
        onSuccess: () => {
            toast.success("Order placed successfully")
            queryClient.invalidateQueries({ queryKey: ["getOrders", user_id] })
        },
        onError: () => {
            toast.error("Failed to place order")
        }
    })

    const { isPending: clearCartPending, mutate: clearCartMutate } = useMutation({
        mutationFn: clearCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getCart", user_id] }),
                toast.success("Your cart cleared successfully")
        }
    })


    const { data: address, error } = useQuery({ queryKey: ['getAddress'], queryFn: getAddress, enabled: !!user_id })



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


    const { data: preview } = useQuery({
        queryKey: ['checkoutPreview'],
        queryFn: () => getCheckoutPreview(user_id, promoFromUrl as string),
        enabled: !!user_id
    })

    // useEffect(() => {
    //     // async function createIntent() {
    //     //     const res = await fetch("/api/checkout", {
    //     //         method: "POST",
    //     //         headers: { "Content-Type": "application/json" },
    //     //         body: JSON.stringify({ amount: 500000 }),
    //     //     })

    //     //     const data = await res.json()
    //     //     setClientSecret(data.clientSecret)
    //     //     console.log("API RESPONSE:", data)
    //     // }

    //     // createIntent()

    //     if (!cartTotal || !user_id) return
    //     if (hasInitialized.current) return

    //     hasInitialized.current = true

    //     async function iniitCheckout() {
    //         const order = await createOrders({
    //             user_id,
    //             address_id: "36d39f5b-6965-4d66-afa8-7bf234ebe782",
    //             payment_method: "card",
    //         })
    //         console.log("ORDER ID:", order.id)


    //         // const res = await fetch("/api/checkout", {
    //         //     method: "POST",
    //         //     headers: { "Content-Type": "application/json" },
    //         //     body: JSON.stringify({
    //         //         amount: cartTotal * 1000,
    //         //         order_id: order.id,
    //         //     }),
    //         // })

    //         // const data = await res.json()
    //         // setClientSecret(data.clientSecret)
    //     }
    //     iniitCheckout()
    // }, [cartTotal, user_id])


    useEffect(() => {
        if (!user_id) return
        if (!address?.length) return
        if (clientSecret) return
        if (hasInitialized.current) return;

        hasInitialized.current = true;

        async function initPaymentIntent() {
            try {
                const data = await createOrders({
                    user_id,
                    address_id: address[0].id,
                    payment_method: "card",
                    promo_code_id: promoFromUrl ?? null
                })

                // clearCartMutate(user_id)

                if (!data?.clientSecret) {
                    throw new Error("No client secret returned from backend")
                }

                setClientSecret(data.clientSecret)
                console.log("Stripe ClientSecret:", data.clientSecret)
            } catch (err) {
                console.error("Checkout init error:", err)
                toast.error("error in completing payment")
            }
        }

        initPaymentIntent()
    }, [user_id, address, promoFromUrl, clientSecret])

    if (!address || !clientSecret) return <Loading />



    return (
        <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-white py-12">
            <div className="mx-auto max-w-4xl px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                        Secure Checkout
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Complete your purchase securely
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Payment Form Section */}
                    <div className="lg:col-span-2">
                        {clientSecret && (
                            <Elements
                                stripe={stripePromise}
                                options={{
                                    clientSecret,
                                    appearance: {
                                        theme: 'stripe',
                                        variables: {
                                            colorPrimary: '#9333ea',
                                            colorBackground: '#ffffff',
                                            colorText: '#1f2937',
                                            colorDanger: '#ef4444',
                                            fontFamily: 'system-ui, sans-serif',
                                            borderRadius: '12px',
                                        },
                                    }
                                }}
                            >
                                <CheckoutForm clientSecret={clientSecret} />
                            </Elements>
                        )}

                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-purple-100 p-6 shadow-lg sticky top-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{preview?.subtotal} EGP</span>

                                </div>
                                {preview?.discount > 0 && (
                                    <div className="flex items-center justify-between text-gray-600">
                                        <span>Discount</span>
                                        <span className="font-semibold text-green-600">-{preview.discount} EGP</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-semibold text-green-600">Free</span>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                            <span>{preview?.total} EGP</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Security Badges */}
                            <div className="border-t border-gray-200 pt-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span>Secure SSL Encryption</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <span>PCI DSS Compliant</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <span>100% Money Back Guarantee</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}