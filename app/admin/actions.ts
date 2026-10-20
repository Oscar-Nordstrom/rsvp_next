"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { destroyAdminSession, isAdmin } from "@/lib/admin/auth";
import { generateGuestToken } from "@/lib/guests/token";

async function requireAdmin() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }
}

export async function addParty(formData: FormData) {
  await requireAdmin();

  const names = formData
    .getAll("names")
    .filter((value): value is string => typeof value === "string")
    .map((name) => name.trim())
    .filter(Boolean);

  if (names.length === 0) {
    throw new Error("At least one guest name is required");
  }

  const supabase = createSupabaseServerClient();

  // Token collisions are exceedingly unlikely at 32^5 combinations for a
  // guest list this size, but retry a few times rather than fail outright.
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: party, error } = await supabase
      .from("parties")
      .insert({ token: generateGuestToken() })
      .select("id")
      .single();

    if (!error && party) {
      const { error: guestsError } = await supabase.from("guests").insert(
        names.map((name) => ({ party_id: party.id, name })),
      );

      if (guestsError) {
        throw new Error(guestsError.message);
      }

      revalidatePath("/admin");
      return;
    }

    if (error && error.code !== "23505") {
      throw new Error(error.message);
    }
  }

  throw new Error("Could not generate a unique invite code, please try again");
}

export async function updateGuestName(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  const name = formData.get("name");
  if (typeof id !== "string" || !id) {
    throw new Error("Missing guest id");
  }
  if (typeof name !== "string" || !name.trim()) {
    throw new Error("Name is required");
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("guests")
    .update({ name: name.trim() })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
}

export async function addGuestToParty(formData: FormData) {
  await requireAdmin();

  const partyId = formData.get("partyId");
  const name = formData.get("name");
  if (typeof partyId !== "string" || !partyId) {
    throw new Error("Missing party id");
  }
  if (typeof name !== "string" || !name.trim()) {
    throw new Error("Name is required");
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("guests")
    .insert({ party_id: partyId, name: name.trim() });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
}

export async function deleteGuest(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    throw new Error("Missing guest id");
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("guests").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
}

export async function deleteParty(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    throw new Error("Missing party id");
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("parties").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
}

export async function logout() {
  await destroyAdminSession();
  redirect("/admin/login");
}
