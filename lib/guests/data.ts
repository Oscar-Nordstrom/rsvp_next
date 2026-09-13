import "server-only";
import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Cached per-request: the Supabase client isn't the built-in fetch(), so
// Next won't dedupe repeat reads on its own. Without this, the guest row
// can be read more than once in a single request and — if it changes
// mid-request (e.g. right as the guest submits) — the two reads disagree,
// producing a hydration mismatch on values derived from `attending`.
export const getGuestByToken = cache(async (token: string) => {
  const supabase = createSupabaseServerClient();
  const { data: guest } = await supabase
    .from("guests")
    .select("name, attending, note, party_size, attending_count")
    .eq("token", token)
    .single();

  return guest;
});
