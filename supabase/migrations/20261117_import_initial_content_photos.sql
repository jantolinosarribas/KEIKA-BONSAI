create or replace function public.import_initial_content(plant_data jsonb, entry_data jsonb)
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
    (id, category, "commonName", "scientificName", image, photos, description,
      age, "cultivationTime", origin, location, substrate, "futureDesign")
    select plant.id, plant.category, plant."commonName", plant."scientificName",
      plant.image,
      coalesce(plant.photos, case when plant.image is null then '[]'::jsonb
        else jsonb_build_array(jsonb_build_object('src', plant.image, 'alt', plant."commonName", 'date', null)) end),
      plant.description, plant.age, plant."cultivationTime", plant.origin,
      plant.location, plant.substrate, plant."futureDesign"
    from jsonb_populate_recordset(null::public.plants, plant_data) as plant;
  insert into public.journal_entries
    (id, "plantId", date, title, description, "isMock", observation, "nextStep", photos)
    select id, "plantId", date, title, description, coalesce("isMock", false),
      observation, "nextStep", coalesce(photos, '[]'::jsonb)
    from jsonb_populate_recordset(null::public.journal_entries, entry_data);
end;
$$;