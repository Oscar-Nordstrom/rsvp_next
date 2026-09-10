"use server";

import { redirect } from "next/navigation";
import { createAdminSession, verifyAdminPassword } from "@/lib/admin/auth";

export async function login(formData: FormData) {
  const password = formData.get("password");

  if (typeof password !== "string" || !verifyAdminPassword(password)) {
    redirect("/admin/login?error=1");
  }

  await createAdminSession();
  redirect("/admin");
}
