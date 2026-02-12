"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { getOrders } from "../apis-actions/orders/orders"
import Loading from "@/src/components/loading"
import Link from "next/link"
import Image from "next/image"
import no_orders from "@/public/no_orders.jpg.jpeg"

export default function page() {

  const statusMap: any = {
    confirmed: {
      label: "Confirmed",
      icon: "check",
    },
    shipped: {
      label: "Shipped",
      class: "bg-blue-100 text-blue-700",
      icon: "truck",
    },
    out_for_delivery: {
      label: "Out for delivery",
      class: "bg-yellow-100 text-yellow-700",
      icon: "road",
    },
    delivered: {
      label: "Delivered",
      class: "bg-green-100 text-green-700",
      icon: "done",
    },
  }


  const progressMap = {
    confirmed: 25,
    shipped: 50,
    out_for_delivery: 75,
    delivered: 100,
  }


  const { data: sessionData } = useSession()
  const queryClient = useQueryClient()

  const user_id = sessionData?.user?.id as string

  const { data: orderData = [], isLoading } = useQuery({
    queryKey: ["getOrders", user_id],
    queryFn: () => getOrders(user_id),
    enabled: !!user_id
  })

  console.log("ORDERS:", orderData)
  const sortedOrders = [...orderData].sort(
    (a: any, b: any) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )



  if (isLoading) {
    return <Loading></Loading>
  }
  return (
    <div>

      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-white">
        <section className="py-8 antialiased md:py-16">
          <div className="mx-auto max-w-7xl px-4 2xl:px-0">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl py-1.5 font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent sm:text-4xl">
                My Orders
              </h1>
              <p className="mt-2 text-gray-600">
                Track and manage your orders
              </p>
            </div>

            {/* Filters */}
            <div className={`mb-6 flex flex-wrap gap-3 ${orderData.length === 0 ? "hidden" : ""}`}>
              <button className="px-6 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md transition-all duration-200">
                All Orders
              </button>
              <button className="px-6 py-2 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-200">
                Processing
              </button>
              <button className="px-6 py-2 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-200">
                Shipped
              </button>
              <button className="px-6 py-2 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-200">
                Delivered
              </button>
              <button className="px-6 py-2 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-200">
                Cancelled
              </button>
            </div>

            {/* Orders List */}
            <div className="space-y-6">
              {/* Order 1 - Delivered */}
              {sortedOrders?.map((item: any) => (
                <div key={item.id} className="bg-white rounded-2xl border border-purple-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200">
                    <div className="flex flex-wrap items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="text-lg font-bold text-gray-900">{item.order_number}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="text-base font-semibold text-gray-900">{new Date(item.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-base font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{item.total_amount} EGP</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {(() => {
                          const status = statusMap[item.order_status] || { label: "Unknown" }
                          const paymentStatusClass = item.payment_status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700";
                          const paymentStatusLabel = item.payment_status === "paid" ? "Paid" : "Pending";
                          return (
                            <span
                              className={`inline-flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-full ${status.class}`}
                            >
                              {status?.label}
                            </span>
                          )
                        })()}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  {item.order_items?.map((order: any) => (
                    <div className="py-4 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-2 shrink-0">
                          <div className="w-full h-full bg-gray-300 rounded-lg">
                            <Image src={order.product_image} alt="" width={100} height={100}></Image>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{order.products.name}</h3>
                          <p className="text-sm text-gray-600">Quantity :{order.quantity}</p>
                          <p className="text-base font-semibold text-gray-900">{order.total_price} EGP</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900">Tracking Progress</span>
                      <span className="text-sm text-purple-600 font-semibold">Expected: Feb 2, 2026</span>
                    </div>
                    <div className="relative">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-linear-to-r from-purple-600 to-pink-600 rounded-full" style={{ width: `${progressMap[item.order_status as keyof typeof progressMap]}%` }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                    <button className="px-6 py-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200">
                      View Details
                    </button>
                    <button className="px-6 py-2 bg-white text-purple-600 font-semibold rounded-xl border-2 border-purple-200 hover:bg-purple-50 transition-all duration-200">
                      Buy Again
                    </button>
                    <button className="px-6 py-2 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200">
                      Download Invoice
                    </button>
                  </div>
                </div>))}
            </div>
            {/* Empty State (Hidden when orders exist) */}
            {orderData.length === 0 && (
              <div >
                <div className="flex flex-col items-center justify-center py-16 px-4 min-h-[500px]">
                  <div className="relative w-full max-w-md mx-auto">
                    <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-3xl p-12 shadow-lg text-center">
                      <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-md">
                        {/* <svg
                          className="w-16 h-16 text-purple-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg> */}
                        <Image className="w-full h-full object-contain rounded-full" src={no_orders} alt="No Orders" width={100} height={100}></Image>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-8 max-w-md">
                    <h2 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                      No Orders Yet
                    </h2>
                    <p className="text-gray-600 mb-8 text-lg">
                      You haven't placed any orders yet. Start shopping to see your orders here!
                    </p>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
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
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      <span>Start Shopping</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Pagination */}
            {/* <div className="mt-8 flex items-center justify-center gap-2">
                <button className="px-4 py-2 bg-white text-gray-400 font-semibold rounded-lg border border-gray-200 cursor-not-allowed">
                  Previous
                </button>
                <button className="px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-md">
                  1
                </button>
                <button className="px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg border border-gray-200 hover:border-purple-300 transition-all">
                  2
                </button>
                <button className="px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg border border-gray-200 hover:border-purple-300 transition-all">
                  3
                </button>
                <button className="px-4 py-2 bg-white text-purple-600 font-semibold rounded-lg border border-gray-200 hover:border-purple-300 transition-all">
                  Next
                </button>
              </div> */}
          </div>
        </section>
      </div>
    </div>
  )
}
