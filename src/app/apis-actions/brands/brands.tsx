export async function getAllBrands() {
    const res = await fetch(`/api/brands`, {
        cache: "no-store"
    })

    return res.json()
}