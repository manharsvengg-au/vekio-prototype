-- Vekio trust documents + project gallery storage
-- Safe to run after profile-photo-upload.sql.

alter table public.tradies add column if not exists trade_licence_path text;
alter table public.tradies add column if not exists insurance_path text;
alter table public.tradies add column if not exists project_photo_urls text[] default '{}'::text[];

insert into storage.buckets (id,name,public) values ('tradie-documents','tradie-documents',false) on conflict (id) do update set public=false;
insert into storage.buckets (id,name,public) values ('tradie-project-photos','tradie-project-photos',true) on conflict (id) do update set public=true;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='Tradie uploads own documents') then
    create policy "Tradie uploads own documents" on storage.objects for insert to authenticated
    with check (bucket_id='tradie-documents' and (storage.foldername(name))[2]=auth.uid()::text);
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='Tradie uploads own project photos') then
    create policy "Tradie uploads own project photos" on storage.objects for insert to authenticated
    with check (bucket_id='tradie-project-photos' and (storage.foldername(name))[1]='projects' and (storage.foldername(name))[2]=auth.uid()::text);
  end if;
end $$;
