export type Cart = {
    user_id: string,
    product_id: string,
    quantity: number
}

export async function getCart(user_id: string) {
    const res = await fetch(`/api/cart?user_id=${user_id}`, { cache: "no-store" })
    return res.json()
}

export async function addToCart(item: Cart) {
    const res = await fetch('/api/cart', {
        method: "POST",
        cache: "no-store",
        body: JSON.stringify(item),
    })
    return res.json()
}

export async function updateCart(updateItem: Cart) {
    const res = await fetch("/api/cart", {
        method: "PATCH",
        cache: "no-store",
        body: JSON.stringify(updateItem)
    })
    return res.json()
}


export async function deleteFromCart(user_id: string, product_id: string) {
    const res = await fetch(`/api/cart?user_id=${user_id}&product_id=${product_id}`, {
        method: "DELETE",
        cache: "no-store"
    })
    return res.json()
}

export async function clearCart(user_id: string) {
    const res = await fetch(`/api/cart?user_id=${user_id}`, {
        method: "DELETE",
        cache: "no-store"
    })

    return res
}