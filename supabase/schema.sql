begin;

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;
create policy "Read own administrator status" on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));

create function public.is_admin() returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create table public.plants (
  id text primary key check (id ~ '^[a-z0-9][a-z0-9-]{0,99}$'),
  category text not null check (category in ('prebonsais', 'bonsais')),
  "commonName" text not null check (length(trim("commonName")) between 1 and 200),
  "scientificName" text not null check (length(trim("scientificName")) between 1 and 200),
  image text,
  description text,
  age text,
  "cultivationTime" text,
  origin text,
  location text,
  substrate text,
  "futureDesign" text
);

create table public.journal_entries (
  id text primary key check (id ~ '^[a-z0-9][a-z0-9-]{0,99}$'),
  "plantId" text not null references public.plants(id) on delete restrict,
  date date not null,
  title text not null check (length(trim(title)) between 1 and 200),
  description text not null check (length(trim(description)) between 1 and 20000),
  "isMock" boolean not null default false,
  observation text,
  "nextStep" text,
  photos jsonb not null default '[]'::jsonb check (jsonb_typeof(photos) = 'array')
);
create index journal_entries_plant_date on public.journal_entries ("plantId", date desc);

alter table public.plants enable row level security;
alter table public.journal_entries enable row level security;
revoke all on public.plants, public.journal_entries from anon, authenticated;
grant select on public.plants, public.journal_entries to anon, authenticated;
grant insert, update, delete on public.plants, public.journal_entries to authenticated;

create policy "Public plant reading" on public.plants
  for select to anon, authenticated using (true);
create policy "Owner plant creation" on public.plants
  for insert to authenticated with check ((select public.is_admin()));
create policy "Owner plant editing" on public.plants
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Owner plant deletion" on public.plants
  for delete to authenticated using ((select public.is_admin()));

create policy "Public journal reading" on public.journal_entries
  for select to anon, authenticated using (true);
create policy "Owner journal creation" on public.journal_entries
  for insert to authenticated with check ((select public.is_admin()));
create policy "Owner journal editing" on public.journal_entries
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Owner journal deletion" on public.journal_entries
  for delete to authenticated using ((select public.is_admin()));

create function public.import_initial_content(plant_data jsonb, entry_data jsonb)
returns void language plpgsql security invoker set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Solo el propietario puede importar contenido.' using errcode = '42501';
  end if;
  lock table public.plants, public.journal_entries in share row exclusive mode;
  if exists (select 1 from public.plants) or exists (select 1 from public.journal_entries) then
    raise exception 'La importacion requiere las dos tablas vacias.';
  end if;
  insert into public.plants
    select * from jsonb_populate_recordset(null::public.plants, plant_data);
  insert into public.journal_entries
    (id, "plantId", date, title, description, "isMock", observation, "nextStep", photos)
    select id, "plantId", date, title, description, coalesce("isMock", false),
      observation, "nextStep", coalesce(photos, '[]'::jsonb)
    from jsonb_populate_recordset(null::public.journal_entries, entry_data);
end;
$$;
revoke all on function public.import_initial_content(jsonb, jsonb) from public;
grant execute on function public.import_initial_content(jsonb, jsonb) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('plant-photos', 'plant-photos', true, 10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

create policy "Public plant photos" on storage.objects
  for select to anon, authenticated using (bucket_id = 'plant-photos');
create policy "Owner photo uploads" on storage.objects
  for insert to authenticated with check (bucket_id = 'plant-photos' and (select public.is_admin()));
create policy "Owner photo editing" on storage.objects
  for update to authenticated using (bucket_id = 'plant-photos' and (select public.is_admin()))
  with check (bucket_id = 'plant-photos' and (select public.is_admin()));
create policy "Owner photo deletion" on storage.objects
  for delete to authenticated using (bucket_id = 'plant-photos' and (select public.is_admin()));

commit;