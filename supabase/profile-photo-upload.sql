-- Vekio profile photo/logo upload support
-- Safe to run once in Supabase SQL Editor.

insert into storage.buckets (id, name, public)
values ('tradie-profile-photos', 'tradie-profile-photos', true)
on conflict (id) do update set public = true;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'tradies'
      and policyname = 'Tradie can update own profile'
  ) then
    create policy "Tradie can update own profile"
      on public.tradies
      for update
      to authenticated
      using (auth_user_id = auth.uid())
      with check (auth_user_id = auth.uid());
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Tradie uploads own profile images'
  ) then
    create policy "Tradie uploads own profile images"
      on storage.objects
      for insert
      to authenticated
      with check (
        bucket_id = 'tradie-profile-photos'
        and (storage.foldername(name))[1] = 'profiles'
        and (storage.foldername(name))[2] = auth.uid()::text
      );
  end if;
end $$;
