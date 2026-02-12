import { stripe } from "@/lib/stripe";
import { supabaseServer } from "@/lib/supabase-server";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("user_id")

    if (!userId) {
        return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }

    const { data, error } = await supabaseServer
        .from("orders")
        .select("* , order_items(* , products(*))")
        .eq("user_id", userId)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });

}


export async function POST(req: Request) {
    const body = await req.json()
    const { user_id, address_id, payment_method, promo_id } = body

    if (!user_id || !address_id || !payment_method) {
        return NextResponse.json(
            { error: "missing required fields" },
            { status: 400 }
        )
    }

    console.log("ORDER BODY:", body)

    if (!user_id || !address_id || !payment_method) {
        return NextResponse.json(
            { error: "missing required fields" },
            { status: 400 }
        )
    }

    const { data: cart, error: cartError } = await supabaseServer
        .from("cart_items")
        .select("*, products(*)")
        .eq("user_id", user_id)

    if (cartError) {
        return NextResponse.json({ error: cartError.message }, { status: 500 })
    }

    if (!cart || cart.length === 0) {
        return NextResponse.json(
            { error: "cart is empty" },
            { status: 400 }
        )
    }

    const subtotal = cart.reduce(
        (sum, item) => sum + item.products.price * item.quantity,
        0
    )

    let discount = 0
    let total = subtotal

    let promo: any = null
    if (promo_id) {
        const { data, error: promoError } = await supabaseServer
            .from("promo_codes")
            .select("*")
            .eq("id", promo_id)
            .single()

        promo = data


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

        if (subtotal < promo.min_order_amount) {
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



    const { data: order, error: orderError } = await supabaseServer
        .from("orders")
        .insert([{
            user_id,
            address_id,
            payment_method,
            total_amount: total,
            subtotal: subtotal ?? 0,
            payment_status: "pending",
            order_status: "pending",
            discount_amount: discount,
            promo_code_id: promo_id ?? null
        }])
        .select()
        .single()

    if (orderError) {
        console.error("ORDER ERROR:", orderError)
        return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.products.name,
        product_image: item.products.image_url,
        quantity: item.quantity,
        unit_price: item.products.price,
        total_price: item.products.price * item.quantity
    }))

    const { error: itemsError } = await supabaseServer
        .from("order_items")
        .insert(orderItems)

    if (itemsError) {
        console.log("ORDER ITEMS:", orderItems)
        return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    if (promo_id && promo) {
        await supabaseServer
            .from("promo_codes")
            .update({ usage_count: promo.usage_count + 1 })
            .eq("id", promo_id)

        await supabaseServer
            .from("user_promo_usage")
            .insert({
                promo_code_id: promo_id,
                user_id,
                order_id: order.id
            })
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 1000),
        currency: "egp",
        automatic_payment_methods: { enabled: true },
        metadata: {
            order_id: order.id,
            user_id,
            promo_id: promo_id ?? null,
        }
    })

    await supabaseServer
        .from("orders")
        .update({ payment_intent_id: paymentIntent.id })
        .eq("id", order.id)


    return NextResponse.json({
        order,
        clientSecret: paymentIntent.client_secret
    }, { status: 201 })
}
