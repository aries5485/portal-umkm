'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

async function checkAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    return profile?.role === 'admin'
}

export async function getAllUsers() {
    const isAdmin = await checkAdmin()
    if (!isAdmin) throw new Error('Unauthorized')

    const supabase = await createClient()
    const { data: users, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return users
}

export async function toggleSuspendUser(userId: string, currentStatus: string) {
    const isAdmin = await checkAdmin()
    if (!isAdmin) return { error: 'Unauthorized', success: false }

    const supabase = await createClient()
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active'

    const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userId)

    if (error) return { error: error.message, success: false }

    revalidatePath('/admin/dashboard')
    return { success: true }
}

export async function toggleProStatus(userId: string, currentType: string) {
    const isAdmin = await checkAdmin()
    if (!isAdmin) return { error: 'Unauthorized', success: false }

    const supabase = await createClient()
    const newType = currentType === 'free' ? 'premium' : 'free'

    const { error } = await supabase
        .from('profiles')
        .update({ tipe_akun: newType })
        .eq('id', userId)

    if (error) return { error: error.message, success: false }

    revalidatePath('/admin/dashboard')
    return { success: true }
}

export async function deleteUser(userId: string) {
    const isAdmin = await checkAdmin()
    if (!isAdmin) return { error: 'Unauthorized', success: false }

    const supabase = await createClient()

    // Delete profile (Trigger should handle auth user deletion if configured, 
    // but usually we can't delete from auth.users via client SDK directly without Service Role.
    // However, for this MVP we will just delete the profile which hides them from the app)
    // NOTE: In a real Supabase app, deleting auth user requires Service Role Key.
    // Here we will just delete the Profile.

    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

    if (error) return { error: error.message, success: false }

    revalidatePath('/admin/dashboard')
    return { success: true }
}
