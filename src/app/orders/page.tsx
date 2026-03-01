"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { cancelOrder, getOrders } from "../apis-actions/orders/orders"
import Loading from "@/src/components/loading"
import Link from "next/link"
import Image from "next/image"
import no_orders from "@/public/no_orders.jpg.jpeg"
import { useState } from "react"
import { addToCart } from "../apis-actions/cart/cart"
import toast from "react-hot-toast"
import { getInvoice } from "../apis-actions/orders/[orderId]/invoice/invoice"

export default function page() {

  const statusMap: any = {
    confirmed: {
      label: "Confirmed",
    },
    shipped: {
      label: "Shipped",
    },
    out_for_delivery: {
      label: "Out for delivery",
    },
    delivered: {
      label: "Delivered",
    },
    cancelled: {
      label: "Cancelled",
    }
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

  const [filterStatus, setFilterStatus] = useState<string>("all")



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


  const filteredOrders =
    filterStatus === "all"
      ? sortedOrders
      : sortedOrders.filter(
        (order: any) => order.order_status === filterStatus
      )

  const { mutate: cartMutate } = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      toast.success("Item added to cart")
      queryClient.invalidateQueries({ queryKey: ["getCart", user_id] })
    }
  })

  const { mutate: cancelMutate } = useMutation({
    mutationFn: () => cancelOrder(filteredOrders[0].id, orderData[0].order_status),
    onSuccess: () => {
      toast.success("Order canceled");
      queryClient.invalidateQueries({ queryKey: ["getOrders"] });
    },
  })



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
              <button onClick={() => setFilterStatus("all")} className={`px-6 py-2 cursor-pointer rounded-xl font-semibold ${filterStatus === "all"
                ? "bg-linear-to-r from-purple-600 to-pink-600 text-white"
                : "bg-white text-gray-700 border border-gray-200"
                }`}>
                All Orders
              </button>
              <button onClick={() => setFilterStatus("confirmed")} className={`px-6 py-2 cursor-pointer rounded-xl font-semibold ${filterStatus === "confirmed"
                ? "bg-linear-to-r from-purple-600 to-pink-600 text-white"
                : "bg-white text-gray-700 border border-gray-200"
                }`}>
                Processing
              </button>
              <button onClick={() => setFilterStatus("shipped")} className={`px-6 py-2 cursor-pointer rounded-xl font-semibold ${filterStatus === "shipped"
                ? "bg-linear-to-r from-purple-600 to-pink-600 text-white"
                : "bg-white text-gray-700 border border-gray-200"
                }`}>
                Shipped
              </button>
              <button onClick={() => setFilterStatus("out_for_delivery")} className={`px-6 py-2 cursor-pointer rounded-xl font-semibold ${filterStatus === "out_for_delivery"
                ? "bg-linear-to-r from-purple-600 to-pink-600 text-white"
                : "bg-white text-gray-700 border border-gray-200"
                }`}>
                Out For Delivery
              </button>
              <button onClick={() => setFilterStatus("delivered")} className={`px-6 py-2 cursor-pointer rounded-xl font-semibold ${filterStatus === "delivered"
                ? "bg-linear-to-r from-purple-600 to-pink-600 text-white"
                : "bg-white text-gray-700 border border-gray-200"
                }`}>
                Delivered
              </button>
              <button onClick={() => setFilterStatus("cancelled")} className={`px-6 py-2 cursor-pointer rounded-xl font-semibold ${filterStatus === "cancelled"
                ? "bg-linear-to-r from-purple-600 to-pink-600 text-white"
                : "bg-white text-gray-700 border border-gray-200"
                }`}>
                Cancelled
              </button>
            </div>

            {/* Orders List */}
            <div className="space-y-6">
              {/* Order 1 - Delivered */}
              {filteredOrders?.map((item: any) => (
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
                      <span className="text-sm text-purple-600 font-semibold">
                        {item.order_status === "delivered"
                          ? `Delivered at ${new Date(item.delivered_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                          : `Arriving at ${new Date(item.estimated_delivery_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
                      </span>
                    </div>
                    <div className="relative">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-linear-to-r from-purple-600 to-pink-600 rounded-full" style={{ width: `${progressMap[item.order_status as keyof typeof progressMap]}%` }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Order Actions */}
                  {item.order_items?.map((orderItem: any) => (<div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                    <button onClick={() => cartMutate({
                      user_id,
                      product_id: orderItem.products.id,
                      quantity: orderItem.quantity,
                    })}
                      className="px-6 py-2 bg-white cursor-pointer text-purple-600 font-semibold rounded-xl border-2 border-purple-200 hover:bg-purple-50 transition-all duration-200">
                      Buy Again
                    </button>
                    <button onClick={async () => {
                      try {
                        const blob = await getInvoice({ params: { orderId: item.id } });

                        const url = URL.createObjectURL(blob);

                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `invoice-${item.order_number}.pdf`;
                        link.click();

                        URL.revokeObjectURL(url);
                        toast.success("Invoice downloaded")

                      } catch (error) {
                        console.error(error);
                        toast.error("Failed to download invoice");
                      }
                    }}
                      className="px-6 py-2 cursor-pointer bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200">
                      Download Invoice
                    </button>
                    {item.order_status === "confirmed" &&
                      <button onClick={() => {
                        console.log(item.id)
                        return cancelMutate()
                      }}
                        className="px-6 py-2 cursor-pointer bg-white text-red-500 font-semibold rounded-xl border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200">
                        Cancel Order
                      </button>}
                  </div>))}
                </div>))}
            </div>

            {filteredOrders.length === 0 && filterStatus !== "all" && orderData.length > 0 && (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-3xl p-12 shadow-lg text-center w-full max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-md">
                    {filterStatus === "confirmed" && (
                      <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    )}
                    {filterStatus === "shipped" && (
                      <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    )}
                    {filterStatus === "out_for_delivery" && (
                      <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                    )}
                    {filterStatus === "delivered" && (
                      <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8 5-8-5V5l8 5 8-5v2zm0 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7" />
                      </svg>
                    )}
                    {filterStatus === "cancelled" && (
                      <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                    {filterStatus === "confirmed" && "No Processing Orders"}
                    {filterStatus === "shipped" && "No Shipped Orders"}
                    {filterStatus === "out_for_delivery" && "No Orders Out for Delivery"}
                    {filterStatus === "delivered" && "No Delivered Orders"}
                    {filterStatus === "cancelled" && "No Cancelled Orders"}
                  </h2>
                  <p className="text-gray-500 text-base">
                    {filterStatus === "confirmed" && "You have no orders currently being processed."}
                    {filterStatus === "shipped" && "None of your orders have been shipped yet."}
                    {filterStatus === "out_for_delivery" && "No orders are out for delivery right now."}
                    {filterStatus === "delivered" && "You don't have any delivered orders yet."}
                    {filterStatus === "cancelled" && "You don't have any cancelled orders."}
                  </p>

                  <div className="mt-8">
                    <div className="h-2 bg-white rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-linear-to-r from-purple-600 to-pink-600 rounded-full w-0" />
                    </div>
                  </div>

                  <button onClick={() => setFilterStatus("all")} className="mt-6 px-8 py-3 cursor-pointer bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                    View All Orders
                  </button>
                </div>
              </div>
            )}
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
          </div>
        </section>
      </div>
    </div>
  )
}
