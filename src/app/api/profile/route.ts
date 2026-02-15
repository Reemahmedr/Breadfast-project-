import { supabaseServer } from "@/lib/supabase-server";
import { authOptions } from "@/src/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);

    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json(
            { error: "Not authenticated" },
            { status: 401 }
        );
    }

    const { data: profile, error: profileError } = await supabaseServer
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

    if (profileError) {
        return NextResponse.json(
            { error: profileError.message },
            { status: 500 }
        );
    }

    const { data: orders, count: totalOrders, error: countError } = await supabaseServer
        .from("orders")
        .select("total_amount", { count: "exact" })
        .eq("user_id", userId);

    const totalSpent =
        orders?.reduce(
            (acc, order) => acc + (order.total_amount ?? 0),
            0
        ) ?? 0;


    if (countError) {
        return NextResponse.json(
            { error: countError.message },
            { status: 500 }
        );
    }

    const { count: totalAddress, error: addressError } = await supabaseServer
        .from("addresses")
        .select("*", { count: "exact" })
        .eq("user_id", userId)

    if (addressError) {
        return NextResponse.json(
            { error: addressError.message },
            { status: 500 }
        );
    }

    return NextResponse.json({
        profile,
        totalOrders: totalOrders ?? 0,
        totalSpent,
        totalAddress
    });
}


export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json()

    const { full_name, phone } = body

    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(full_name)}&backgroundColor=FCF2F9&textColor=6B21A8`

    const { data, error } = await supabaseServer
        .from("profiles")
        .insert([{ id: userId, full_name, phone, avatar_url: avatarUrl }])
        .select()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data }, { status: 201 });
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json()

    const { full_name, phone, avatar_url } = body

    const { data, error } = await supabaseServer
        .from("profiles")
        .update({ full_name, phone, avatar_url, updated_at: new Date().toISOString() })
        .eq("id", userId)
        .select()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data });
}
