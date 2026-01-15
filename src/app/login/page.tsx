'use client'

import { useActionState } from 'react'
import { login } from '@/actions/auth-actions'

const initialState = {
    success: false,
    error: '',
}

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, initialState)

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login UMKM</h2>

                {state.error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200">
                        {state.error}
                        {state.error.includes('Email not confirmed') && (
                            <p className="mt-2 text-xs text-gray-600">
                                💡 <strong>Tips Dev:</strong> Jika Anda menggunakan email palsu, matikan fitur <em>"Enable email confirmations"</em> di Supabase Dashboard &gt; Authentication &gt; Providers &gt; Email.
                            </p>
                        )}
                    </div>
                )}

                <form action={formAction} className="space-y-4">
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
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900 bg-white"
                        />
                    </div>

                    <div className="flex items-center justify-end">
                        <a href="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                            Lupa password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {isPending ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Belum punya akun? <a href="/register" className="text-indigo-600 font-medium hover:underline">Daftar sekarang</a>
                </p>
            </div>
        </div>
    )
}
