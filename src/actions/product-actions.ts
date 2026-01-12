'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addProduct(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // 1. Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { error: 'Unauthorized', success: false }
    }

    const nama_produk = formData.get('nama_produk') as string
    const harga = parseFloat(formData.get('harga') as string)
    const deskripsi = formData.get('deskripsi') as string
    const photoFile = formData.get('foto_produk') as File

    let foto_url = null

    // Upload Photo if exists
    if (photoFile && photoFile.size > 0) {
        const fileExt = photoFile.name.split('.').pop()
        const fileName = `product-${user.id}-${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
            .from('umkm-public')
            .upload(fileName, photoFile, { upsert: true })

        if (uploadError) {
            console.error(uploadError)
            return { error: 'Gagal upload foto produk', success: false }
        }

        const { data: { publicUrl } } = supabase.storage
            .from('umkm-public')
            .getPublicUrl(fileName)

        foto_url = publicUrl
    }

    // 2. Fetch Profile to check account type
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('tipe_akun')
        .eq('id', user.id)
        .single()

    if (profileError || !profile) {
        return { error: 'Gagal mengambil data profil UMKM.', success: false }
    }

    // 3. Count existing products
    const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('umkm_id', user.id)

    if (countError) {
        return { error: 'Gagal mengecek jumlah produk.', success: false }
    }

    // 4. Business Logic: Free Account has limit of 10 products
    const maxFreeProducts = 10
    if (profile.tipe_akun === 'free' && (count || 0) >= maxFreeProducts) {
        return {
            error: 'Upgrade ke Premium untuk upload lebih banyak produk!',
            success: false
        }
    }

    // 5. Insert Product
    const { error: insertError } = await supabase
        .from('products')
        .insert({
            umkm_id: user.id,
            nama_produk,
            harga,
            foto_url: foto_url || null,
            deskripsi,
        })

    if (insertError) {
        console.error('Insert error:', insertError)
        return { error: 'Gagal menyimpan produk.', success: false }
    }

    revalidatePath(`/umkm/${user.id}`)
    return { success: true }
}

export async function updateProduct(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // 1. Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { error: 'Unauthorized', success: false }
    }

    const productId = formData.get('product_id') as string
    const nama_produk = formData.get('nama_produk') as string
    const harga = parseFloat(formData.get('harga') as string)
    const deskripsi = formData.get('deskripsi') as string
    const photoFile = formData.get('foto_produk') as File

    // Check ownership
    const { data: product } = await supabase
        .from('products')
        .select('umkm_id, foto_url')
        .eq('id', productId)
        .single()

    if (!product || product.umkm_id !== user.id) {
        return { error: 'Unauthorized', success: false }
    }

    let foto_url = product.foto_url

    // Upload New Photo if exists
    if (photoFile && photoFile.size > 0) {
        const fileExt = photoFile.name.split('.').pop()
        const fileName = `product-${user.id}-${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
            .from('umkm-public')
            .upload(fileName, photoFile, { upsert: true })

        if (uploadError) {
            console.error(uploadError)
            return { error: 'Gagal upload foto produk', success: false }
        }

        const { data: { publicUrl } } = supabase.storage
            .from('umkm-public')
            .getPublicUrl(fileName)

        foto_url = publicUrl
    }

    // Update Product
    const { error: updateError } = await supabase
        .from('products')
        .update({
            nama_produk,
            harga,
            deskripsi,
            foto_url
        })
        .eq('id', productId)

    if (updateError) {
        return { error: 'Gagal mengupdate produk', success: false }
    }

    revalidatePath('/dashboard')
    revalidatePath(`/umkm/${user.id}`)
    return { success: true }
}
