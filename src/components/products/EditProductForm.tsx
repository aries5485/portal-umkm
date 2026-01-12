'use client'

import { useActionState, useState } from 'react'
import { updateProduct } from '@/actions/product-actions'
import { Product } from '@/types'

export default function EditProductForm({ product, onClose }: { product: Product, onClose: () => void }) {
    const [state, formAction, isPending] = useActionState(updateProduct, { success: false, error: '' })

    // Auto-close on success
    if (state.success) {
        // Using timeout to allow state update to propagate if needed, or just close immediately
        setTimeout(() => {
            onClose()
        }, 500)
    }

    return (
        <form action={formAction} className="space-y-4">
            <input type="hidden" name="product_id" value={product.id} />

            {state.error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                    ⚠️ {state.error}
                </div>
            )}

            {state.success && (
                <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm border border-green-200">
                    ✅ Produk berhasil diupdate!
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                <input
                    type="text"
                    name="nama_produk"
                    defaultValue={product.nama_produk}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900 bg-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                <input
                    type="number"
                    name="harga"
                    defaultValue={product.harga}
                    required
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900 bg-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                    name="deskripsi"
                    rows={3}
                    defaultValue={product.deskripsi || ''}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900 bg-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ganti Foto (Opsional)</label>
                <input
                    type="file"
                    name="foto_produk"
                    accept="image/*"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gray-100 text-gray-700 font-bold py-2 rounded-lg hover:bg-gray-200 transition"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={isPending || state.success}
                    className="flex-1 bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                    {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>
        </form>
    )
}
