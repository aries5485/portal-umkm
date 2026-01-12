'use client'

import { Product } from '@/types'
import { useState, useMemo } from 'react'

export default function PublicProductList({ initialProducts }: { initialProducts: Product[] }) {
    const [products] = useState<Product[]>(initialProducts)
    const [sort, setSort] = useState<'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc'>('newest')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    const sortedProducts = useMemo(() => {
        const items = [...products]
        switch (sort) {
            case 'price_asc':
                return items.sort((a, b) => a.harga - b.harga)
            case 'price_desc':
                return items.sort((a, b) => b.harga - a.harga)
            case 'name_asc':
                return items.sort((a, b) => a.nama_produk.localeCompare(b.nama_produk))
            case 'name_desc':
                return items.sort((a, b) => b.nama_produk.localeCompare(a.nama_produk))
            case 'newest':
            default:
                // Assuming initialProducts is already sorted by newest from server
                return items
        }
    }, [products, sort])

    if (products.length === 0) {
        return <p className="text-gray-500 italic">Belum ada produk yang diupload.</p>
    }

    return (
        <div>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Urutkan:</label>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as any)}
                        className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 text-gray-800"
                    >
                        <option value="newest">Terbaru</option>
                        <option value="price_asc">Harga Terendah</option>
                        <option value="price_desc">Harga Tertinggi</option>
                        <option value="name_asc">Nama (A-Z)</option>
                        <option value="name_desc">Nama (Z-A)</option>
                    </select>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        title="Tampilan Grid"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        title="Tampilan List"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                </div>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedProducts.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => setSelectedProduct(product)}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group cursor-pointer"
                        >
                            <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden relative">
                                {product.foto_url ? (
                                    <img src={product.foto_url} alt={product.nama_produk} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                ) : (
                                    <span className="text-gray-400 text-4xl">🛍️</span>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-gray-900 mb-1 truncate">{product.nama_produk}</h3>
                                <p className="text-indigo-600 font-bold">
                                    Rp {new Intl.NumberFormat('id-ID').format(product.harga)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div className="space-y-4">
                    {sortedProducts.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => setSelectedProduct(product)}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex items-center p-3 gap-4 cursor-pointer"
                        >
                            <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                                {product.foto_url ? (
                                    <img src={product.foto_url} alt={product.nama_produk} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-gray-400 text-2xl">🛍️</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-lg">{product.nama_produk}</h3>
                            </div>
                            <div className="text-right">
                                <p className="text-indigo-600 font-bold text-lg">
                                    Rp {new Intl.NumberFormat('id-ID').format(product.harga)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden relative animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 bg-white/50 rounded-full p-1 z-10"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="h-64 bg-gray-100 flex items-center justify-center overflow-hidden">
                            {selectedProduct.foto_url ? (
                                <img src={selectedProduct.foto_url} alt={selectedProduct.nama_produk} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-gray-400 text-6xl">🛍️</span>
                            )}
                        </div>

                        <div className="p-6">
                            <div className="mb-4">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProduct.nama_produk}</h2>
                                <p className="text-2xl font-bold text-indigo-600">
                                    Rp {new Intl.NumberFormat('id-ID').format(selectedProduct.harga)}
                                </p>
                            </div>

                            <div className="prose prose-sm text-gray-600 max-h-60 overflow-y-auto">
                                {selectedProduct.deskripsi ? (
                                    <p className="whitespace-pre-line">{selectedProduct.deskripsi}</p>
                                ) : (
                                    <p className="italic text-gray-400">Tidak ada deskripsi produk.</p>
                                )}
                            </div>

                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
