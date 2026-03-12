import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import ProfileEditor from '@/components/dashboard/ProfileEditor'
import ProductManager from '@/components/dashboard/ProductManager'
import { logout } from '@/actions/auth-actions'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Redirect admin to admin dashboard
    const { data: roleCheck } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (roleCheck?.role === 'admin') {
        redirect('/admin/dashboard')
    }

    // Fetch Profile & Products
    let { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

    // Auto-create profile if it doesn't exist (e.g. admin created directly in Supabase)
    if (!profile) {
        const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
                id: user.id,
                nama_umkm: user.email?.split('@')[0] || 'UMKM Baru',
                tipe_akun: 'free',
                kategori: 'Lainnya',
            })
            .select('*')
            .single()

        if (insertError || !newProfile) {
            return <div>Error loading profile</div>
        }
        profile = newProfile
    }

    const { data: products } = await supabase.from('products').select('*').eq('umkm_id', user.id).order('created_at', { ascending: false })

    return (
        <main className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Top Bar */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    <div className="flex gap-4 items-center">
                        <a href="/" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">Lihat Peta</a>
                        <form action={logout}>
                            <button className="text-red-500 hover:text-red-700 text-sm font-medium">Logout</button>
                        </form>
                    </div>
                </div>

                {/* Profile Section */}
                <ProfileEditor profile={profile} email={user.email} />

                {/* Products Section */}
                <ProductManager products={products || []} />
            </div>
        </main>
    )
}
