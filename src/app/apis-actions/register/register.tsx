export type RegisterData = {
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
}

export async function registerUser(data: RegisterData) {
    const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)

    })

    const result = await res.json()

    if (!res.ok) {
        throw new Error(result.error || "Register failed");
    }

    return result;
}