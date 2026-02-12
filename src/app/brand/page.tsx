"use client"
import { useQuery } from "@tanstack/react-query"
import { getAllBrands } from "../apis-actions/brands/brands"
import Loading from "@/src/components/loading"

export default function page() {

  const { data: brandsData, isLoading: brandsIsLoading } = useQuery({
    queryKey: ['allBrands'],
    queryFn: getAllBrands
  })

  if (brandsIsLoading) {
    return <Loading></Loading>
  }
  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl py-2 font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Our Brands
          </h1>
          <p className="text-gray-600">Discover premium brands we carry</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {brandsData.map((brand: any) => (
            <div
              key={brand.id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-purple-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden bg-white aspect-square p-6 flex items-center justify-center">
                <img
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  src={brand.logo_url}
                  alt={brand.name}
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/5 group-hover:to-pink-600/5 transition-all duration-300"></div>
              </div>

              {/* Content Container */}
              <div className="p-4 border-t border-gray-100 bg-linear-to-br from-purple-50/30 to-pink-50/30">
                {/* Brand Name */}
                <h3 className="text-sm font-bold text-gray-900 text-center group-hover:text-purple-600 transition-colors truncate">
                  {brand.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
