import { getAllUsers } from '@/actions/admin-actions'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminUserList from '@/components/admin/AdminUserList'
import { logout } from '@/actions/auth-actions'

export default async function AdminDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        redirect('/dashboard')
    }

    const users = await getAllUsers()

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                    <div className="flex gap-4">
                        <a href="/" className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition">Ke Website</a>
                        <form action={logout}>
                            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Logout</button>
                        </form>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <AdminUserList users={users} />
                </div>
            </div>
        </main>
    )
}
