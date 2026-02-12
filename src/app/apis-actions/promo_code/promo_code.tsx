export async function applyPromoCode(code: string, orderTotal: number) {
    const res = await fetch(`/api/promo-code/validate`, {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, orderTotal })
    })
    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.error || "Promo code failed")
    }

    return data
}