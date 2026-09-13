"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { destroyAdminSession, isAdmin } from "@/lib/admin/auth";
import { generateGuestToken } from "@/lib/guests/token";
import { parseCountInput, MAX_PARTY_SIZE } from "@/lib/guests/party";

async function requireAdmin() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }
}

export async function addGuest(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name");
  if (typeof name !== "string" || !name.trim()) {
    throw new Error("Name is required");
  }

  const partySize = parseCountInput(formData.get("partySize"), {
    min: 1,
    max: MAX_PARTY_SIZE,
  });

  const supabase = createSupabaseServerClient();

  // Token collisions are exceedingly unlikely at 32^5 combinations for a
  // guest list this size, but retry a few times rather than fail outright.
  for (let attempt = 0; attempt < 5; attempt++) {
    const { error } = await supabase.from("guests").insert({
      name: name.trim(),
      token: generateGuestToken(),
      party_size: partySize,
    });

    if (!error) {
      revalidatePath("/admin");
      return;
    }

    if (error.code !== "23505") {
      throw new Error(error.message);
    }
  }

  throw new Error("Could not generate a unique invite code, please try again");
}

export async function updateGuest(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  const name = formData.get("name");
  if (typeof id !== "string" || !id) {
    throw new Error("Missing guest id");
  }
  if (typeof name !== "string" || !name.trim()) {
    throw new Error("Name is required");
  }

  const partySize = parseCountInput(formData.get("partySize"), {
    min: 1,
    max: MAX_PARTY_SIZE,
  });

  const supabase = createSupabaseServerClient();

  // If the admin lowers the party size below what the guest already
  // answered, bring their answer down to match so the row stays consistent.
  const { data: current } = await supabase
    .from("guests")
    .select("attending_count")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("guests")
    .update({
      name: name.trim(),
      party_size: partySize,
      attending_count: Math.min(current?.attending_count ?? 0, partySize),
    })
    .eq("id", id);

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

export async function logout() {
  await destroyAdminSession();
  redirect("/admin/login");
}
