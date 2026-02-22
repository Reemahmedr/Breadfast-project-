export async function getDeliveryZone() {
    const res = await fetch(`/api/delivery-zone`, {
        cache: "no-store"
    })

    return res.json()
}