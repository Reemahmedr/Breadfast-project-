import { stripe } from "@/lib/stripe"
import { supabaseServer } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {

    const { user_id } = await req.json()

    if (!user_id) {
        return NextResponse.json(
            { error: "user_id is required" },
            { status: 400 }
        )
    }

    const { data: cartItems, error } = await supabaseServer
        .from("cart_items")
        .select("quantity, products(price)")
        .eq("user_id", user_id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const amount = cartItems?.reduce((sum, item) => {
        const price = Number(item.products[0]?.price || 0)
        const qty = Number(item.quantity || 0)
        return sum + price * qty
    }, 0)

    if (!amount || isNaN(amount)) {
        return NextResponse.json(
            { error: "Invalid cart total" },
            { status: 400 }
        )
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "egp",
        automatic_payment_methods: { enabled: true }
    })

    return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        amount
    })

}
