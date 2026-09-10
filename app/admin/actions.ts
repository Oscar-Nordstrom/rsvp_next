"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { destroyAdminSession, isAdmin } from "@/lib/admin/auth";

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

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("guests")
    .insert({ name: name.trim() });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
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
