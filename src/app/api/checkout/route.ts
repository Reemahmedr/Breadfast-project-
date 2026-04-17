import { stripe } from "@/lib/stripe"
import { supabaseServer } from "@/lib/supabase-server"
import { NextResponse } from "next/server"
export async function POST(req: Request) {

    const body = await req.json()
    const { amount, user_id, promo_id } = body

    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "egp",
        automatic_payment_methods: { enabled: true },
        metadata: { user_id, promo_id: promo_id ?? null },
    })

    await supabaseServer.from("notifications").insert({
        user_id,
        title: "Purchase Dome",
        message: "Your purchase was done successfully",
    });

    return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
    })
}
