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
        .select("delivery_zone_id, area")
        .eq("user_id", userId)
        .eq("is_default", true)
        .maybeSingle();

    if (!address) {
        return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    let deliveryZoneId = address.delivery_zone_id as string | null;

    if (!deliveryZoneId && address.area) {
        const { data: zoneArea } = await supabaseServer
            .from("delivery_zone_areas")
            .select("delivery_zone_id")
            .eq("area", address.area)
            .limit(1)
            .maybeSingle();

        deliveryZoneId = zoneArea?.delivery_zone_id ?? null;

        if (deliveryZoneId) {
            await supabaseServer
                .from("addresses")
                .update({ delivery_zone_id: deliveryZoneId })
                .eq("user_id", userId)
                .eq("is_default", true);
        }
    }

    if (!deliveryZoneId) {
        return NextResponse.json({ error: "Delivery zone not found" }, { status: 404 });
    }

    const { data: zone } = await supabaseServer
        .from("delivery_zones")
        .select("delivery_fee, min_order_amount")
        .eq("id", deliveryZoneId)
        .single();

    return NextResponse.json(zone);
}