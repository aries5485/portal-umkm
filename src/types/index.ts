export interface Profile {
    id: string
    nama_umkm: string
    deskripsi: string | null
    nama_pemilik: string | null
    no_wa: string | null
    header_url: string | null
    kategori: 'Kuliner (Makanan & Minuman)' | 'Fashion & Tekstil' | 'Pertanian & Peternakan' | 'Perikanan & Kelautan' | 'Jasa & Kecantikan' | 'Kerajinan & Industri Kreatif' | 'Perdagangan & Retail' | 'Teknologi & Digital' | 'Otomotif & Bengkel' | 'Kesehatan & Farmasi' | 'Lainnya' | null
    latitude: number | null
    longitude: number | null
    tipe_akun: 'free' | 'premium'
    role?: 'user' | 'admin'
    status?: 'active' | 'suspended'
}

export interface Product {
    id: string
    umkm_id: string
    nama_produk: string
    harga: number
    foto_url: string | null
    deskripsi: string | null
}
