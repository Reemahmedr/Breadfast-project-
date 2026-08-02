"use client"

import { Elements } from "@stripe/react-stripe-js"
import { stripePromise } from "@/lib/stripe-client"
import { useRef, useState } from "react"
import CheckoutForm from "@/src/components/CheckoutForm"
import Loading from "@/src/components/loading"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import { cancelOrder, createOrders } from "../apis-actions/orders/orders"
import { useSearchParams } from "next/navigation"
import { getAddress } from "../apis-actions/address/address"
import { getCheckoutPreview } from "../apis-actions/checkout/preview/preview"
import No_Address from "@/src/components/No_Address"
import { getMyDeliveryZone } from "../apis-actions/myDeliveryZone/my_delivery_zone"
import { clearCart } from "../apis-actions/cart/cart"
import { Suspense } from "react"

function CheckoutPageContent() {
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const [paymentMethod, setPaymentMethod] = useState<"card" | "cod" | null>(null)
    const [cardLoading, setCardLoading] = useState(false)
    const [codLoading, setCodLoading] = useState(false)
    const searchParams = useSearchParams()
    const promoFromUrl = searchParams.get("promo") || null

    const { data: sessionData } = useSession()
    const cardOrderCreated = useRef(false)
    const pendingCardOrderId = useRef<string | null>(null)
    const queryClient = useQueryClient()

    const user_id = sessionData?.user?.id as string

    // 1. Fetch User Address
    const { data: address, isLoading: addressIsLoading } = useQuery({
        queryKey: ['getAddress'],
        queryFn: getAddress,
        enabled: !!user_id
    })

    // 2. Fetch Delivery Fee
    const { data: deliveryZone } = useQuery({
        queryKey: ['getMyDeliveryZone'],
        queryFn: getMyDeliveryZone,
        enabled: !!user_id
    })

    // 3. Fetch Price Preview
    const { data: preview } = useQuery({
        queryKey: ['checkoutPreview', promoFromUrl],
        queryFn: () => getCheckoutPreview(user_id, promoFromUrl as string),
        enabled: !!user_id
    })

    const { mutate: clearCartMutate, isPending: clearCartPending } = useMutation({
        mutationFn: clearCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getCart", user_id] }),
                toast.success("Your cart cleared successfully")
        }
    })

    const defaultAddressId =
        address?.find((item: { id: string, is_default?: boolean }) => item.is_default)?.id
        ?? address?.[0]?.id

    const defaultAddress =
        address?.find((item: { id: string; is_default?: boolean }) => item.is_default)
        ?? address?.[0]

    async function abandonPendingCardOrder() {
        const orderId = pendingCardOrderId.current
        pendingCardOrderId.current = null
        cardOrderCreated.current = false
        setClientSecret(null)

        if (orderId) {
            try {
                await cancelOrder(orderId, "cancelled")
            } catch (err) {
            }
        }
    }

    async function selectCOD() {
        if (paymentMethod === "card") {
            await abandonPendingCardOrder()
        }
        setPaymentMethod("cod")
    }

    async function handleCOD() {
        if (!user_id || !defaultAddressId) {
            toast.error("Missing user or address")
            return
        }

        setCodLoading(true)
        try {
            // Ensure any card draft from this session is cancelled first
            await abandonPendingCardOrder()

            await createOrders({
                user_id,
                address_id: defaultAddressId,
                payment_method: "cod",
                promo_code_id: promoFromUrl
            })

            toast.success("Order placed (Cash on Delivery)")
            clearCartMutate(user_id)
            window.location.href = "/orders"
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to place order"
            toast.error(message)
        } finally {
            setCodLoading(false)
        }
    }

    // Create card order + Stripe PaymentIntent only when user picks card.
    // Do NOT use /api/payment-intent alone — confirm needs an order linked to the PI.
    async function handleCardPayment() {
        if (!user_id || !defaultAddressId) {
            toast.error("Missing user or address")
            setPaymentMethod(null)
            return
        }

        // Reuse existing clientSecret if card order was already created
        if (clientSecret || cardOrderCreated.current) {
            setPaymentMethod("card")
            return
        }

        setPaymentMethod("card")
        setCardLoading(true)

        try {
            const data = await createOrders({
                user_id,
                address_id: defaultAddressId,
                payment_method: "card",
                promo_code_id: promoFromUrl
            })

            if (!data?.clientSecret) {
                throw new Error(data?.error || "Failed to initialize payment")
            }

            cardOrderCreated.current = true
            pendingCardOrderId.current = data?.order?.id ?? null
            setClientSecret(data.clientSecret)
        } catch (err: unknown) {
            cardOrderCreated.current = false
            pendingCardOrderId.current = null
            setPaymentMethod(null)
            setClientSecret(null)
            const message = err instanceof Error ? err.message : "Failed to initialize payment"
            toast.error(message)
        } finally {
            setCardLoading(false)
        }
    }

    // Handle Loading States
    if (addressIsLoading) return <Loading />

    if (!address || address.length === 0) {
        return <No_Address />
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-pink-50 py-8">
            <div className="mx-auto max-w-7xl px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Secure Checkout
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Complete your purchase securely
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                    {/* Payment Method Selection */}
                    <div className={paymentMethod === null ? "md:col-span-3" : "md:col-span-1"}>
                        <div className="bg-white rounded-2xl border border-purple-100 p-6 shadow-lg">
                            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h10m4 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                    </svg>
                                </div>
                                Payment Method
                            </h3>

                            <div className="space-y-3">
                                <label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all duration-200 ${paymentMethod === "card" ? "border-purple-600 bg-purple-50" : "border-gray-200 hover:border-purple-200 hover:bg-purple-50/30"}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="card"
                                        checked={paymentMethod === "card"}
                                        onChange={() => handleCardPayment()}
                                        disabled={cardLoading}
                                        className="w-5 h-5 cursor-pointer accent-purple-600"
                                    />
                                    <div>
                                        <span className="font-semibold text-gray-900 block">Pay with Card</span>
                                        <span className="text-xs text-gray-500">Credit or Debit Card</span>
                                    </div>
                                </label>

                                <label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all duration-200 ${paymentMethod === "cod" ? "border-purple-600 bg-purple-50" : "border-gray-200 hover:border-purple-200 hover:bg-purple-50/30"}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === "cod"}
                                        onChange={() => selectCOD()}
                                        className="w-5 h-5 cursor-pointer accent-purple-600"
                                    />
                                    <div>
                                        <span className="font-semibold text-gray-900 block">Cash on Delivery</span>
                                        <span className="text-xs text-gray-500">Pay when it arrives</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form Section */}
                    {paymentMethod !== null && <div className="md:col-span-2">
                        <div className="bg-white rounded-2xl border border-purple-100 p-8 shadow-lg">
                            {paymentMethod === "card" && (
                                <>
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">Card Details</h3>
                                    </div>
                                    {cardLoading && <Loading />}
                                    {!cardLoading && clientSecret && (
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
                                                        borderRadius: '12px',
                                                    },
                                                }
                                            }}
                                        >
                                            <CheckoutForm clientSecret={clientSecret} />
                                        </Elements>
                                    )}
                                </>
                            )}

                            {paymentMethod === "cod" && defaultAddress && (
                                <div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">Order Confirmation</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-gray-600 leading-relaxed">
                                            Your order will be confirmed and delivered to your address. You can pay securely when the delivery arrives at your location.
                                        </p>

                                        <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Delivery Address
                                            </h4>
                                            <p className="text-gray-700 text-sm font-medium">
                                                {defaultAddress.street_address}
                                            </p>
                                            <p className="text-gray-600 text-sm mt-1">
                                                {defaultAddress.city}, {defaultAddress.area}
                                            </p>
                                        </div>

                                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                                            <p className="text-blue-900 text-sm flex items-start gap-2">
                                                <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0zM8 7a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                                                </svg>
                                                <span>
                                                    <span className="font-semibold">Cash on Delivery:</span> Pay the full amount securely to the delivery driver when your order arrives.
                                                </span>
                                            </p>
                                        </div>

                                        <button disabled={clearCartPending || codLoading} onClick={handleCOD} className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 mt-6 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
                                            {clearCartPending || codLoading ? <Loading /> : "Place Order"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>}

                    {/* Order Summary Sidebar */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-2xl border border-purple-100 p-6 shadow-lg">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center justify-between text-gray-600">
                                    <span className="font-medium">Subtotal</span>
                                    <span className="font-semibold text-gray-900">{preview?.subtotal} EGP</span>
                                </div>

                                {preview?.discount > 0 && (
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-600">Discount</span>
                                        <span className="font-semibold text-green-600">-{preview.discount} EGP</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-gray-600">
                                    <span className="font-medium">Shipping</span>
                                    <span className="font-semibold text-blue-600">
                                        {deliveryZone?.delivery_fee ?? 0} EGP
                                    </span>
                                </div>

                                <div className="border-t border-purple-100 pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                            {(preview?.total || 0) + (deliveryZone?.delivery_fee || 0)} EGP
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Security Badges */}
                            <div className="border-t border-purple-100 pt-6 space-y-3">
                                <Badge icon="M5 13l4 4L19 7" label="Secure SSL Encryption" color="bg-green-100" textColor="text-green-600" />
                                <Badge icon="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" label="PCI DSS Compliant" color="bg-blue-100" textColor="text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Helper Component for Badges
function Badge({ icon, label, color, textColor }: { icon: string, label: string, color: string, textColor: string }) {
    return (
        <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className={`w-8 h-8 ${color} rounded-full flex items-center justify-center shrink-0`}>
                <svg className={`w-4 h-4 ${textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
            </div>
            <span>{label}</span>
        </div>
    )
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<Loading />}>
            <CheckoutPageContent />
        </Suspense>
    )
}