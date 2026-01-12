'use client'

import { deleteProduct } from '@/actions/dashboard-actions'
import { useState } from 'react'
import EditProductForm from '../products/EditProductForm'
import { Product } from '@/types'

export default function ProductManager({ products }: { products: Product[] }) {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)

    const handleDelete = async (id: string) => {
        if (confirm('Yakin ingin menghapus produk ini?')) {
            await deleteProduct(id)
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Daftar Produk ({products.length})</h2>
                <a href="/dashboard/add-product" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition shadow-sm">
                    + Tambah Produk
                </a>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    Belum ada produk. Mulai tambahkan sekarang!
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition">
                            <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                {product.foto_url ? (
                                    <img src={product.foto_url} alt={product.nama_produk} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">📷</div>
                                )}

                                {/* Action Buttons Overlay */}
                                <div className="absolute top-2 right-2 flex flex-col gap-2">
                                    <button
                                        onClick={() => setEditingProduct(product)}
                                        className="bg-white/90 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition hover:bg-white hover:text-indigo-700"
                                        title="Edit Produk"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="bg-white/90 text-red-600 w-8 h-8 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition hover:bg-white hover:text-red-700"
                                        title="Hapus Produk"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                            <div className="p-3">
                                <h3 className="font-semibold text-gray-900 truncate">{product.nama_produk}</h3>
                                <p className="text-indigo-600 text-sm font-bold">
                                    Rp {new Intl.NumberFormat('id-ID').format(product.harga)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Edit Modal */}
            {editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setEditingProduct(null)}>
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Produk</h2>
                        <EditProductForm
                            product={editingProduct}
                            onClose={() => setEditingProduct(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
