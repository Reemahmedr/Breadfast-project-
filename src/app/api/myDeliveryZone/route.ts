import { supabaseServer } from "@/lib/supabase-server";
import { authOptions } from "@/src/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: address } = await supabaseServer
        .from("addresses")
        .select("delivery_zone_id")
        .eq("user_id", userId)
        .eq("is_default", true)
        .single();

    if (!address) {
        return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    const { data: zone } = await supabaseServer
        .from("delivery_zones")
        .select("delivery_fee, min_order_amount")
        .eq("id", address.delivery_zone_id)
        .single();

    return NextResponse.json(zone);
}