"use client"

import { useQuery } from "@tanstack/react-query"
import Loading from "../components/loading"
import Image from "next/image"
import { getCategories } from "./apis-actions/categories/categories"
import Link from "next/link"

export default function Home() {

  const { data, isLoading } = useQuery({ queryKey: ["categories"], queryFn: getCategories })

  if (isLoading) {
    return <Loading></Loading>
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((prod: any) => (
            <Link href={`/products/${prod.id}`} className="block">
              <div
                key={prod.id}
                className="bg-neutral-primary-soft rounded-xl shadow-Xs shadow-[#8B3A8F]/20 h-full flex flex-col p-6 border border-default rounded-base shadow-xs hover:shadow-md transition-shadow"
              >
                <Image
                  width={100}
                  height={100}
                  className="rounded-base w-full h-48 object-cover"
                  src={prod.image_url}
                  alt={prod.name}
                />

                <h5 className="mt-6 mb-2 text-2xl font-semibold tracking-tight text-heading">
                  {prod.name}
                </h5>

                <p className="mb-6 text-body line-clamp-3 grow">
                  {prod.description}
                </p>

                <Link
                  href={`/products/${prod.id}`}
                  className=" w-1/2 group inline-flex items-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading  shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none transition-all duration-300"
                >
                  <span className="group-hover:translate-x-1 text-[#8B3A8F] transition-transform duration-300">
                    Show Items
                  </span>
                  <svg
                    className="w-4 h-4 text-[#8B3A8F] ms-1.5 rtl:rotate-180 -me-0.5 group-hover:translate-x-2 transition-transform duration-300"
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
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 12H5m14 0-4 4m4-4-4-4"
                    />
                  </svg>
                </Link>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}