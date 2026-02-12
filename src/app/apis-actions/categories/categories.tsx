

export async function getCategories() {
    const res = await fetch("/api/categories", {
        cache: "no-store"
    })

    return res.json()
}