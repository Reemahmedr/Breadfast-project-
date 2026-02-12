import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("category_id")

    let query = supabase.from("products").select("*")

    if (categoryId?.trim()) {
        query = query.eq("category_id", categoryId)
    }

    const { data, error } = await query

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json(data, { status: 200 });
}
