"use client"

import { useQuery } from "@tanstack/react-query"
import GetNotifications from "../apis-actions/notification/notification"
import Loading from "@/src/components/loading"
import { formatDistanceToNow } from "date-fns"

export default function page() {

    const { data, isLoading } = useQuery({ queryKey: ['getNotification'], queryFn: GetNotifications })

    const isNew = (date: string) =>
        new Date(date).getTime() > Date.now() - 1000 * 60 * 60 * 24

    const notifications = data ?? []

    const sorted = [...notifications].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    const newNotifications = sorted.filter(n => isNew(n.created_at))

    const earlierNotifications = sorted.filter(n => !isNew(n.created_at))

    if (isLoading) {
        return <Loading></Loading>
    }

    return <>
        <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-pink-50">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-purple-100">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                            <p className="text-sm text-gray-500 mt-1">Stay updated with all your alerts</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {newNotifications.length === 0 && earlierNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
                    <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-3xl p-12 shadow-lg text-center w-full max-w-md mx-auto">
                        <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-md border border-purple-100">
                            <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                            No notifications yet
                        </h2>
                        <p className="text-gray-600 text-base">
                            We'll notify you when something arrives
                        </p>
                        <div className="mt-8">
                            <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                                <div className="h-full bg-linear-to-r from-purple-600 to-pink-600 rounded-full" style={{ width: '0%' }} />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto px-6 py-8">
                    {/* New Notifications Section */}
                    {newNotifications.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-linear-to-r from-purple-600 to-pink-600"></div>
                                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                    New
                                </h2>
                            </div>

                            <div className="space-y-3">
                                {newNotifications.map((notify: any) => {
                                    const timeAgo = formatDistanceToNow(new Date(notify.created_at), {
                                        addSuffix: true,
                                    })

                                    return <div key={notify.id} className="group bg-white rounded-2xl border border-purple-100 p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-linear-to-b from-purple-600 to-pink-600 rounded-l-full group-hover:shadow-lg group-hover:shadow-purple-400/50 transition-all duration-300" />

                                        <div className="flex items-start gap-4 pl-1">
                                            <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center shrink-0 group-hover:shadow-lg group-hover:shadow-purple-200/50 transition-all duration-300">
                                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                    <h3 className="text-base font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                                                        {notify.title}
                                                    </h3>
                                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                                        {timeAgo}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {notify.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                    )}

                    {/* Earlier Notifications Section */}
                    {earlierNotifications.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-purple-300"></div>
                                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                    Earlier
                                </h2>
                            </div>

                            <div className="space-y-3">
                                {earlierNotifications.map((notify: any) => {
                                    const timeAgo = formatDistanceToNow(new Date(notify.created_at), {
                                        addSuffix: true,
                                    })

                                    return <div key={notify.id} className="group bg-purple-50/30 rounded-2xl border border-purple-100 p-6 hover:bg-purple-50 hover:shadow-md transition-all duration-300">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-white border border-purple-200 flex items-center justify-center shrink-0 group-hover:border-purple-300 transition-colors duration-300">
                                                <svg className="w-6 h-6 text-purple-400 group-hover:text-purple-600 transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                    <h3 className="text-base font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                                                        {notify.title}
                                                    </h3>
                                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                                        {timeAgo}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {notify.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    </>

}