import { supabaseServer } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET() {
    const { data, error } = await supabaseServer
        .from("products")
        .select("id")
        .contains("tags", ["trending"]);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data.map(p => p.id));
}

