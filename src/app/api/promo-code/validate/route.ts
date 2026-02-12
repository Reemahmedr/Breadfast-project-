import { supabaseServer } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { code, orderTotal } = await req.json()

    if (!code || !orderTotal) {
        return NextResponse.json(
            { error: "Missing code or order total" },
            { status: 400 }
        )
    }

    const { data: promo, error } = await supabaseServer
        .from("promo_codes")
        .select("*")
        .eq("code", code)
        .single()

    if (error || !promo) {
        return NextResponse.json(
            { error: "Invalid promo code" },
            { status: 400 }
        )
    }


    if (!promo.is_active) {
        return NextResponse.json(
            { error: "Promo code is not active" },
            { status: 400 }
        )
    }

    if (promo.valid_until && new Date() > new Date(promo.valid_until)) {
        return NextResponse.json(
            { error: "Promo code expired" },
            { status: 400 }
        )
    }

    if (promo.usage_limit && promo.usage_count >= promo.usage_limit) {
        return NextResponse.json(
            { error: "Promo usage limit reached" },
            { status: 400 }
        )
    }

    if (orderTotal < promo.min_order_amount) {
        return NextResponse.json(
            { error: `Minimum order is ${promo.min_order_amount}` },
            { status: 400 }
        )
    }

    let discount = 0
    if (promo.discount_type === "fixed") {
        discount = promo.discount_value
    }
    else if (promo.discount_type === "percentage") {
        discount = orderTotal * (promo.discount_value / 100)

        if (promo.max_discount && discount > promo.max_discount) {
            discount = promo.max_discount
        }
    }

    const finalTotal = orderTotal - discount

    return NextResponse.json({
        discount,
        finalTotal,
        promoId: promo.id,
    })
}