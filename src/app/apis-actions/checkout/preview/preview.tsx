export async function getCheckoutPreview(user_id: string, promo_id: string) {
    const res = await fetch(`/api/checkout/preview`, {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, promo_id })
    })
    return res.json()
}