export type Profile = {
    full_name: string,
    phone: string,
    avatar_url: string
}

export async function getProfile() {
    const res = await fetch(`/api/profile`, {
        cache: "no-store"
    })

    return res.json()
}

export async function createProfile(payload: Profile) {
    const res = await fetch(`/api/profile`, {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })

    return res.json()
}

export async function updateProfile(payload: Profile) {
    const res = await fetch(`/api/profile`, {
        method: "PUT",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })

    return res.json()
}