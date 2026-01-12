'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'

export default function AboutUsModal() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 px-3 py-1.5 rounded-full hover:bg-gray-100 transition"
            >
                Tentang Kami
            </button>

            {isOpen && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 bg-gray-100 rounded-full p-2 transition"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="text-center mb-6">
                            <span className="text-4xl mb-2 block">🗺️</span>
                            <h2 className="text-2xl font-bold text-gray-900">Portal UMKM Indonesia</h2>
                        </div>

                        <div className="prose prose-sm text-gray-600 mb-6 text-center">
                            <p>
                                Website ini bertujuan sebagai database UMKM di Indonesia yang berguna untuk masyarakat yang ingin mengetahui UMKM apa saja yang ada di sekitar daerahnya atau daerah lainnya, lengkap dengan informasi produk atau jasa yang ditawarkan.
                            </p>
                        </div>

                        <div className="border-t border-gray-100 pt-6 text-center">
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-2">Dibuat Oleh</p>
                            <p className="text-lg font-bold text-indigo-700">Ricky Maulana</p>
                            <p className="text-sm text-gray-500">© 2026</p>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}
