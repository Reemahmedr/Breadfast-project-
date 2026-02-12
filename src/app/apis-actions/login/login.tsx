export type LoginData = {
    email: string,
    password: string,
}

export async function loginUser(data: LoginData) {
    const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)

    })

    const result = await res.json()

    if (!res.ok) {
        throw new Error(result.error || "Login failed");
    }

    return result;
}