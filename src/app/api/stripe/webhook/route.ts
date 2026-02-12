import { headers } from "next/headers"
import Stripe from "stripe"
import { supabase } from "@/lib/supabase"
import { supabaseServer } from "@/lib/supabase-server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover",
})

export async function POST(req: Request) {
    const body = await req.text()
    const headersList = await headers()
    const sig = headersList.get("stripe-signature")

    if (!sig) {
        return new Response("No signature", { status: 400 })
    }

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err) {
        return new Response("Webhook Error", { status: 400 })
    }
    console.log("🔥 EVENT TYPE:", event.type)
    if (event.type === "payment_intent.succeeded") {
        const intent = event.data.object as Stripe.PaymentIntent
        const orderId = intent.metadata.order_id
        console.log("💳 INTENT ID:", intent.id)
        console.log("📦 METADATA:", intent.metadata)
        if (!orderId) {
            console.log("❌ No order_id in metadata")
            return new Response("No order_id", { status: 200 })
        }
        console.log("🆔 ORDER ID FROM METADATA:", orderId)

        const { data, error } = await supabaseServer
            .from("orders")
            .update({
                payment_status: "paid",
                order_status: "confirmed",
                paid_at: new Date().toISOString(),
                payment_intent_id: intent.id,
            })
            .eq("id", orderId)

        console.log("ORDER ID FROM METADATA:", orderId)
        console.log("UPDATED ROWS:", data)
        console.log("ERROR:", error)
    }




    return new Response("ok", { status: 200 })
}
