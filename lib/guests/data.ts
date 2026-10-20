import "server-only";
import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Party } from "@/types";

// Cached per-request: the Supabase client isn't the built-in fetch(), so
// Next won't dedupe repeat reads on its own. Without this, the party row
// can be read more than once in a single request and — if it changes
// mid-request (e.g. right as a guest submits) — the two reads disagree,
// producing a hydration mismatch on values derived from `attending`.
export const getPartyByToken = cache(async (token: string) => {
  const supabase = createSupabaseServerClient();
  const { data: party } = await supabase
    .from("parties")
    .select(
      "id, token, note, responded_at, guests(id, name, attending, allergy_tags, allergy_note)",
    )
    .eq("token", token)
    .single();

  return party as Party | null;
});
