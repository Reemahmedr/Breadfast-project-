export default async function GetNotifications() {
    const res = await fetch(`/api/notification`, {
        method: "GET",
        cache: "no-store"
    })

    return res.json()
}