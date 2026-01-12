-- Create profiles table
create table public.profiles (
  id uuid references auth.users not null primary key,
  nama_umkm text not null,
  deskripsi text,
  kategori text check (kategori in ('Makanan', 'Kerajinan', 'Jasa', 'Fashion', 'Lainnya')),
  latitude float8,
  longitude float8,
  tipe_akun text default 'free' check (tipe_akun in ('free', 'premium')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create policies for profiles
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create products table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  umkm_id uuid references public.profiles(id) on delete cascade not null,
  nama_produk text not null,
  harga numeric not null check (harga >= 0),
  foto_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for products
alter table public.products enable row level security;

-- Create policies for products
create policy "Products are viewable by everyone."
  on products for select
  using ( true );

create policy "UMKM can insert their own products."
  on products for insert
  with check ( auth.uid() = umkm_id );

create policy "UMKM can update their own products."
  on products for update
  using ( auth.uid() = umkm_id );

create policy "UMKM can delete their own products."
  on products for delete
  using ( auth.uid() = umkm_id );
