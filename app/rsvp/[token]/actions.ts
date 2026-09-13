"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseCountInput } from "@/lib/guests/party";
import { isRsvpLocked } from "@/lib/wedding";

export async function submitRsvp(formData: FormData) {
  if (isRsvpLocked()) {
    throw new Error("The RSVP deadline has passed");
  }

  const token = formData.get("token");
  const attending = formData.get("attending");
  const note = formData.get("note");
  const attendingCountInput = formData.get("attendingCount");

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
  const { data: guest } = await supabase
    .from("guests")
    .select("party_size")
    .eq("token", token)
    .single();

  if (!guest) {
    throw new Error("Could not find that invite");
  }

  // Clamp server-side too, in case the submitted value was tampered with —
  // the guest can never bring more people than their invite covers, and
  // must bring at least one if they're attending.
  const attendingCount =
    attending === "true"
      ? parseCountInput(attendingCountInput, { min: 1, max: guest.party_size })
      : 0;

  const { data, error } = await supabase
    .from("guests")
    .update({
      attending: attending === "true",
      note: typeof note === "string" && note.trim() ? note.trim() : null,
      attending_count: attendingCount,
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
