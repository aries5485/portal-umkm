-- Add deskripsi column to products table
alter table public.products
add column if not exists deskripsi text;
