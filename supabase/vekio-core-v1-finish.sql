-- Vekio Core V1 final fields + private enquiry visibility for the owning tradie.

alter table public.tradies
  add column if not exists service_area text,
  add column if not exists about_business text;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'enquiries'
      and policyname = 'Tradie can read own enquiries'
  ) then
    create policy "Tradie can read own enquiries"
      on public.enquiries
      for select
      to authenticated
      using (
        exists (
          select 1
          from public.tradies t
          where t.id = enquiries.tradie_id
            and t.auth_user_id = auth.uid()
        )
      );
  end if;
end $$;
