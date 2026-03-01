"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getProfile, updateProfile } from "../apis-actions/profile/profile"
import Loading from "@/src/components/loading"
import { useSession } from "next-auth/react"
import { getRecentOrders } from "../apis-actions/orders/orders"
import Link from "next/link"
import { getAddress } from "../apis-actions/address/address"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function page() {


    const { data: sessionData } = useSession()
    const queryClient = useQueryClient()


    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)


    const { data: getProfileData, isLoading: getProfileLoaing } = useQuery({
        queryKey: ['getProfile'],
        queryFn: getProfile,
        enabled: !!sessionData?.user.id,
    })

    const profile = getProfileData?.profile

    const [fullName, setFullName] = useState(profile?.full_name || "")
    const [phone, setPhone] = useState(profile?.phone || "")

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name)
            setPhone(profile.phone)
        }
    }, [profile])



    const { data: getRecentOrdersData } = useQuery({
        queryKey: ['getOrders'],
        queryFn: () => getRecentOrders(sessionData?.user.id as string),
        enabled: !!sessionData?.user.id,
    })

    const { data: getAddressData } = useQuery({
        queryKey: ['getAddress'],
        queryFn: getAddress
    })



    const totalOrders = getProfileData?.totalOrders;
    const totalSpent = getProfileData?.totalSpent;
    const savedAddress = getProfileData?.totalAddress
    const memberSince = new Date(profile?.created_at).toLocaleDateString(
        "en-US",
        { month: "long", year: "numeric" }
    );

    const { mutate: editProfileMutate, isPending: isUpdating } = useMutation({
        mutationFn: (data: { full_name: string, phone: string }) => updateProfile(data.full_name, data.phone, `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.full_name)}&backgroundColor=FCF2F9&textColor=6B21A8`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getProfile"] })
        }
    })

    const full_Name = profile?.full_name

    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(full_Name)}&backgroundColor=FCF2F9&textColor=6B21A8`



    if (getProfileLoaing || isUpdating) {
        return <Loading></Loading>
    }
    return (
        <>
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
                                        <Image
                                            className="rounded-3xl"
                                            src={avatarUrl}
                                            alt="avatar"
                                            width={100}
                                            height={100}
                                            unoptimized
                                        />
                                        <div className="absolute -bottom-2 -right-2 bg-linear-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                                            Hi
                                        </div>
                                    </div>

                                    {/* Profile Info */}
                                    <div className="flex-1 text-center sm:text-left">
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">{profile?.full_name}</h1>
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
                                    <Button
                                        onClick={() => setIsEditProfileOpen(true)}
                                        className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 cursor-pointer py-3.5 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-base"
                                    >
                                        Edit Profile
                                    </Button>
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
                                    {/* {getRecentOrdersData?.map((recent: any) => {

                                        const totalQuantity = recent.order_items.reduce(
                                            (acc: number, item: any) => acc + item.quantity,
                                            0
                                        )

                                        return (<div className="border border-gray-200 rounded-xl p-5 mb-4 hover:shadow-md transition-shadow">
                                            <div key={recent.id} className="flex items-center justify-between mb-3">
                                                <div>
                                                    <h3 className="font-bold text-gray-900"> {recent.order_number} </h3>
                                                    <p className="text-sm text-gray-600">{new Date(recent.created_at).toLocaleDateString()} </p>
                                                </div>
                                                <span className="bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full">
                                                    {recent.order_status}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600"> {totalQuantity} items</span>
                                                <span className="text-lg font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                    {recent.total_amount} EGP
                                                </span>
                                            </div>
                                        </div>)
                                    })} */}


                                    {getRecentOrdersData?.length === 0 || !getRecentOrdersData ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-5">
                                                <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">No Orders Yet</h3>
                                            <p className="text-sm text-gray-500 mb-6 max-w-xs">
                                                Looks like you haven't placed any orders yet. Start shopping and your orders will appear here.
                                            </p>
                                            <Link
                                                href="/"
                                                className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm"
                                            >
                                                Start Shopping
                                            </Link>
                                        </div>
                                    ) : (
                                        getRecentOrdersData?.map((recent) => {
                                            const totalQuantity = recent.order_items.reduce(
                                                (acc: any, item: any) => acc + item.quantity,
                                                0
                                            )
                                            return (
                                                <div className="border border-gray-200 rounded-xl p-5 mb-4 hover:shadow-md transition-shadow">
                                                    <div key={recent.id} className="flex items-center justify-between mb-3">
                                                        <div>
                                                            <h3 className="font-bold text-gray-900">{recent.order_number}</h3>
                                                            <p className="text-sm text-gray-600">{new Date(recent.created_at).toLocaleDateString()}</p>
                                                        </div>
                                                        <span className="bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full">
                                                            {recent.order_status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-600">{totalQuantity} items</span>
                                                        <span className="text-lg font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                            {recent.total_amount} EGP
                                                        </span>
                                                    </div>
                                                </div>

                                            )
                                        })
                                    )}
                                    {getRecentOrdersData?.length != 0 && <Link
                                        href={`/orders`}
                                        className="w-full mt-4 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                                    >
                                        <span>View All Orders</span>
                                        <svg
                                            className="w-5 h-5"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 12H5m14 0-4 4m4-4-4-4"
                                            />
                                        </svg>
                                    </Link>}
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Saved Addresses */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Saved Addresses</h2>
                                    {/* {getAddressData?.map((address: any) => {
                                        return (<div
                                            key={address.id}
                                            className={`rounded-lg p-4 mb-4 ${address.is_default
                                                ? 'border-2 border-purple-500 bg-purple-50'
                                                : 'border border-gray-200 bg-white'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold text-gray-900 capitalize"> {address.address_type} </span>
                                                {address.is_default && <span className="bg-linear-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                                    Default
                                                </span>}
                                            </div>
                                            <p className="text-sm text-gray-700 mb-1 capitalize"> {address.street_address} , {address.area} </p>
                                            <p className="text-sm text-gray-600 capitalize"> {address.city} </p>
                                        </div>)
                                    })} */}


                                    {getAddressData?.length === 0 || !getAddressData ? (
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-4">
                                                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-base font-bold text-gray-900 mb-1">No Saved Addresses</h3>
                                            <p className="text-xs text-gray-500 mb-5 max-w-[200px]">
                                                Add an address to make checkout faster and easier.
                                            </p>
                                            <Link
                                                href="/address"
                                                className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-5 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-xs"
                                            >
                                                Add Address
                                            </Link>
                                        </div>
                                    ) : (
                                        getAddressData?.map((address: any) => (
                                            <div
                                                key={address.id}
                                                className={`rounded-lg p-4 mb-4 ${address.is_default
                                                    ? 'border-2 border-purple-500 bg-purple-50'
                                                    : 'border border-gray-200 bg-white'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-bold text-gray-900 capitalize">{address.address_type}</span>
                                                    {address.is_default && (
                                                        <span className="bg-linear-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-700 mb-1 capitalize">{address.street_address}, {address.area}</p>
                                                <p className="text-sm text-gray-600 capitalize">{address.city}</p>
                                            </div>
                                        ))
                                    )}
                                    <Link
                                        href={`/address`}
                                        className="w-full mt-4 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                                    >
                                        <span>View All Addresses</span>
                                        <svg
                                            className="w-5 h-5"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 12H5m14 0-4 4m4-4-4-4"
                                            />
                                        </svg>
                                    </Link>
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

                {isEditProfileOpen && (
                    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                                <h2 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Edit Profile
                                </h2>
                                <button
                                    onClick={() => setIsEditProfileOpen(false)}
                                    className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <form onSubmit={(e) => {
                                e.preventDefault()
                                editProfileMutate({ full_name: fullName, phone: phone })
                                setIsEditProfileOpen(false)
                            }} className="p-6 space-y-4">
                                <div className="flex flex-col items-center mb-6">
                                    <div className="relative mb-4">
                                        <Image src={avatarUrl} alt="avatar" width={100} height={100} unoptimized className="rounded-full" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={sessionData?.user.email as string}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50"
                                            placeholder="Enter your email"
                                            disabled
                                        />
                                        <p className="mt-1.5 text-xs text-gray-500">Email cannot be changed</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            placeholder="+20 123 456 7890"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        onClick={() => setIsEditProfileOpen(false)}
                                        className="flex-1 px-6 cursor-pointer py-3 bg-gray-50 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 px-6 cursor-pointer py-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
