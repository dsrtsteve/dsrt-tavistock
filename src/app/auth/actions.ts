"use server";

import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";

export type PasswordState = { error?: string };

export async function setInitialPassword(
  _state: PasswordState,
  form: FormData,
): Promise<PasswordState> {
  const password = String(form.get("password") ?? "");
  const confirmation = String(form.get("confirmation") ?? "");

  if (password.length < 12 || password.length > 1000)
    return { error: "Use a password with at least 12 characters." };
  if (password !== confirmation)
    return { error: "The passwords do not match." };

  const admin = await getAdmin();
  if (!admin)
    return {
      error: "This invitation is no longer active. Ask your administrator to resend it.",
    };

  const { error } = await admin.supabase.auth.updateUser({ password });
  if (error)
    return {
      error: "The password could not be saved. Please try again or request a new invite.",
    };

  redirect("/admin");
}
