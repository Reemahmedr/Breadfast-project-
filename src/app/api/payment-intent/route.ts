import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { amount } = await req.json()

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "egp",
        automatic_payment_methods: { enabled: true }
    })

    return NextResponse.json({
        clientSecret: paymentIntent.client_secret
    })
}
