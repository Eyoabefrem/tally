-- Tally Phase 2. Run in Supabase: SQL Editor > New query > paste > Run.
-- Every table belongs to one user, and row-level security lets you touch only your own rows.

create table workouts (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  id text not null,
  data jsonb not null,
  finished_at timestamptz not null,
  primary key (user_id, id)
);
create table user_settings (
  user_id uuid primary key default auth.uid() references auth.users on delete cascade,
  data jsonb not null
);
create table routines (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  id text not null,
  name text not null check (char_length(name) between 1 and 60),
  exercises jsonb not null,
  created_at timestamptz not null default now(),
  primary key (user_id, id)
);
create table bodyweight (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  id text not null,
  day date not null,
  kg numeric(5,1) not null check (kg > 0 and kg < 700),
  primary key (user_id, id)
);

alter table workouts enable row level security;
alter table user_settings enable row level security;
alter table routines enable row level security;
alter table bodyweight enable row level security;
create policy "own rows" on workouts for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own rows" on user_settings for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own rows" on routines for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own rows" on bodyweight for all using (user_id = auth.uid()) with check (user_id = auth.uid());
