export async function getProductsByCategory(categoryId?: string | null) {
    const url = categoryId
        ? `/api/products?category_id=${categoryId}`
        : `/api/products`

    const res = await fetch(url, {
        cache: "no-store",
    })

    return res.json()
}
