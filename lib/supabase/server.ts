import "server-only";
import { createClient } from "@supabase/supabase-js";

// Uses the service role key, so this must never be imported from a Client
// Component. Guest identity is the per-guest `token`, not Supabase Auth, so
// RLS is left locked down (no policies) and only this server-side client
// (which bypasses RLS) can read or write the table.
export function createSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables"
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
