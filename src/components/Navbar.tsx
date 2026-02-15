"use client"
import logo from "@/public/breadfast-circle.png"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { getCart } from "../app/apis-actions/cart/cart"
import { getWishlish } from "../app/apis-actions/wishlist/wishlist"


export default function Navbar() {
    const [toggle, isToggle] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const { data: session, status } = useSession()
    const { data: cartData } = useQuery({
        queryKey: ["getCart", session?.user?.id],
        queryFn: () => getCart(session!.user!.id),
        enabled: !!session,
    })

    const { data: wishlistData } = useQuery({
        queryKey: ['getWishlist', session?.user.id],
        queryFn: () => getWishlish(session!.user!.id),
        enabled: !!session,
    })

    const cartCount =
        cartData?.reduce((sum: number, item: any) => sum + item.quantity, 0) ?? 0


    const wishlistCount = wishlistData?.length ?? 0



    const islogged = !!session

    console.log(islogged)

    if (status === "loading") return null;


    function handleToggle() {
        isToggle(!toggle)
    }


    const navLinks = [
        { id: 1, name: "Home", href: "/" },
        { id: 2, name: "Products", href: "/all_products" },
        { id: 3, name: "Brands", href: "/brand" },
        { id: 4, name: "Orders", href: "/orders" },]

    const notRegistered = [
        { id: 1, name: "Login", href: "/login" },
        { id: 2, name: "Register", href: "/register" }
    ]
    return (
        <>
            <nav className="bg-neutral-primary shadow-xs shadow-[#8B3A8F]/20 w-full z-20 top-0 right-0">
                <div className="max-w-7xl flex flex-wrap items-center justify-around mx-auto p-4">
                    <Image
                        src={logo}
                        alt="Breadfast Logo"
                        width={120}
                        height={120}
                    />
                    <button
                        onClick={handleToggle}
                        data-collapse-toggle="navbar-default"
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary"
                        aria-controls="navbar-default"
                        aria-expanded="false"
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg
                            className="w-6 h-6"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeWidth={2}
                                d="M5 7h14M5 12h14M5 17h14"
                            />
                        </svg>
                    </button>
                    <div className={`${toggle ? "" : "hidden"} w-full md:block md:w-auto`} id="navbar-default">
                        <ul className="font-medium flex flex-col gap-4 p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:gap-8 md:mt-0 md:border-0 md:bg-neutral-primary">
                            {
                                islogged ? navLinks.map((link) => (<li key={link.id}>
                                    <Link
                                        href={link.href}
                                        className="block py-2 px-3 text-black bg-brand rounded md:bg-transparent md:text-fg-brand md:p-0"
                                        aria-current="page"
                                    >
                                        {link.name}
                                    </Link>
                                </li>)) : notRegistered.map((link) => (<li key={link.id}>
                                    <Link
                                        href={link.href}
                                        className="block py-2 px-3 text-black bg-brand rounded md:bg-transparent md:text-fg-brand md:p-0"
                                        aria-current="page"
                                    >
                                        {link.name}
                                    </Link>
                                </li>))
                            }
                            <li className="relative">
                                <Link href="/cart" className="block py-2 px-3 md:p-0">
                                    <i className="fa-solid fa-cart-shopping text-fg-brand text-2xl" />
                                    {cartCount > 0 ? (
                                        <span className="absolute -top-2 -right-2 bg-[#8B3A8F] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    ) : <span className="absolute -top-2 -right-2 bg-[#8B3A8F] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        0
                                    </span>}
                                </Link>
                            </li>
                            <li className="relative">
                                <Link href="/wishlist" className="block py-2 px-3 md:p-0">
                                    <i className="fa-regular fa-heart text-fg-brand text-2xl" />
                                    {wishlistCount > 0 ? (
                                        <span className="absolute -top-2 -right-2 bg-[#8B3A8F] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                            {wishlistCount}
                                        </span>
                                    ) : (<span className="absolute -top-2 -right-2 bg-[#8B3A8F] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        0
                                    </span>)}
                                </Link>
                            </li>
                            <li className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="block py-2 px-3 md:p-0 cursor-pointer"
                                >
                                    < i className="fa-solid fa-user text-[#8B3A8F] text-2xl" />
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span className="font-medium">My Profile</span>
                                        </Link>

                                        <Link
                                            href="/address"
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M11.906 1.994a8.002 8.002 0 0 1 8.09 8.421 7.996 7.996 0 0 1-1.297 3.957.996.996 0 0 1-.133.204l-.108.129c-.178.243-.37.477-.573.699l-5.112 6.224a1 1 0 0 1-1.545 0L5.982 15.26l-.002-.002a18.146 18.146 0 0 1-.309-.38l-.133-.163a.999.999 0 0 1-.13-.202 7.995 7.995 0 0 1 6.498-12.518ZM15 9.997a3 3 0 1 1-5.999 0 3 3 0 0 1 5.999 0Z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span className="font-medium">My Addresses</span>
                                        </Link>

                                        {/* <Link
                                            href="/orders"
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.617 2.076a1 1 0 0 1 1.09.217L8 3.586l1.293-1.293a1 1 0 0 1 1.414 0L12 3.586l1.293-1.293a1 1 0 0 1 1.414 0L16 3.586l1.293-1.293A1 1 0 0 1 19 3v18a1 1 0 0 1-1.707.707L16 20.414l-1.293 1.293a1 1 0 0 1-1.414 0L12 20.414l-1.293 1.293a1 1 0 0 1-1.414 0L8 20.414l-1.293 1.293A1 1 0 0 1 5 21V3a1 1 0 0 1 .617-.924ZM9 7a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H9Zm0 4a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Zm0 4a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span className="font-medium">My Orders</span>
                                        </Link> */}

                                        <div className="border-t border-gray-100 my-2"></div>

                                        <button
                                            onClick={() => {
                                                setIsProfileOpen(false)
                                                // Add your logout logic here
                                            }}
                                            className="w-full flex cursor-pointer items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                />
                                            </svg>
                                            <span className="font-medium">Logout</span>
                                        </button>
                                    </div>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}
