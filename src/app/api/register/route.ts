// import { supabase } from "@/lib/supabase";
import { supabaseServer } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    const body = await req.json();
    const { name, phone, email, password, confirmPassword } = body


    if (!email || !password || !name) {
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
        )
    }

    const { data: existingUser } = await supabaseServer
        .from("users") // get the table
        .select("id") //select the primary key
        .eq("email", email) // check for the mail here is euqal in the table



    if (existingUser && existingUser.length > 0) {
        return NextResponse.json({ error: "User exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: user, error } = await supabaseServer
        .from("users")
        .insert({
            name,
            email,
            password: hashedPassword,
        })
        .select()
        .single()


    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { error: profileError } = await supabaseServer.from("profiles").insert({
        id: user.id,
        full_name: name,
        phone,
    })
    if (profileError) {

        return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}