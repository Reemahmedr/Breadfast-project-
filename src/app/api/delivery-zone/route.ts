import { supabaseServer } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET() {
    const { data: deliveryZoneData, error } = await supabaseServer
        .from("delivery_zone_areas")
        .select(`
            area,
            delivery_zones (
            city,
            delivery_fee,
            is_active
            )
        `)
        .eq("delivery_zones.is_active", true)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(deliveryZoneData)
}