'use client'

import { useActionState } from 'react'
import { addProduct } from '@/actions/product-actions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const initialState = {
    success: false,
    error: '',
}

export default function AddProductForm() {
    const [state, formAction, isPending] = useActionState(addProduct, initialState)
    const [successMsg, setSuccessMsg] = useState('')
    const router = useRouter()

    // Helper to handle client-side success message if needed, though state update handles it.
    if (state.success && !successMsg) {
        setSuccessMsg('Produk berhasil ditambahkan!')
        // Reset form or redirect if needed
    }

    return (
        <form action={formAction} className="space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-100 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Tambah Produk Baru</h2>

            {state.error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                    ⚠️ {state.error}
                </div>
            )}

            {successMsg && (
                <div className="bg-green-50 text-green-600 p-4 rounded-lg border border-green-200">
                    ✅ {successMsg}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                <input
                    type="text"
                    name="nama_produk"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900 bg-white"
                    placeholder="Contoh: Kripik Singkong Balado"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                <input
                    type="number"
                    name="harga"
                    required
                    min="0"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900 bg-white"
                    placeholder="50000"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Produk</label>
                <textarea
                    name="deskripsi"
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900 bg-white"
                    placeholder="Jelaskan detail produk Anda..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Produk</label>
                <input
                    type="file"
                    name="foto_produk"
                    accept="image/*"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <p className="text-xs text-gray-500 mt-1">Upload foto dari perangkat Anda (Maks 2MB).</p>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? 'Menyimpan...' : 'Simpan Produk'}
            </button>
        </form>
    )
}
