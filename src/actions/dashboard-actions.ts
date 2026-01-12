'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized', success: false, message: '' }

    const nama_umkm = formData.get('nama_umkm') as string
    const nama_pemilik = formData.get('nama_pemilik') as string
    const no_wa = formData.get('no_wa') as string
    const deskripsi = formData.get('deskripsi') as string
    const kategori = formData.get('kategori') as string
    const latitude = formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : null
    const longitude = formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : null
    const headerFile = formData.get('header_file') as File

    let header_url = formData.get('existing_header_url') as string

    // Handle Header Upload
    if (headerFile && headerFile.size > 0) {
        const fileExt = headerFile.name.split('.').pop()
        const fileName = `headers/${user.id}-${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from('umkm-public')
            .upload(fileName, headerFile)

        if (uploadError) {
            console.error(uploadError)
            return { error: 'Gagal upload foto header', success: false, message: '' }
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('umkm-public')
            .getPublicUrl(fileName)

        header_url = publicUrl
    }

    const { error } = await supabase
        .from('profiles')
        .update({
            nama_umkm,
            nama_pemilik,
            no_wa,
            deskripsi,
            kategori,
            header_url,
            latitude,
            longitude
        })
        .eq('id', user.id)

    if (error) {
        return { error: 'Gagal update profil', success: false, message: '' }
    }

    revalidatePath('/dashboard')
    revalidatePath(`/umkm/${user.id}`)
    return { success: true, message: 'Profil berhasil diperbarui', error: '' }
}

export async function deleteProduct(productId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized', success: false }

    // Check ownership
    const { data: product } = await supabase
        .from('products')
        .select('umkm_id')
        .eq('id', productId)
        .single()

    if (product?.umkm_id !== user.id) {
        return { error: 'Unauthorized', success: false }
    }

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

    if (error) {
        return { error: 'Gagal menghapus produk', success: false }
    }

    revalidatePath('/dashboard')
    revalidatePath(`/umkm/${user.id}`)
    return { success: true }
}
