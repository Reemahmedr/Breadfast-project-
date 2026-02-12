import { supabaseServer } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { user_id, promo_id } = await req.json()

    if (!user_id) {
        return NextResponse.json({ error: "Missing user_id" }, { status: 400 })
    }

    const { data, error } = await supabaseServer
        .from("cart_items")
        .select("* , products(*)")
        .eq("user_id", user_id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data || data.length === 0) {
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    const subtotal = data.reduce(
        (sum, item) => sum + item.products.price * item.quantity,
        0
    )

    let discount = 0
    let total = subtotal

    if (promo_id) {
        const { data: promo, error: promoError } = await supabaseServer
            .from("promo_codes")
            .select("*")
            .eq("id", promo_id)
            .single()

        if (promoError || !promo) {
            return NextResponse.json({ error: "Invalid promo" }, { status: 400 })
        }

        if (!promo.is_active) {
            return NextResponse.json({ error: "Promo not active" }, { status: 400 })
        }

        if (promo.valid_until && new Date() > new Date(promo.valid_until)) {
            return NextResponse.json({ error: "Promo expired" }, { status: 400 })
        }

        if (promo.usage_limit && promo.usage_count >= promo.usage_limit) {
            return NextResponse.json({ error: "Promo limit reached" }, { status: 400 })
        }

        if (promo.min_order_amount && subtotal < promo.min_order_amount) {
            return NextResponse.json(
                { error: `Minimum order is ${promo.min_order_amount}` },
                { status: 400 }
            )
        }

        if (promo.discount_type === "fixed") {
            discount = promo.discount_value
        } else if (promo.discount_type === "percentage") {
            discount = subtotal * (promo.discount_value / 100)

            if (promo.max_discount && discount > promo.max_discount) {
                discount = promo.max_discount
            }
        }

        total = subtotal - discount
    }

    return NextResponse.json({
        subtotal,
        discount,
        total
    })
}
