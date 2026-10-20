-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).

-- Replaces the old single-table schema (one row per invite, with an
-- anonymous `party_size`/`attending_count`) with two related tables: a
-- `parties` row is the invite itself (keyed by `token`), and each party has
-- any number of named `guests`, each with their own attending status and
-- allergy tags.
drop table if exists guests;

create table if not exists parties (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  note text,
  responded_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  party_id uuid not null references parties(id) on delete cascade,
  name text not null,
  attending boolean,
  allergy_tags text[] not null default '{}',
  allergy_note text,
  created_at timestamptz not null default now()
);

create index if not exists guests_party_id_idx on guests(party_id);

-- Locks both tables to the service role key only (no anon/public access).
-- The app never talks to Supabase from the browser, so this is intentional.
alter table parties enable row level security;
alter table guests enable row level security;

-- Add parties (and their guests) from the /admin page rather than here — it
-- generates each party's short, easy-to-remember invite code for you. Their
-- link is: https://your-site.example.com/rsvp/<token>
