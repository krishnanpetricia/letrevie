insert into site_settings (key, value)
values
  ('piatti_last_updated', extract(epoch from now())::bigint::text),
  ('vini_last_updated',   extract(epoch from now())::bigint::text)
on conflict (key) do nothing;
