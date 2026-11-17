begin;

alter table public.plants
  add column if not exists photos jsonb not null default '[]'::jsonb;

update public.plants
set photos = jsonb_build_array(jsonb_build_object(
  'src', image,
  'alt', "commonName",
  'date', null
))
where image is not null
  and photos = '[]'::jsonb;

commit;