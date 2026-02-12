import { supabase } from "@/lib/supabase";
import { supabaseServer } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("user_id")

    if (!userId) {
        return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }

    const { data, error } = await supabase
        .from("cart_items")
        .select("* , products(*)") //join 
        .eq("user_id", userId)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });

}

export async function POST(req: Request) {
    const body = await req.json()
    const { user_id, product_id, quantity } = body

    console.log("CART BODY:", body)


    if (!user_id || !product_id || !quantity) {
        return NextResponse.json(
            { error: "user_id, product_id and quantity are required" },
            { status: 400 }
        );
    }

    const { data, error } = await supabaseServer
        .from("cart_items")
        .insert([{ user_id, product_id, quantity }])

    if (error) {
        console.error("API ERROR:", error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
}

export async function PATCH(req: Request) {
    const body = await req.json()
    const { user_id, product_id, quantity } = body

    if (!user_id || !product_id || !quantity) {
        return NextResponse.json(
            { error: "user_id, product_id and quantity are required" },
            { status: 400 }
        );
    }

    const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("user_id", user_id)
        .eq("product_id", product_id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url)
    const user_id = searchParams.get("user_id")
    const product_id = searchParams.get("product_id")

    if (!user_id) {
        return NextResponse.json(
            { error: "user_id is required" },
            { status: 400 }
        )
    }

    let query = supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user_id)

    if (product_id) {
        query = query.eq("product_id", product_id)
    }

    const { error } = await query

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
        { message: product_id ? "Item deleted" : "Cart cleared" },
        { status: 200 }
    )
}


