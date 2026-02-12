"use client"
import { useEffect } from "react"

export default function SuccessPage() {
    useEffect(() => {
        const confirmOrder = async () => {
            const params = new URLSearchParams(window.location.search)
            const paymentIntent = params.get("payment_intent")

            if (!paymentIntent) return

            await fetch("/api/orders/confirm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    payment_intent_id: paymentIntent,
                }),
            })
        }
        confirmOrder()
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.href = "/orders"
        }, 5000)

        return () => clearTimeout(timer)
    }, [window.location.href])


    return (
        <div className="p-10 text-center">
            <h1 className="text-2xl font-bold text-green-600">
                Payment Successful 🎉
            </h1>
            <p className="mt-2 text-gray-600">
                Your order has been confirmed
            </p>
            <p className="mt-2 text-gray-600">
                You will be redirected to the orders page in 5 seconds
            </p>
        </div>
    )
}
