create table if not exists site_settings (
  key   text primary key,
  value text not null
);

-- Seed the row so the frontend always finds something to read
insert into site_settings (key, value)
values ('menu_last_updated', extract(epoch from now())::bigint::text)
on conflict (key) do nothing;

-- RLS: anyone can read, only service role (used by API routes) can write
alter table site_settings enable row level security;

create policy "Public read site_settings"
  on site_settings
  for select
  using (true);
