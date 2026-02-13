import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"


// export async function POST(req: Request) {

//     const body = await req.json()
//     const { amount, order_id } = body

//     const paymentIntent = await stripe.paymentIntents.create({
//         amount,
//         currency: "egp",
//         automatic_payment_methods: { enabled: true },
//         metadata: {
//             order_id,
//         },
//     })
//     console.log("PI CREATED:", paymentIntent.id, paymentIntent.metadata)

//     await supabaseServer
//         .from("orders")
//         .update({
//             payment_intent_id: paymentIntent.id,
//         })
//         .eq("id", order_id)


//     console.log("BODY:", body)
//     console.log("ORDER_ID:", order_id)
//     console.log("AMOUNT:", amount)


//     // console.log("PaymentIntent created", paymentIntent.id)
//     // console.log("CREATING PAYMENT FOR ORDER:", order_id)

//     return NextResponse.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id })
// }

export async function POST(req: Request) {

    const body = await req.json()
    const { amount , user_id , promo_id } = body

    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "egp",
        automatic_payment_methods: { enabled: true },
        metadata: { user_id, promo_id: promo_id ?? null },
    })

    return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
    })
}
