'use client'

import { useActionState } from 'react'
import { signup } from '@/actions/auth-actions'

const initialState = {
    success: false,
    error: '',
}

export default function RegisterPage() {
    const [state, formAction, isPending] = useActionState(signup, initialState)

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Daftar UMKM Baru</h2>

                {state.error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200">
                        {state.error}
                    </div>
                )}

                <form action={formAction} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama UMKM</label>
                        <input
                            type="text"
                            name="nama_umkm"
                            required
                            placeholder="Contoh: Kedai Kopi Senja"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900 bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900 bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            minLength={6}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900 bg-white"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {isPending ? 'Mendaftar...' : 'Daftar Sekarang'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Sudah punya akun? <a href="/login" className="text-indigo-600 font-medium hover:underline">Login di sini</a>
                </p>
            </div>
        </div>
    )
}
