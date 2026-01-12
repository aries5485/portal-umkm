'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error || !user) {
        return { error: error?.message || 'Login failed', success: false }
    }

    // Check Status Logic
    const { data: profile } = await supabase
        .from('profiles')
        .select('status, role')
        .eq('id', user.id)
        .single()

    if (profile?.status === 'suspended') {
        await supabase.auth.signOut()
        return { error: 'Akun Anda telah di-suspend karena melanggar ketentuan. Hubungi admin.', success: false }
    }

    revalidatePath('/', 'layout')

    if (profile?.role === 'admin') {
        redirect('/admin/dashboard')
    }

    redirect('/dashboard')
}

export async function signup(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const nama_umkm = formData.get('nama_umkm') as string

    if (!email || !password || !nama_umkm) {
        return { error: 'Semua field harus diisi.', success: false }
    }

    // 1. Sign Up with Metadata
    const { data: { user }, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                nama_umkm: nama_umkm,
            }
        }
    })

    if (authError) {
        return { error: authError.message, success: false }
    }

    // Profile creation is now handled by the Database Trigger 'on_auth_user_created'.
    // We don't need to manually insert into 'profiles'.

    revalidatePath('/', 'layout')
    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}
