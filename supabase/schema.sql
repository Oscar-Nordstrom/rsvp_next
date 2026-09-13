-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).

create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  name text not null,
  attending boolean,
  note text,
  party_size integer not null default 1
    check (party_size >= 1),
  attending_count integer not null default 0
    check (attending_count >= 0 and attending_count <= party_size),
  responded_at timestamptz,
  created_at timestamptz not null default now()
);

-- Locks the table to the service role key only (no anon/public access).
-- The app never talks to Supabase from the browser, so this is intentional.
alter table guests enable row level security;

-- Add guests from the /admin page rather than here — it generates each
-- guest's short, easy-to-remember invite code for you. Their link is:
-- https://your-site.example.com/rsvp/<token>

-- If you already created this table with a `uuid` token column (the old
-- setup), run this migration instead of the create table above. Existing
-- guests keep their current (already-shared) token unchanged — only guests
-- you add afterwards get a short code:
--
-- alter table guests
--   alter column token type text,
--   alter column token drop default;

-- If your table already exists but doesn't have the party-size columns yet
-- (added so an invite can cover a couple/family: `party_size` is how many
-- people the invite is for, set by you; `attending_count` is how many of
-- those the guest says are actually coming), run this migration:
--
-- alter table guests
--   add column if not exists party_size integer not null default 1,
--   add column if not exists attending_count integer not null default 0;
--
-- alter table guests
--   add constraint guests_party_size_check
--     check (party_size >= 1),
--   add constraint guests_attending_count_check
--     check (attending_count >= 0 and attending_count <= party_size);
