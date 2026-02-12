// import { supabase } from "@/lib/supabase";
import { supabaseServer } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    const body = await req.json();
    console.log("Received body:", body);
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


    console.log("Existing user check:", existingUser);

    if (existingUser && existingUser.length > 0) {
        console.log("User already exists!");
        return NextResponse.json({ error: "User exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    const { data: user, error } = await supabaseServer
        .from("users")
        .insert({
            name,
            email,
            password: hashedPassword,
        })
        .select()
        .single()

    console.log("Insert result:", user, error);

    if (error) {
        console.log("❌ Insert user error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { error: profileError } = await supabaseServer.from("profiles").insert({
        id: user.id,
        full_name: name,
        phone,
    })
    if (profileError) {
        console.log("❌ Profile insert error:", profileError);
        return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}