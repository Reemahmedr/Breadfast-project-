"use client"

import { useQuery } from "@tanstack/react-query"
import { getProfile } from "../apis-actions/profile/profile"
import Loading from "@/src/components/loading"
import { useSession } from "next-auth/react"

export default function page() {

    const { data: sessionData } = useSession()

    const { data: getProfileData, isLoading: getProfileLoaing } = useQuery({
        queryKey: ['getProfile'],
        queryFn: getProfile
    })

    const profile = getProfileData?.profile
    const totalOrders = getProfileData?.totalOrders;
    const totalSpent = getProfileData?.totalSpent;
    const savedAddress = getProfileData?.totalAddress
    const memberSince = new Date(profile?.created_at).toLocaleDateString(
        "en-US",
        { month: "long", year: "numeric" }
    );


    if (getProfileLoaing) {
        return <Loading></Loading>
    }
    return (
        <div>

            <div className="bg-linear-to-br from-gray-50 to-purple-50/30 mt-36">
                {/* Profile Container */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-12">
                    {/* Profile Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Profile Header */}
                        <div className="px-6 sm:px-8 pt-6 pb-8">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full bg-linear-to-r from-purple-600 to-pink-600 p-1">
                                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                            AH
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-linear-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                                        Gold
                                    </div>
                                </div>

                                {/* Profile Info */}
                                <div className="flex-1 text-center sm:text-left">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile?.full_name}</h1>
                                    <p className="text-gray-600 mb-4"> Member since {memberSince} </p>

                                    <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm"> {sessionData?.user.email} </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span className="text-sm"> {profile?.phone} </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Edit Button */}
                                <button className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gray-200">
                            <div className="bg-white px-6 py-6 text-center">
                                <div className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1"> {totalOrders} </div>
                                <div className="text-sm text-gray-600 font-medium">Total Orders</div>
                            </div>
                            <div className="bg-white px-6 py-6 text-center">
                                <div className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1"> {totalSpent} </div>
                                <div className="text-sm text-gray-600 font-medium">Total Spent (EGP)</div>
                            </div>
                            <div className="bg-white px-6 py-6 text-center">
                                <div className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1"> {savedAddress} </div>
                                <div className="text-sm text-gray-600 font-medium">Saved Addresses</div>
                            </div>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                        {/* Recent Orders */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Orders</h2>

                                {/* Order 1 */}
                                <div className="border border-gray-200 rounded-xl p-5 mb-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-gray-900">#ORD-2024-001</h3>
                                            <p className="text-sm text-gray-600">Feb 10, 2026</p>
                                        </div>
                                        <span className="bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full">
                                            Delivered
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">3 items</span>
                                        <span className="text-lg font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                            1,250 EGP
                                        </span>
                                    </div>
                                </div>

                                {/* Order 2 */}
                                <div className="border border-gray-200 rounded-xl p-5 mb-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-gray-900">#ORD-2024-002</h3>
                                            <p className="text-sm text-gray-600">Feb 5, 2026</p>
                                        </div>
                                        <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full">
                                            In Transit
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">2 items</span>
                                        <span className="text-lg font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                            890 EGP
                                        </span>
                                    </div>
                                </div>

                                {/* Order 3 */}
                                <div className="border border-gray-200 rounded-xl p-5 mb-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-gray-900">#ORD-2024-003</h3>
                                            <p className="text-sm text-gray-600">Jan 28, 2026</p>
                                        </div>
                                        <span className="bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full">
                                            Delivered
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">5 items</span>
                                        <span className="text-lg font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                            2,340 EGP
                                        </span>
                                    </div>
                                </div>

                                <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors duration-200">
                                    View All Orders
                                </button>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Saved Addresses */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Saved Addresses</h2>

                                {/* Address 1 */}
                                <div className="border-l-4 border-purple-600 bg-purple-50 rounded-r-lg p-4 mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-gray-900">Home</span>
                                        <span className="bg-linear-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                            Default
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-1">123 Tahrir Street, Downtown</p>
                                    <p className="text-sm text-gray-600">Cairo, 11511</p>
                                </div>

                                {/* Address 2 */}
                                <div className="border border-gray-200 rounded-lg p-4 mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-gray-900">Work</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-1">456 Nile Corniche, Maadi</p>
                                    <p className="text-sm text-gray-600">Cairo, 11728</p>
                                </div>

                                <button className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add New Address
                                </button>
                            </div>

                            {/* Account Settings */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>

                                <div className="space-y-3">
                                    <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                        </svg>
                                        Change Password
                                    </button>

                                    <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        Notifications
                                    </button>

                                    <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        Payment Methods
                                    </button>

                                    <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Privacy Settings
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
