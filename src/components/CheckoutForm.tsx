"use client"

import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"


export default function CheckoutForm({ clientSecret }: { clientSecret: string }) {
    const stripe = useStripe()
    const elements = useElements()
    const [loading, setLoading] = useState(false)

    const { data: sessionData } = useSession()
    const queryClient = useQueryClient()

    const searchParams = useSearchParams()
    const promoFromUrl = searchParams.get("promo") || null

    const user_id = sessionData?.user?.id as string

    const address_id = "573039e4-67df-44da-b0d1-3262d73f486b"
    const promo_id = promoFromUrl ?? null



    // async function handleSubmit(e: React.FormEvent) {
    //     e.preventDefault()

    //     if (!stripe || !elements) return

    //     setLoading(true)

    //     const { error, paymentIntent } = await stripe.confirmPayment({
    //         elements,
    //         clientSecret: clientSecret as string,
    //         redirect: "if_required",
    //     })

    //     // if (paymentIntent?.status === "succeeded") {
    //     //     await fetch("/api/orders/confirm", {
    //     //         method: "POST",
    //     //         headers: { "Content-Type": "application/json" },
    //     //         body: JSON.stringify({
    //     //             order_id: paymentIntent.metadata.order_id,
    //     //             payment_intent_id: paymentIntent.id,
    //     //         }),
    //     //     })
    //     // }


    //     if (error) {
    //         alert(error.message)
    //         setLoading(false)
    //         return
    //     }

    //     // if (paymentIntent?.status === "succeeded") {
    //     //     onSuccess() 
    //     // }

    //     setLoading(false)
    // }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!stripe || !elements) return

        setLoading(true)

        const { error: submitError } = await elements.submit()
        if (submitError) {
            setLoading(false)
            toast.error(submitError.message || "Invalid payment details")
            return
        }

        // const { error, paymentIntent } = await stripe.confirmPayment({
        //     elements,
        //     redirect: "if_required",
        // })

        // if (error) {
        //     toast.error(error.message || "Payment failed")
        //     setLoading(false)
        //     return
        // }

        // if (paymentIntent?.status === "succeeded") {

        //     await fetch("/api/orders", {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({
        //             user_id,
        //             address_id,
        //             promo_id,
        //             payment_intent_id: paymentIntent.id,
        //         }),
        //     })

        //     await supabase
        //         .from("cart_items")
        //         .delete()
        //         .eq("user_id", user_id)

        //     toast.success("Payment successful 🎉")
        // }

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin + "/success", // بعد الدفع
            },
        })

        if (error) {
            console.error(error)
            toast.error("error in checkout form")
        }

    }



    return (
        <div className="bg-white rounded-2xl border border-purple-100 p-8 shadow-lg">
            {/* Form Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Details</h2>
                <p className="text-gray-600">Enter your payment information below</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Element Container */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <PaymentElement
                        options={{
                            layout: {
                                type: 'tabs',
                                defaultCollapsed: false,
                            }
                        }}
                    />
                </div>

                {/* Security Notice */}
                <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                    <div className="flex items-start gap-3">
                        <div className="shrink-0 mt-0.5">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">Secure Payment</h3>
                            <p className="text-xs text-gray-600">
                                Your payment information is encrypted and secure. We never store your card details.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>Pay Now</span>
                        </>
                    )}
                </button>

                {/* Payment Methods */}
                <div className="pt-6 border-t border-gray-200">
                    <p className="text-center text-sm text-gray-500 mb-4">We accept</p>
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
                            <span className="text-xl font-bold text-blue-600">VISA</span>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
                            <span className="text-xl font-bold text-orange-600">Mastercard</span>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
                            <span className="text-xl font-bold text-blue-500">AMEX</span>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
                            <span className="text-sm font-bold text-gray-700">Apple Pay</span>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
                            <span className="text-sm font-bold text-gray-700">Google Pay</span>
                        </div>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-6 pt-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>256-bit SSL</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>PCI Compliant</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Secure</span>
                    </div>
                </div>
            </form>
        </div>
    )
}