export async function getMyDeliveryZone() {
    const res = await fetch("/api/myDeliveryZone", { cache: "no-store" })
    return res.json()
}