-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).

create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  name text not null,
  attending boolean,
  note text,
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
