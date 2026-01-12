'use client'

import dynamic from 'next/dynamic'

const Map = dynamic(() => import('./MapClient'), {
    ssr: false,
    loading: () => <div className="h-screen w-full bg-gray-100 animate-pulse text-center content-center text-gray-400">Loading Map...</div>
})

export default Map
