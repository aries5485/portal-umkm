'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Profile } from '@/types'

function LocationMarker() {
    const map = useMap()

    useEffect(() => {
        map.locate().on("locationfound", function (e) {
            map.flyTo(e.latlng, 12, {
                animate: true,
                duration: 1.5
            })
        })
    }, [map])

    return null
}

function LocateButton() {
    const map = useMap()
    const [locating, setLocating] = useState(false)

    const handleLocate = () => {
        setLocating(true)
        map.locate().on("locationfound", function (e) {
            map.flyTo(e.latlng, 14, {
                animate: true,
                duration: 1.5
            })
            setLocating(false)
        }).on("locationerror", function () {
            setLocating(false)
            alert("Tidak dapat menemukan lokasi Anda. Pastikan GPS aktif.")
        })
    }

    return (
        <button
            onClick={handleLocate}
            disabled={locating}
            className="absolute bottom-6 right-4 z-[1000] bg-white hover:bg-gray-50 text-gray-700 w-11 h-11 rounded-full shadow-lg border border-gray-200 flex items-center justify-center transition-all hover:shadow-xl active:scale-95 disabled:opacity-60"
            title="Lokasi Saya"
        >
            {locating ? (
                <svg className="w-5 h-5 animate-spin text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v4" />
                    <path d="M12 18v4" />
                    <path d="M2 12h4" />
                    <path d="M18 12h4" />
                </svg>
            )}
        </button>
    )
}

const MapClient = () => {
    const [profiles, setProfiles] = useState<Profile[]>([])
    const supabase = createClient()

    useEffect(() => {
        const fetchProfiles = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .neq('status', 'suspended')

            if (error) {
                console.error('Error fetching profiles:', error)
            } else {
                setProfiles(data || [])
            }
        }

        fetchProfiles()
    }, [])

    return (
        <div className="absolute inset-0 z-0">
            <MapContainer
                center={[-2.5489, 118.0149]}
                zoom={5}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
                <LocateButton />
                {profiles.map((profile) => (
                    profile.latitude && profile.longitude && (
                        <Marker
                            key={profile.id}
                            position={[profile.latitude, profile.longitude]}
                        >
                            <Popup>
                                <div className="p-0 max-w-[200px] overflow-hidden">
                                    {profile.header_url && (
                                        <div className="w-full h-24 mb-2 overflow-hidden rounded-t-lg">
                                            <img
                                                src={profile.header_url}
                                                alt={profile.nama_umkm}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="px-2 pb-2">

                                        <h3 className="font-bold text-lg mb-1 leading-tight">{profile.nama_umkm}</h3>
                                        <p className="text-xs text-indigo-600 font-semibold mb-1 uppercase tracking-wider">{profile.kategori}</p>

                                        {/* Truncated Description (2 lines) */}
                                        {profile.deskripsi && (
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-snug">
                                                {profile.deskripsi}
                                            </p>
                                        )}

                                        <a
                                            href={`/umkm/${profile.id}`}
                                            className="block w-full text-center bg-blue-600 hover:bg-blue-700 !text-white font-bold text-sm py-2 px-4 rounded-lg transition shadow-sm hover:shadow-md"
                                            style={{ color: 'white' }}
                                        >
                                            Lihat Detail
                                        </a>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>
        </div>
    )
}

export default MapClient
