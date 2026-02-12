import { supabaseServer } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET(req:Request) {
    const {data , error} = await supabaseServer
    .from("brands")
    .select("*")

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}