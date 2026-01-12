-- Add new columns to profiles table
alter table public.profiles 
add column if not exists nama_pemilik text,
add column if not exists no_wa text,
add column if not exists header_url text;

-- Create Storage Bucket 'umkm-public' if it doesn't exist
-- Note: Buckets are usually created via dashboard or API, but we can try inserting if storage schema is accessible.
-- For safety, we will assume user creates bucket or we provide instructions. 
-- But we CAN set policies.

-- Policy for Storage: Allow authenticated uploads to 'umkm-public'
create policy "Authenticated users can upload images"
on storage.objects for insert
with check ( bucket_id = 'umkm-public' and auth.role() = 'authenticated' );

-- Policy for Storage: Public read access
create policy "Public can view images"
on storage.objects for select
using ( bucket_id = 'umkm-public' );

-- Policy: Owner can delete their own files (assumes file path contains user id as folder or similar strategy, or general delete for now)
create policy "Users can delete own images"
on storage.objects for delete
using ( bucket_id = 'umkm-public' and auth.uid() = owner );
