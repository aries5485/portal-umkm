'use client'

import { useActionState } from 'react'
import { login } from '@/actions/auth-actions'

export default function AdminLoginPage() {
    const [state, formAction, isPending] = useActionState(login, { success: false, error: '' })

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="text-center mb-8">
                    <span className="text-4xl">🔐</span>
                    <h1 className="text-2xl font-bold mt-4 text-gray-900">Admin Login</h1>
                    <p className="text-gray-500 text-sm mt-2">Masuk ke panel administrator</p>
                </div>

                {state.error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
                        {state.error}
                    </div>
                )}

                <form action={formAction} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900"
                            placeholder="admin@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        disabled={isPending}
                        className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-bold hover:bg-black transition disabled:opacity-50 mt-4"
                    >
                        {isPending ? 'Memproses...' : 'Login Administrator'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a href="/login" className="text-sm text-gray-500 hover:text-gray-900">
                        ← Kembali ke Login User
                    </a>
                </div>
            </div>
        </div>
    )
}
