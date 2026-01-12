'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Profile, Product } from '@/types'
import PublicProductList from '@/components/products/PublicProductList'

const UMKMPage = () => {
    const { id } = useParams()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return

            try {
                setLoading(true)

                // Fetch Profile
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (profileError) throw profileError
                setProfile(profileData)

                // Fetch Products
                const { data: productsData, error: productsError } = await supabase
                    .from('products')
                    .select('*')
                    .eq('umkm_id', id)

                if (productsError) throw productsError
                setProducts(productsData || [])

            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id])

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading UMKM...</div>
    }

    if (!profile) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">UMKM tidak ditemukan</div>
    }

    if (profile.status === 'suspended') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <span className="text-6xl mb-4">⚠️</span>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Akun Ditangguhkan</h1>
                <p className="text-gray-600 max-w-md">
                    Halaman UMKM ini sedang ditangguhkan karena melanggar ketentuan layanan.
                </p>
                <a href="/" className="mt-8 text-indigo-600 hover:text-indigo-800 font-medium">
                    &larr; Kembali ke Peta
                </a>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            {/* Header / Hero */}
            {/* Header / Hero */}
            <div className="bg-indigo-700 text-white py-12 px-4 shadow-md">
                <div className="container mx-auto max-w-4xl">
                    <a href="/" className="inline-block mb-6 text-indigo-200 hover:text-white transition">
                        &larr; Kembali ke Peta
                    </a>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1">
                            <span className="inline-block px-3 py-1 bg-indigo-600 rounded-full text-xs font-semibold tracking-wide uppercase mb-2">
                                {profile.kategori || 'UMKM'}
                            </span>
                            <h1 className="text-3xl md:text-5xl font-bold mb-2">{profile.nama_umkm}</h1>
                            <p className="text-lg text-indigo-100 max-w-xl">{profile.deskripsi || 'Tidak ada deskripsi.'}</p>
                        </div>

                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            {profile.latitude && profile.longitude && (
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${profile.latitude},${profile.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-indigo-900 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition text-center justify-center"
                                >
                                    <span>🗺️</span>
                                    Arahkan Jalan
                                </a>
                            )}

                            {/* WhatsApp Button */}
                            {profile.no_wa ? (
                                <a
                                    href={`https://wa.me/${profile.no_wa.replace(/^0/, '62').replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-400 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition text-center justify-center"
                                >
                                    <span>💬</span>
                                    WhatsApp
                                </a>
                            ) : (
                                <button
                                    disabled
                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-800 text-indigo-400 rounded-xl font-bold text-lg cursor-not-allowed justify-center border border-indigo-600"
                                    title="Nomor WhatsApp belum tersedia"
                                >
                                    <span>💬</span>
                                    WhatsApp
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto max-w-4xl px-4 mt-8">

                {/* Products Section */}
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Produk Unggulan</h2>

                <PublicProductList initialProducts={products} />
            </div>
        </main >
    )
}

export default UMKMPage
