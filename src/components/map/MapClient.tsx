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
