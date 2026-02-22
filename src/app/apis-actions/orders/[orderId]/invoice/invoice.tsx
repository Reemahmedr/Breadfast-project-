export async function getInvoice({ params }: { params: { orderId: string } }) {
    const orderId = params.orderId
    const res = await fetch(`/api/orders/${orderId}/invoice`, {
        cache: "no-store"
    })

    if (!res.ok) {
        throw new Error("Failed to fetch invoice");
    }

    const blob = await res.blob();
    return blob;
}