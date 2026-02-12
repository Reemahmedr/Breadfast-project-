"use client"
import logo from "@/public/breadfast-circle.png"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { getCart } from "../app/apis-actions/cart/cart"
import { getWishlish } from "../app/apis-actions/wishlist/wishlist"
import Address_Show from "./Address_Show"


export default function Navbar() {
    const [toggle, isToggle] = useState(false)
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
                            <li>
                                <Link href={`/address`}>
                                    <Address_Show></Address_Show>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav >

        </>
    )
}
