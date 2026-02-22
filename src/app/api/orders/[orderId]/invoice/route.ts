import { generatePDF } from "@/lib/generate_pdf";
import { invoiceTemplate } from "@/lib/invoice_templete";
import { supabaseServer } from "@/lib/supabase-server";
import { authOptions } from "@/src/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params;

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: order, error } = await supabaseServer
        .from("orders")
        .select(`
            *,
            order_items (*, products (*)),
            addresses (*)
        `)
        .eq("id", orderId)
        .eq("user_id", userId)
        .single();

    if (error || !order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const html = invoiceTemplate(order);
    const pdfBuffer = await generatePDF(html);

    return new Response(Buffer.from(pdfBuffer), {
        status: 200,
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename=invoice-${order.order_number}.pdf`,
        },
    });
}