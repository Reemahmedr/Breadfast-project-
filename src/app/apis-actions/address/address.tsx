export type Address = {
    id?: string
    street_address: string
    area: string
    city: string
    phone: string
    building?: string
    floor?: string
    apartment?: string
    landmark?: string
    is_default?: boolean
    address_type?: "home" | "work" | "other"
}

export type UpdateDefaultAddressPayload = {
    address_id: string
    is_default: boolean
}


export async function addAddress(payload: Address) {
    const res = await fetch(`/api/address`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(payload),
    })

    if (!res.ok) {
        throw new Error("Failed to add address")
    }

    return res.json()
}

export async function getAddress() {
    const res = await fetch(`/api/address`, {
        cache: "no-store"
    })
    if (!res.ok) {
        throw new Error("Failed to get address")
    }

    return res.json()
}

export async function updateAddress(payload: Address & { address_id: string }) {
    const res = await fetch(`/api/address`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(payload)
    })

    if (!res.ok) {
        throw new Error("Failed to update address")
    }

    return res.json()
}

export async function UpdateDefaultAddress(payload: UpdateDefaultAddressPayload) {
    const res = await fetch(`/api/address`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(payload)
    })
    if (!res.ok) {
        throw new Error("Failed to update address")
    }

    return res.json()
}

export async function deleteAddress(address_id: string) {
    const res = await fetch(`/api/address`, {
        method: "DELETE",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address_id })
    })

    if (!res.ok) {
        throw new Error("Failed to delete address")
    }

    return res.json()
}
