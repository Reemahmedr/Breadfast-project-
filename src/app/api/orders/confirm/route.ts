import { supabaseServer } from "@/lib/supabase-server"
import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { payment_intent_id } = await req.json()

    if (!payment_intent_id) {
        return NextResponse.json({ error: "Missing payment_intent_id" }, { status: 400 })
    }

    let paymentIntent
    try {
        paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id)
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Invalid payment"
        return NextResponse.json({ error: message }, { status: 400 })
    }

    if (paymentIntent.status !== "succeeded") {
        return NextResponse.json({ error: "Payment not successful" }, { status: 400 })
    }

    const { data: byPi, error: byPiError } = await supabaseServer
        .from("orders")
        .select("*")
        .eq("payment_intent_id", payment_intent_id)
        .maybeSingle()

    let order = byPi
    let orderError = byPiError

    if (orderError || !order) {
        const metaOrderId = paymentIntent.metadata?.order_id
        if (metaOrderId) {
            const { data: byMeta, error: byMetaError } = await supabaseServer
                .from("orders")
                .select("*")
                .eq("id", metaOrderId)
                .maybeSingle()
            order = byMeta
            orderError = byMetaError
        }
    }

    if (orderError || !order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const { error: updateError } = await supabaseServer
        .from("orders")
        .update({
            order_status: "confirmed",
            payment_status: "paid",
            paid_at: new Date().toISOString(),
            payment_intent_id: payment_intent_id,
        })
        .eq("id", order.id)

    if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    await supabaseServer.from("cart_items").delete().eq("user_id", order.user_id)

    return NextResponse.json({ ok: true })
}

