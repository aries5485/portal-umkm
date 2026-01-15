'use client'

import { useState } from 'react'
import AboutUsModal from '@/components/AboutUsModal'
import { User } from '@supabase/supabase-js'
import { logout } from '@/actions/auth-actions'

export default function Navbar({ user }: { user: User | null }) {
    const [isOpen, setIsOpen] = useState(false)
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

    return (
        <>
            <header className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-[95%] max-w-4xl">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg px-6 py-3 border border-white/50">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <h1 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
                            <span>🗺️</span> Portal UMKM
                        </h1>

                        {/* Desktop Menu */}
                        <nav className="hidden md:flex gap-4 items-center">
                            {user ? (
                                <>
                                    <span className="text-sm font-medium text-gray-600">Halo, {user.email?.split('@')[0]}</span>
                                    <AboutUsModal />
                                    <a href="/dashboard" className="text-sm font-medium bg-indigo-600 text-white px-4 py-1.5 rounded-full hover:bg-indigo-700 hover:shadow-md transition">Dashboard</a>
                                    <button
                                        onClick={() => setShowLogoutConfirm(true)}
                                        className="text-red-500 hover:text-red-700 text-sm font-medium transition"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <AboutUsModal />
                                    <a href="/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600 px-3 py-1.5 rounded-full hover:bg-gray-100 transition">Login</a>
                                    <a href="/register" className="text-sm font-medium bg-indigo-600 text-white px-4 py-1.5 rounded-full hover:bg-indigo-700 hover:shadow-md transition">Daftar UMKM</a>
                                </>
                            )}
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    {isOpen && (
                        <div className="md:hidden mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3 pb-2">
                            {user ? (
                                <>
                                    <span className="text-sm font-medium text-gray-500 px-2">👤 {user.email}</span>
                                    <div className="px-2"><AboutUsModal /></div>
                                    <a href="/dashboard" className="text-center text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm transition">Dashboard</a>
                                    <button
                                        onClick={() => {
                                            setIsOpen(false)
                                            setShowLogoutConfirm(true)
                                        }}
                                        className="w-full text-center text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="px-2"><AboutUsModal /></div>
                                    <a href="/login" className="text-sm font-medium text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition">Login</a>
                                    <a href="/register" className="text-center text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm transition">Daftar UMKM</a>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </header>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🚪</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Konfirmasi Logout</h3>
                            <p className="text-gray-500 mb-6">Apakah Anda yakin ingin keluar dari akun ini?</p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                                >
                                    Batal
                                </button>
                                <form action={logout} className="flex-1">
                                    <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition">
                                        Ya, Keluar
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
