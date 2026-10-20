"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isRsvpLocked } from "@/lib/wedding";
import { ALLERGY_TAGS, type AllergyTag } from "@/types";

function isAllergyTag(value: string): value is AllergyTag {
  return (ALLERGY_TAGS as readonly string[]).includes(value);
}

export async function submitRsvp(formData: FormData) {
  if (isRsvpLocked()) {
    throw new Error("The RSVP deadline has passed");
  }

  const token = formData.get("token");
  const note = formData.get("note");
  const transportRaw = formData.get("transport");
  const guestIds = formData.get("guestIds");

  if (typeof token !== "string" || !token) {
    throw new Error("Missing RSVP token");
  }
  if (typeof guestIds !== "string") {
    throw new Error("Missing guest list");
  }

  const supabase = createSupabaseServerClient();

  // The token itself is the guest's credential: only someone with this
  // exact link can update this party, so matching on it is both the
  // lookup and the authorization check. We also only ever touch guest ids
  // that actually belong to this party, so a crafted guestIds field can't
  // reach into another party's guests.
  const { data: party } = await supabase
    .from("parties")
    .select("id, guests(id)")
    .eq("token", token)
    .single();

  if (!party) {
    throw new Error("Could not find that invite");
  }

  const ownGuestIds = new Set(party.guests.map((g: { id: string }) => g.id));
  const submittedIds = guestIds.split(",").filter((id) => ownGuestIds.has(id));

  if (submittedIds.length === 0) {
    throw new Error("Missing RSVP answer");
  }

  const guestUpdates = submittedIds.map((id) => {
    const attendingRaw = formData.get(`attending__${id}`);
    if (attendingRaw !== "true" && attendingRaw !== "false") {
      throw new Error("Missing RSVP answer");
    }
    const attending = attendingRaw === "true";

    const tags = attending
      ? formData.getAll(`allergyTags__${id}`).filter((value): value is string => typeof value === "string" && isAllergyTag(value))
      : [];
    const otherNote = formData.get(`allergyOther__${id}`);

    return {
      id,
      attending,
      allergy_tags: tags,
      allergy_note:
        attending && typeof otherNote === "string" && otherNote.trim()
          ? otherNote.trim()
          : null,
    };
  });

  // Plain per-guest updates rather than upsert: these guest rows always
  // already exist (we only ever touch ids from `ownGuestIds` above), and
  // upsert's INSERT ... ON CONFLICT DO UPDATE still validates NOT NULL
  // constraints (like `party_id`) on the full candidate row before it even
  // checks for a conflict, which we don't want to have to carry here.
  const results = await Promise.all(
    guestUpdates.map(({ id, ...fields }) =>
      supabase.from("guests").update(fields).eq("id", id),
    ),
  );

  const guestsError = results.find((result) => result.error)?.error;
  if (guestsError) {
    throw new Error(guestsError.message);
  }

  const { error: partyError } = await supabase
    .from("parties")
    .update({
      note: typeof note === "string" && note.trim() ? note.trim() : null,
      transport:
        transportRaw === "true" ? true : transportRaw === "false" ? false : null,
      responded_at: new Date().toISOString(),
    })
    .eq("id", party.id);

  if (partyError) {
    throw new Error(partyError.message);
  }

  revalidatePath(`/rsvp/${token}`);
}
