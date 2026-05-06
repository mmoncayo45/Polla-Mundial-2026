-- ============================================================
-- POLLA MUNDIAL 2026 — Supabase Schema
-- Ejecuta este SQL en: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Tabla de apostadores
create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz default now()
);

-- 2. Tabla de pronósticos
create table if not exists predictions (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  match_id integer not null,
  home_goals integer,
  away_goals integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(player_id, match_id)
);

-- 3. Tabla de resultados oficiales (solo admin)
create table if not exists results (
  match_id integer primary key,
  home_goals integer,
  away_goals integer,
  updated_at timestamptz default now()
);

-- 4. Habilitar Row Level Security
alter table players enable row level security;
alter table predictions enable row level security;
alter table results enable row level security;

-- 5. Políticas: lectura pública para todos
create policy "Lectura pública players"
  on players for select using (true);

create policy "Lectura pública predictions"
  on predictions for select using (true);

create policy "Lectura pública results"
  on results for select using (true);

-- 6. Políticas: escritura libre (la validación admin se hace en el frontend)
create policy "Insert players"
  on players for insert with check (true);

create policy "Insert predictions"
  on predictions for insert with check (true);

create policy "Update predictions"
  on predictions for update using (true);

create policy "Upsert results"
  on results for all using (true) with check (true);

-- 7. Trigger para actualizar updated_at en predictions
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger predictions_updated_at
  before update on predictions
  for each row execute function update_updated_at();
