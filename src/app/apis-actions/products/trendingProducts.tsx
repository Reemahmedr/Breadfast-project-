export async function getTrendingProducts() {
    const res = await fetch("/api/products/trending", {
        cache: "no-store"
    });

    if (!res.ok) {
        throw new Error("Failed to fetch trending products");
    }

    return res.json();
};
