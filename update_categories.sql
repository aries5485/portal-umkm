-- Drop the existing check constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_kategori_check;

-- Update existing rows that don't match the new categories to 'Lainnya'
UPDATE profiles 
SET kategori = 'Lainnya' 
WHERE kategori NOT IN (
    'Kuliner (Makanan & Minuman)',
    'Fashion & Tekstil',
    'Pertanian & Peternakan',
    'Perikanan & Kelautan',
    'Jasa & Kecantikan',
    'Kerajinan & Industri Kreatif',
    'Perdagangan & Retail',
    'Teknologi & Digital',
    'Otomotif & Bengkel',
    'Kesehatan & Farmasi',
    'Lainnya'
);

-- Add the new check constraint with updated categories
ALTER TABLE profiles ADD CONSTRAINT profiles_kategori_check CHECK (
    kategori IN (
        'Kuliner (Makanan & Minuman)',
        'Fashion & Tekstil',
        'Pertanian & Peternakan',
        'Perikanan & Kelautan',
        'Jasa & Kecantikan',
        'Kerajinan & Industri Kreatif',
        'Perdagangan & Retail',
        'Teknologi & Digital',
        'Otomotif & Bengkel',
        'Kesehatan & Farmasi',
        'Lainnya'
    )
);
