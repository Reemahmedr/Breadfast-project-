export async function changePassword(currentPassword: string, newPassword: string) {

    const res = await fetch(`/api/change_password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
    })

    return res.json()
}