import { supabaseServer } from "@/lib/supabase-server";
import { authOptions } from "@/src/auth";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {


    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json(
            { error: "Not authenticated" },
            { status: 401 }
        );
    }

    const { currentPassword, newPassword } = await req.json();

    const { data: user, error: userError } = await supabaseServer
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

    if (userError || !user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
        return NextResponse.json(
            { error: "Current password is incorrect" },
            { status: 400 }
        );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { error: updateError } = await supabaseServer
        .from("users")
        .update({ password: hashedPassword })
        .eq("id", userId);

    if (updateError) {
        return NextResponse.json(
            { error: "Failed to update password" },
            { status: 500 }
        );
    }

    await supabaseServer
        .from("notifications")
        .insert({
            user_id: user.id,
            title: "Password Changed",
            message: "Your password was updated successfully",
        });

    return NextResponse.json({ success: true });
}