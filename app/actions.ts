"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function findRsvp(formData: FormData) {
  const token = formData.get("token");
  const trimmed = typeof token === "string" ? token.trim() : "";

  if (!trimmed) {
    redirect("/?error=1");
  }

  const supabase = createSupabaseServerClient();
  const { data: guest } = await supabase
    .from("guests")
    .select("token")
    .ilike("token", trimmed)
    .maybeSingle();

  if (!guest) {
    redirect("/?error=1");
  }

  redirect(`/rsvp/${guest.token}`);
}
