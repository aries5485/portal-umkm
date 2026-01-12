-- Add role and status columns to profiles table
alter table public.profiles
add column if not exists role text default 'user',
add column if not exists status text default 'active';

-- Add check constraints
alter table public.profiles
add constraint profiles_role_check check (role in ('user', 'admin')),
add constraint profiles_status_check check (status in ('active', 'suspended'));

-- Update RLS policies to allow Admins to read/write all
create policy "Admins can update all profiles"
on public.profiles
for update
to authenticated
using (
  auth.uid() in (
    select id from public.profiles where role = 'admin'
  )
);

create policy "Admins can delete all profiles"
on public.profiles
for delete
to authenticated
using (
  auth.uid() in (
    select id from public.profiles where role = 'admin'
  )
);
