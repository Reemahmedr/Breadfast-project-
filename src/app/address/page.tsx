"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addAddress, Address, deleteAddress, getAddress, updateAddress, UpdateDefaultAddress } from "../apis-actions/address/address"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import Loading from "@/src/components/loading"


export default function page() {

    const { register, handleSubmit, reset, formState: { errors } } = useForm<Address>()
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingAddress, setEditingAddress] = useState<Address | null>(null)
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null)


    useEffect(() => {
        if (editingAddress) {
            reset(editingAddress)
        } else {
            reset({})
        }
    }, [editingAddress, reset])



    const queryClient = useQueryClient()

    const { data: getAddressData, isLoading: getAddressLoading } = useQuery({
        queryKey: ["getAddress"],
        queryFn: getAddress
    })

    const { mutate: addAddressMutate } = useMutation({
        mutationFn: (payload: Address) =>
            addAddress(payload),
        onSuccess: () => {
            toast.success("Your address added"),
                queryClient.invalidateQueries({ queryKey: ["getAddress"] })
        }
    })

    const { mutate: updateAddressMutate, isPending: updatePending } = useMutation({
        mutationFn: updateAddress,
        onSuccess: () => {
            toast.success("Address updated")
            queryClient.invalidateQueries({ queryKey: ["getAddress"] })
        },
    })

    const { mutate: updateAddressDefaultMutate } = useMutation({
        mutationFn: UpdateDefaultAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getAddress"] })
        }
    })

    const { mutate: deleteMutate, isPending: deletePending } = useMutation({
        mutationFn: deleteAddress,
        onSuccess: () => {
            toast.success("Address delete")
            queryClient.invalidateQueries({ queryKey: ["getAddress"] })
        }
    })


    const onSubmit = (data: Address) => {
        if (editingAddress && editingAddress.id) {
            updateAddressMutate({
                ...data,
                address_id: editingAddress.id,
            })
        } else {
            addAddressMutate(data)
        }

        setIsFormOpen(false)
        setEditingAddress(null)
    }

    function handleUpdate(address: Address) {
        setIsFormOpen(true)
        setEditingAddressId(getAddressData.id)
        setEditingAddress(address)
    }


    if (getAddressLoading || updatePending || deletePending) {
        return <Loading></Loading>
    }

    return (
        <div>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl py-2 font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Delivery Address
                    </h1>
                    <p className="text-gray-600">Choose where you'd like your order delivered</p>
                </div>

                {/* Add New Address Button */}
                <button
                    onClick={() => {
                        setEditingAddress(null)
                        setEditingAddressId(null)
                        setIsFormOpen(true)
                    }}
                    className="w-full cursor-pointer mb-6 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 border-0">
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
                            d="M5 12h14m-7 7V5"
                        />
                    </svg>
                    <span>Add New Address</span>
                </button>

                {/* Address Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Address Card 1 - Default */}
                    {getAddressData?.map((address: any) => (
                        <div key={address.id} className={`group bg-white rounded-2xl overflow-hidden border-2 ${address.is_default ? "border-purple-500" : ""} shadow-sm hover:shadow-xl transition-all duration-300 relative`}>
                            {/* Default Badge */}


                            <div onClick={() => {
                                if (!address.is_default) {
                                    updateAddressDefaultMutate({
                                        address_id: address.id!,
                                        is_default: true,
                                    })

                                }
                            }} >
                                {address.is_default ? <>
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className="inline-flex items-center gap-1 bg-linear-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                                            <svg
                                                className="w-3 h-3"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z" />
                                            </svg>
                                            Default
                                        </span>
                                    </div>
                                    <div className="absolute top-4 left-4 z-10">
                                        <div className="w-6 cursor-pointer h-6 rounded-full bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                                            <div className="w-3 h-3 bg-white rounded-full"></div>
                                        </div>
                                    </div></> : <div className="absolute top-4 left-4 z-10">
                                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-white hover:border-purple-500 transition-colors cursor-pointer"></div>
                                </div>}
                            </div>

                            <div className="p-6 pt-12">
                                {/* Address Type */}
                                <div className="flex items-center gap-2 mb-3">
                                    {address.address_type === "home" ? (<svg
                                        className="w-5 h-5 text-purple-600"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>) : address.address_type === "work" ?
                                        (<svg
                                            className="w-5 h-5 text-purple-600"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10H3V5z" />
                                            <path d="M1 17a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1v-1H1v1z" />
                                        </svg>) : address.address_type === "other" ? (<svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-5 h-5 text-purple-600"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"
                                                clipRule="evenodd"
                                            />
                                        </svg>) : null
                                    }
                                    <h3 className="text-xl capitalize font-bold text-gray-900"> {address.address_type} </h3>
                                </div>

                                {/* Address Details */}
                                <p className="text-gray-600 capitalize text-sm leading-relaxed">
                                    {address.street_address}  {address.apartment && `, AP number : ${address.apartment}`}
                                </p>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {address.floor && `Floor number : ${address.floor}`}
                                </p>
                                <p className="text-gray-600  capitalize text-sm leading-relaxed">
                                    {address.area}
                                </p>
                                <p className="text-gray-600 capitalize text-sm leading-relaxed mb-3">
                                    {address.city}
                                </p>

                                {/* Phone */}
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                    <svg
                                        className="w-4 h-4"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M7.978 4a2.553 2.553 0 0 0-1.926.877C4.233 6.7 3.699 8.751 4.153 10.814c.44 1.995 1.778 3.893 3.456 5.572 1.68 1.679 3.577 3.018 5.57 3.459 2.062.456 4.115-.073 5.94-1.885a2.556 2.556 0 0 0 .001-3.861l-1.21-1.21a2.689 2.689 0 0 0-3.802 0l-.617.618a.806.806 0 0 1-1.14 0l-1.854-1.855a.807.807 0 0 1 0-1.14l.618-.62a2.692 2.692 0 0 0 0-3.803l-1.21-1.211A2.555 2.555 0 0 0 7.978 4Z" />
                                    </svg>
                                    <span>{address.phone}</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleUpdate(address)}
                                        className="flex-1 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                                        <svg
                                            className="w-4 h-4"
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
                                                d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                                            />
                                        </svg>
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteMutate(address.id)}
                                        className="flex-1 cursor-pointer bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                                        <svg
                                            className="w-4 h-4"
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
                                                d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                                            />
                                        </svg>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Add Address Card - Empty State */}
                    <div onClick={() => {
                        setEditingAddress(null)
                        setEditingAddressId(null)
                        reset({})
                        setIsFormOpen(true)
                    }} className="group bg-white rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-purple-400 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
                        <div className="p-6 h-full flex flex-col items-center justify-center min-h-[300px] text-center">
                            <div className="w-16 h-16 rounded-full bg-linear-to-br from-purple-50 to-pink-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                                <svg
                                    className="w-8 h-8 text-purple-600"
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
                                        d="M5 12h14m-7 7V5"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Add New Address</h3>
                            <p className="text-sm text-gray-600">Click to add a new delivery address</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Address Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50  flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Form Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Add New Address
                            </h2>
                            <button
                                onClick={() => {
                                    setIsFormOpen(false)
                                    setEditingAddress(null)
                                    setEditingAddressId(null)
                                    reset({})
                                }}
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

                        {/* Form Body */}
                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Address Type Dropdown */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Address Type
                                    </label>
                                    <select
                                        {...register("address_type")}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white cursor-pointer"
                                    >
                                        <option value="home">Home</option>
                                        <option value="work">Work</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                {/* Street Address */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Street Address <i className="fa-solid fa-asterisk text-[.5rem] text-red-500 opacity-70" />

                                    </label>
                                    <input
                                        {...register("street_address")}
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                                        placeholder="Enter street address"
                                    />
                                    {errors.street_address && <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                                        <svg
                                            className="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        This field is required
                                    </p>}
                                </div>

                                {/* Area */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Area <i className="fa-solid fa-asterisk text-[.5rem] text-red-500 opacity-70" />
                                    </label>
                                    <input
                                        {...register("area")}
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        placeholder="Enter area"
                                    />
                                    {errors.area && <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                                        <svg
                                            className="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        This field is required
                                    </p>}
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        City <i className="fa-solid fa-asterisk text-[.5rem] text-red-500 opacity-70" />
                                    </label>
                                    <input
                                        {...register("city")}
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        placeholder="Enter city"
                                    />
                                    {errors.city && <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                                        <svg
                                            className="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        This field is required
                                    </p>}
                                </div>

                                {/* Phone */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Phone Number <i className="fa-solid fa-asterisk text-[.5rem] text-red-500 opacity-70" />
                                    </label>
                                    <input
                                        {...register("phone", {
                                            required: "Phone number is required",
                                            validate: (value) =>
                                                value.trim() !== "" || "Phone number is required",
                                        })}
                                        type="tel"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        placeholder="+20 123 456 7890"
                                    />
                                    {errors.phone && <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                                        <svg
                                            className="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        This field is required
                                    </p>}
                                </div>

                                {/* Building */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Building
                                    </label>
                                    <input
                                        {...register("building")}
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        placeholder="Building number"
                                    />
                                </div>

                                {/* Floor */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Floor
                                    </label>
                                    <input
                                        {...register("floor")}
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        placeholder="Floor number"
                                    />
                                </div>

                                {/* Apartment */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Apartment
                                    </label>
                                    <input
                                        {...register("apartment")}
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        placeholder="Apartment number"
                                    />
                                </div>

                                {/* Landmark */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Landmark
                                    </label>
                                    <input
                                        {...register("landmark")}
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        placeholder="Nearby landmark"
                                    />
                                </div>

                                {/* Is Default */}
                                <div className="md:col-span-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            {...register("is_default")}
                                            type="checkbox"
                                            className="w-5 h-5 cursor-pointer rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
                                        />
                                        <span className="text-sm font-semibold text-gray-700">
                                            Set as default address
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="flex-1 px-6 py-3 cursor-pointer border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 cursor-pointer bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                                >
                                    Save Address
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}