export type Order = {
    user_id: string,
    address_id: string,
    payment_method: string
    promo_code_id?: string | null
}


export async function getOrders(user_id: string) {

    const res = await fetch(`/api/orders?user_id=${user_id}`, {
        cache: "no-store"
    })

    const data = await res.json()
    return Array.isArray(data) ? data : []
}

export async function getRecentOrders(user_id: string) {
    const res = await fetch(`/api/orders?user_id=${user_id}`, {
        cache: "no-store"
    })

    const data = await res.json()

    if (!Array.isArray(data)) return []

    return data.slice(0, 3) 
}



export async function createOrders(order_item: Order) {
    const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(order_item),
    })


    return res.json()
}