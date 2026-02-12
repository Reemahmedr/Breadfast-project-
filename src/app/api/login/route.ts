import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { email, password } = await req.json()

    if (!email || !password) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single()

    if (!user || error) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    return NextResponse.json({
        id: user.id,
        email: user.email,
        name: user.name,
    });
}