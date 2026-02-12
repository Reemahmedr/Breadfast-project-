

export async function getWishlish(user_id: string) {
    const res = await fetch(`/api/wishlist?user_id=${user_id}`, {
        cache: "no-store"
    })

    return res.json()
}

export async function addToWishlist({ user_id, product_id }: { user_id: string, product_id: string }) {
    const res = await fetch(`/api/wishlist`, {
        method: "POST",
        cache: "no-store",
        body: JSON.stringify({ user_id, product_id })
    })

    return res.json()
}

export async function deleteFromWishlist(user_id: string, product_id: string) {
    const res = await fetch(`/api/wishlist?user_id=${user_id}&product_id=${product_id}`, {
        method: "DELETE",
        cache: "no-store"
    })
    return res.json()
}

export async function clearWishlist(user_id: string) {
    const res = await fetch(`/api/wishlist?user_id=${user_id}`, {
        method: "DELETE",
        cache: "no-store"
    })

    return res.json()
}