'use client'

import dynamic from 'next/dynamic'

const LocationPickerClient = dynamic(
    () => import('./LocationPickerClient'),
    {
        ssr: false,
        loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-400">Loading Map...</div>
    }
)

export default LocationPickerClient
