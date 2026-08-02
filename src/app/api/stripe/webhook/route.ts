import { headers } from "next/headers"
import Stripe from "stripe"
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
    if (event.type === "payment_intent.succeeded") {
        const intent = event.data.object as Stripe.PaymentIntent
        const orderId = intent.metadata.order_id
        if (!orderId) {
            return new Response("No order_id", { status: 200 })
        }

        const { data, error } = await supabaseServer
            .from("orders")
            .update({
                payment_status: "paid",
                order_status: "confirmed",
                paid_at: new Date().toISOString(),
                payment_intent_id: intent.id,
            })
            .eq("id", orderId)
    }




    return new Response("ok", { status: 200 })
}
