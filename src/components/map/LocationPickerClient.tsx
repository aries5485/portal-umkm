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

export default function LocationPickerClient({ initialLat, initialLng, onLocationChange }: LocationPickerClientProps) {
    // Default to Indonesia center if no location
    const defaultCenter = { lat: -2.5489, lng: 118.0149 }
    const startPos = (initialLat && initialLng) ? { lat: initialLat, lng: initialLng } : defaultCenter

    const [position, setPosition] = useState(startPos)

    return (
        <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-300 z-0 relative">
            <MapContainer center={startPos} zoom={5} scrollWheelZoom={true} className="h-full w-full">
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
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
    )
}
