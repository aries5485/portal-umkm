import AddProductForm from '@/components/products/AddProductForm'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function AddProductPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="container mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard UMKM</h1>
                    <p className="text-gray-600">Kelola produk jualanmu di sini</p>
                    <a href="/" className="text-indigo-600 hover:underline mt-2 inline-block">Kembali ke Beranda</a>
                </div>

                <AddProductForm />
            </div>
        </main>
    )
}
