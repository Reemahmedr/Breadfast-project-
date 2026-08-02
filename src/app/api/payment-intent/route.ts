import { stripe } from "@/lib/stripe"
import { supabaseServer } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

function getProductPrice(products: unknown): number {
    if (!products) return 0
    if (Array.isArray(products)) {
        return Number(products[0]?.price || 0)
    }
    if (typeof products === "object" && "price" in products) {
        return Number((products as { price: unknown }).price || 0)
    }
    return 0
}

export async function POST(req: Request) {
    const { user_id } = await req.json()

    if (!user_id) {
        return NextResponse.json(
            { error: "user_id is required" },
            { status: 400 }
        )
    }

    // Same join shape as /api/orders and /api/checkout/preview
    const { data: cartItems, error } = await supabaseServer
        .from("cart_items")
        .select("*, products(*)")
        .eq("user_id", user_id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!cartItems || cartItems.length === 0) {
        return NextResponse.json(
            { error: "Cart is empty" },
            { status: 400 }
        )
    }

    const amount = cartItems.reduce((sum, item) => {
        const price = getProductPrice(item.products)
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
        automatic_payment_methods: { enabled: true },
        metadata: { user_id: String(user_id) },
    })

    return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        amount,
    })
}
