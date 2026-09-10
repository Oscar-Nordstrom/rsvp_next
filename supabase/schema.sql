-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).

create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  token uuid not null default gen_random_uuid() unique,
  name text not null,
  attending boolean,
  note text,
  responded_at timestamptz,
  created_at timestamptz not null default now()
);

-- Locks the table to the service role key only (no anon/public access).
-- The app never talks to Supabase from the browser, so this is intentional.
alter table guests enable row level security;

-- Add each guest here, one row per invite (or per household).
insert into guests (name) values
  ('Jane Doe'),
  ('John Smith');

-- After inserting, run this to get each guest's personal RSVP link:
-- select name, token from guests;
-- Their link is: https://your-site.example.com/rsvp/<token>
