import React from 'react'

export default function Loading() {
    return (
        // <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        //     <i className="fa-solid fa-circle-notch fa-spin text-6xl text-[#8B3A8F]" />
        // </div>
        <div className="fixed inset-0 bg-white z-50 bg-linear-to-br from-purple-50 via-pink-50 to-white flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-lg font-semibold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Loading...
                </p>
            </div>
        </div>
    )
}