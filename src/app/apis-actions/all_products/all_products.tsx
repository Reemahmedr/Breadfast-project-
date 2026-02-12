


export async function getAllProducts() {
    const res = await fetch("/api/all_products", {
        cache: "no-store"
    })
    const data = await res.json()
    return data
}