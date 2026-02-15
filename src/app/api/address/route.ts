import { supabaseServer } from "@/lib/supabase-server";
import { authOptions } from "@/src/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET() {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    const { data, error } = await supabaseServer
        .from("addresses")
        .select("*")
        .eq("user_id", userId)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}


export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    const userId = session?.user?.id

    const body = await req.json()


    const { data: existing, error: existingError } = await supabaseServer
        .from("addresses")
        .select("id")
        .eq("user_id", userId)

    const isFirst = !existing || existing.length === 0

    if (body.is_default || isFirst) {
        await supabaseServer
            .from("addresses")
            .update({ is_default: false })
            .eq("user_id", userId)
    }

    if (existingError) {
        return NextResponse.json(
            { error: existingError.message },
            { status: 500 })
    }

    const cleanAddress = {
        user_id: userId,
        street_address: body.street_address,
        area: body.area,
        phone: body.phone?.trim() ,
        city: body.city,
        is_default: body.is_default || isFirst,

        ...(body.address_type && { address_type: body.address_type }),
        ...(body.building && { building: body.building }),
        ...(body.floor && { floor: body.floor }),
        ...(body.apartment && { apartment: body.apartment }),
        ...(body.landmark && { landmark: body.landmark }),
    }

    const { data, error } = await supabaseServer
        .from("addresses")
        .insert(cleanAddress)
        .select()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })

}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    const userId = session?.user?.id

    if (!userId) {
        return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }

    const body = await req.json()

    const { address_id, is_default, ...rest } = body

    if (body.is_default) {
        await supabaseServer
            .from("addresses")
            .update({ is_default: false })
            .eq("user_id", userId)
    }

    const { data, error } = await supabaseServer
        .from("addresses")
        .update({ is_default, ...rest })
        .eq("id", address_id)
        .eq("user_id", userId)
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    const userId = session?.user?.id

    if (!userId) {
        return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }
    const body = await req.json()

    const { address_id } = body
    if (!address_id) {
        return NextResponse.json(
            { error: "address_id is required" },
            { status: 400 }
        )
    }

    const { data: deleted } = await supabaseServer
        .from("addresses")
        .delete()
        .eq("id", address_id)
        .eq("user_id", userId)
        .select()
        .single()

    if (deleted?.is_default) {
        const { data: nextDefault } = await supabaseServer
            .from("addresses")
            .select("id")
            .eq("user_id", userId)
            .order("created_at", { ascending: true })
            .limit(1)
            .single()

        if (nextDefault) {
            await supabaseServer
                .from("addresses")
                .update({ is_default: true })
                .eq("id", nextDefault.id)
        }
    }

    return NextResponse.json({ success: true })
}