import { supabaseServer } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { payment_intent_id } = await req.json()

    const { error } = await supabaseServer
        .from("orders")
        .update({
            payment_status: "paid",
            order_status: "confirmed",
        })
        .eq("payment_intent_id", payment_intent_id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
}
