
"use client"

import { useQuery } from "@tanstack/react-query"
import GetNotifications from "../app/apis-actions/notification/notification"
import Loading from "./loading"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"

export default function Notifications({ onClose }: { onClose: () => void }) {

    const { data, isLoading } = useQuery({ queryKey: ['getNotification'], queryFn: GetNotifications })

    const isNew = (date: string) =>
        new Date(date).getTime() > Date.now() - 1000 * 60 * 60 * 24

    const notifications = data ?? []

    const sorted = [...notifications].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    const newNotifications = sorted.filter(n => isNew(n.created_at)).slice(0, 2)

    const earlierNotifications = sorted.filter(n => !isNew(n.created_at)).slice(0, 1)


    return (
        <div className="absolute right-0 mt-2 w-[380px] bg-white shadow-lg rounded-xl z-50 p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                </div>
            </div>

            {/* Unread Notifications */}
            <div className="flex flex-col gap-3">


                {newNotifications.length > 0 && (
                    <>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                            New
                        </p>

                        {newNotifications.map((notify: any) => {
                            const timeAgo = formatDistanceToNow(new Date(notify.created_at), {
                                addSuffix: true,
                            })

                            return (
                                <div key={notify.id} className="bg-white rounded-2xl border border-gray-200 p-5 relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-linear-to-b from-purple-600 to-pink-600 rounded-l-full" />

                                    <div className="flex items-start gap-3 pl-1">
                                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between mb-1">
                                                <p className="text-sm font-bold">{notify.title}</p>
                                                <span className="text-xs text-gray-400">{timeAgo}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{notify.message}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}


                    </>
                )}

                {/* EARLIER */}
                {earlierNotifications.length > 0 && (
                    <>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-2">
                            Earlier
                        </p>

                        {earlierNotifications.map((notify: any) => {
                            const timeAgo = formatDistanceToNow(new Date(notify.created_at), {
                                addSuffix: true,
                            })

                            return (
                                <div key={notify.id} className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between mb-1">
                                                <p className="text-sm font-bold">{notify.title}</p>
                                                <span className="text-xs text-gray-400">{timeAgo}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{notify.message}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </>
                )}

                {newNotifications.length === 0 && earlierNotifications.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mb-3">
                            <i className="fa-regular fa-bell text-purple-400 text-xl" />
                        </div>
                        <p className="text-sm font-bold text-gray-900 mb-1">No notifications yet</p>
                        <p className="text-xs text-gray-400">We'll notify you when something arrives</p>
                    </div>
                )}

            </div>

            {/* Footer */}
            <div className="mt-5 flex items-center justify-center gap-1.5">
                <Button onClick={onClose} className="text-sm cursor-pointer font-semibold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    View all notifications
                </Button>
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M19 12H5m14 0-4 4m4-4-4-4" />
                </svg>
            </div>

        </div >
    )
}
