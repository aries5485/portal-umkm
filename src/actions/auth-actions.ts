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

export async function requestPasswordReset(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' // Ensure this env var is set in production

    if (!email) {
        return { error: 'Email harus diisi', success: false }
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=/update-password`,
    })

    if (error) {
        console.error('Reset password error:', error)
        return { error: 'Gagal mengirim link reset password. Pastikan email benar.', success: false }
    }

    return { success: true, message: 'Link reset password telah dikirim ke email Anda.', error: '' }
}

export async function resetPassword(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!password || !confirmPassword) {
        return { error: 'Semua field harus diisi', success: false, message: '' }
    }

    if (password !== confirmPassword) {
        return { error: 'Password tidak cocok', success: false, message: '' }
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
        return { error: 'Gagal memperbarui password', success: false, message: '' }
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}

export async function changePassword(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const oldPassword = formData.get('oldPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!oldPassword || !newPassword || !confirmPassword) {
        return { error: 'Semua field harus diisi', success: false }
    }

    if (newPassword !== confirmPassword) {
        return { error: 'Password baru tidak cocok', success: false }
    }

    // 1. Verify Old Password by trying to sign in
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.email) return { error: 'Unauthorized', success: false }

    const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: oldPassword
    })

    if (signInError) {
        return { error: 'Password lama salah', success: false }
    }

    // 2. Update Password
    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
        return { error: 'Gagal memperbarui password', success: false }
    }

    return { success: true, message: 'Password berhasil diubah', error: '' }
}
