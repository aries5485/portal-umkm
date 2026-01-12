'use client'

import { Profile } from '@/types'
import { useActionState, useState } from 'react'
import { updateProfile } from '@/actions/dashboard-actions'
import LocationPicker from '@/components/map/LocationPicker'

export default function ProfileEditor({ profile }: { profile: Profile }) {
    const [isEditing, setIsEditing] = useState(false)
    const [state, formAction, isPending] = useActionState(updateProfile, { success: false, message: '', error: '' })

    // Location State
    const [lat, setLat] = useState(profile.latitude || null)
    const [lng, setLng] = useState(profile.longitude || null)

    const handleLocationChange = (newLat: number, newLng: number) => {
        setLat(newLat)
        setLng(newLng)
    }

    if (!isEditing) {
        return (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-100">
                {/* Header Image Display */}
                <div className="h-48 bg-gray-200 relative">
                    {profile.header_url ? (
                        <img src={profile.header_url} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                            No Header Image
                        </div>
                    )}
                    <button
                        onClick={() => setIsEditing(true)}
                        className="absolute bottom-4 right-4 bg-white/90 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:bg-white transition"
                    >
                        ✏️ Edit Profil
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{profile.nama_umkm}</h1>
                            <p className="text-gray-500">{profile.kategori || 'Uncategorized'}</p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Pemilik</p>
                            <p className="text-gray-900 font-medium">{profile.nama_pemilik || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">WhatsApp</p>
                            <p className="text-gray-900 font-medium">{profile.no_wa || '-'}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Deskripsi</p>
                            <p className="text-gray-900 mt-1">{profile.deskripsi || '-'}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Edit Profil UMKM</h2>

            {state.success && (
                <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-lg border border-green-200">
                    {state.message}
                </div>
            )}
            {state.error && (
                <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg border border-red-200">
                    {state.error}
                </div>
            )}

            <form action={formAction} className="space-y-4">
                <input type="hidden" name="existing_header_url" value={profile.header_url || ''} />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama UMKM</label>
                    <input type="text" name="nama_umkm" defaultValue={profile.nama_umkm} className="w-full px-4 py-2 border rounded-lg text-gray-900 bg-white" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pemilik</label>
                        <input type="text" name="nama_pemilik" defaultValue={profile.nama_pemilik || ''} className="w-full px-4 py-2 border rounded-lg text-gray-900 bg-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">No WhatsApp</label>
                        <input type="text" name="no_wa" defaultValue={profile.no_wa || ''} className="w-full px-4 py-2 border rounded-lg text-gray-900 bg-white" placeholder="08..." />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select name="kategori" defaultValue={profile.kategori || 'Lainnya'} className="w-full px-4 py-2 border rounded-lg text-gray-900 bg-white">
                        <option value="Makanan">Makanan</option>
                        <option value="Kerajinan">Kerajinan</option>
                        <option value="Jasa">Jasa</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Lainnya">Lainnya</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                    <textarea name="deskripsi" defaultValue={profile.deskripsi || ''} rows={4} className="w-full px-4 py-2 border rounded-lg text-gray-900 bg-white" />
                </div>

                <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi Usaha (Geser Pin untuk Menentukan)</label>
                    <LocationPicker
                        initialLat={profile.latitude}
                        initialLng={profile.longitude}
                        onLocationChange={handleLocationChange}
                    />
                    <input type="hidden" name="latitude" value={lat || ''} />
                    <input type="hidden" name="longitude" value={lng || ''} />
                    <p className="text-xs text-gray-500 mt-2">
                        Koordinat: {lat ? lat.toFixed(6) : '-'}, {lng ? lng.toFixed(6) : '-'}
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Foto Header (Opsional)</label>
                    <input type="file" name="header_file" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                </div>

                <div className="flex gap-4 pt-4 border-t">
                    <button type="submit" disabled={isPending} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50">
                        {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                    <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        Batal
                    </button>
                </div>
            </form>
        </div>
    )
}
