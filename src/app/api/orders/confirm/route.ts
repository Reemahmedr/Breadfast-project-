// import { supabaseServer } from "@/lib/supabase-server"
// import { NextResponse } from "next/server"

// export async function POST(req: Request) {
//     const { payment_intent_id } = await req.json()

//     const { error } = await supabaseServer
//         .from("orders")
//         .update({
//             payment_status: "paid",
//             order_status: "confirmed",
//         })
//         .eq("payment_intent_id", payment_intent_id)

//     if (error) {
//         return NextResponse.json({ error: error.message }, { status: 500 })
//     }

//     return NextResponse.json({ ok: true })
// }

import { supabaseServer } from "@/lib/supabase-server"
import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { payment_intent_id } = await req.json()

    if (!payment_intent_id) {
        return NextResponse.json({ error: "Missing payment_intent_id" }, { status: 400 })
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id)

    if (paymentIntent.status !== "succeeded") {
        return NextResponse.json({ error: "Payment not successful" }, { status: 400 })
    }

    const { data: order, error: orderError } = await supabaseServer
        .from("orders")
        .select("*")
        .eq("payment_intent_id", payment_intent_id)
        .single()

    if (orderError || !order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    await supabaseServer
        .from("orders")
        .update({
            payment_status: "paid",
            order_status: "confirmed",
        })
        .eq("id", order.id)

    await supabaseServer
        .from("cart_items")
        .delete()
        .eq("user_id", order.user_id)

    return NextResponse.json({ ok: true })
}

