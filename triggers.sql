-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nama_umkm, tipe_akun, kategori)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nama_umkm', 'UMKM Baru'), -- Fallback name
    'free',
    'Lainnya'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
