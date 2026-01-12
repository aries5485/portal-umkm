-- Ganti YOUR_EMAIL_HERE dengan email yang ingin dijadikan admin
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'YOUR_EMAIL_HERE'
);
