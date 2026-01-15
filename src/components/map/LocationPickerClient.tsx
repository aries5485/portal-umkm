'use client'

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { useState, useMemo, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'

interface LocationPickerClientProps {
    initialLat?: number | null
    initialLng?: number | null
    onLocationChange: (lat: number, lng: number) => void
}

function DraggableMarker({ position, setPosition, onLocationChange }: any) {
    const markerRef = useRef<L.Marker>(null)
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                if (marker) {
                    const latLng = marker.getLatLng()
                    setPosition(latLng)
                    onLocationChange(latLng.lat, latLng.lng)
                }
            },
        }),
        [onLocationChange, setPosition],
    )

    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
        />
    )
}


// Helper component to control map from external events
function MapController({ center }: { center: { lat: number, lng: number } }) {
    const map = useMapEvents({})
    useMemo(() => {
        map.setView(center, map.getZoom())
    }, [center, map])
    return null
}

export default function LocationPickerClient({ initialLat, initialLng, onLocationChange }: LocationPickerClientProps) {
    // Default to Indonesia center if no location
    const defaultCenter = { lat: -2.5489, lng: 118.0149 }
    const startPos = (initialLat && initialLng) ? { lat: initialLat, lng: initialLng } : defaultCenter

    const [position, setPosition] = useState(startPos)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [isLocating, setIsLocating] = useState(false)

    const handleSearch = async (query: string) => {
        setSearchQuery(query)
        if (query.length < 3) {
            setSearchResults([])
            return
        }

        setIsSearching(true)
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=id`)
            const data = await response.json()
            setSearchResults(data)
        } catch (error) {
            console.error('Search error:', error)
        } finally {
            setIsSearching(false)
        }
    }

    const handleSelectResult = (result: any) => {
        const lat = parseFloat(result.lat)
        const lng = parseFloat(result.lon)
        const newPos = { lat, lng }

        setPosition(newPos)
        onLocationChange(lat, lng)
        setSearchResults([])
        setSearchQuery(result.display_name)
    }

    const handleMyLocation = () => {
        setIsLocating(true)
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords
                    const newPos = { lat: latitude, lng: longitude }
                    setPosition(newPos)
                    onLocationChange(latitude, longitude)
                    setIsLocating(false)
                },
                (err) => {
                    console.error('Geolocation error:', err)
                    alert('Gagal mengambil lokasi. Pastikan GPS aktif dan izin diberikan.')
                    setIsLocating(false)
                }
            )
        } else {
            alert('Browser tidak mendukung geolocation.')
            setIsLocating(false)
        }
    }

    return (
        <div className="space-y-4">
            {/* Search Bar & My Location */}
            <div className="flex gap-2 relative z-[1001]">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Cari alamat..."
                        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    {searchResults.length > 0 && (
                        <ul className="absolute w-full bg-white border rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-[1002]">
                            {searchResults.map((result) => (
                                <li
                                    key={result.place_id}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-900"
                                    onClick={() => handleSelectResult(result)}
                                >
                                    {result.display_name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <button
                    type="button"
                    onClick={handleMyLocation}
                    disabled={isLocating}
                    className="px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 flex items-center gap-2"
                    title="Gunakan Lokasi Saya"
                >
                    {isLocating ? '📍...' : '📍 Lokasi Saya'}
                </button>
            </div>

            <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-300 z-0 relative">
                <MapContainer center={startPos} zoom={13} scrollWheelZoom={true} className="h-full w-full">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapController center={position} />
                    <DraggableMarker
                        position={position}
                        setPosition={setPosition}
                        onLocationChange={onLocationChange}
                    />
                </MapContainer>
                <div className="absolute top-2 right-2 bg-white/90 p-2 text-xs rounded shadow z-[1000] text-gray-600">
                    Geser pin ke lokasi usaha Anda
                </div>
            </div>
        </div>
    )
}
