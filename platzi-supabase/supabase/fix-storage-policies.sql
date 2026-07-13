-- Arreglo de seguridad de Storage para el bucket `images`.
-- Problema: la política "Anyone can upload images" permitía que CUALQUIER
-- visitante anónimo subiera archivos al bucket (probado: upload anónimo -> 200).
-- Además faltaban políticas SELECT/UPDATE, necesarias para que el upsert de
-- avatares (app/profile/edit) pueda reemplazar un archivo existente.
--
-- Ejecuta este script en el SQL Editor de Supabase. Es idempotente.
-- (Ya está incorporado en supabase/setup.sql para despliegues nuevos.)

drop policy if exists "Anyone can upload images" on storage.objects;

drop policy if exists "Authenticated can upload images" on storage.objects;
create policy "Authenticated can upload images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'images');

drop policy if exists "Authenticated can read images" on storage.objects;
create policy "Authenticated can read images"
  on storage.objects for select to authenticated
  using (bucket_id = 'images');

drop policy if exists "Authenticated can update images" on storage.objects;
create policy "Authenticated can update images"
  on storage.objects for update to authenticated
  using (bucket_id = 'images')
  with check (bucket_id = 'images');

drop policy if exists "Authenticated can delete images" on storage.objects;
create policy "Authenticated can delete images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'images');
