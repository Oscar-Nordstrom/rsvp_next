"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function submitRsvp(formData: FormData) {
  const token = formData.get("token");
  const attending = formData.get("attending");
  const note = formData.get("note");

  if (typeof token !== "string" || !token) {
    throw new Error("Missing RSVP token");
  }
  if (attending !== "true" && attending !== "false") {
    throw new Error("Missing RSVP answer");
  }

  const supabase = createSupabaseServerClient();

  // The token itself is the guest's credential: only someone with this
  // exact link can update this row, so matching on it is both the lookup
  // and the authorization check.
  const { data, error } = await supabase
    .from("guests")
    .update({
      attending: attending === "true",
      note: typeof note === "string" && note.trim() ? note.trim() : null,
      responded_at: new Date().toISOString(),
    })
    .eq("token", token)
    .select("id")
    .single();

  if (error || !data) {
    throw new Error("Could not find that invite");
  }

  revalidatePath(`/rsvp/${token}`);
}
