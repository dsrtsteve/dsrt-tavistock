"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { getAdmin } from "@/lib/auth";
import { supabaseConfig } from "@/lib/supabase/config";
import type { AppRole } from "@/lib/admin-users/types";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ROLES: readonly AppRole[] = ["admin", "staff", "user"];
const STATUSES = ["active", "inactive", "pending"] as const;

function adminAuthClient() {
  const config = supabaseConfig();
  const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!config || !secret) return null;
  return createClient(config.url, secret, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
}

export async function updateUserProfile(form: FormData): Promise<{ error?: string; success?: string }> {
  const admin = await getAdmin();
  if (!admin || admin.role !== "admin") return { error: "You do not have permission to manage users." };

  const id = String(form.get("id") ?? "");
  const name = String(form.get("name") ?? "").trim();
  const role = String(form.get("role") ?? "");
  const status = String(form.get("status") ?? "");
  if (!UUID.test(id)) return { error: "That user could not be found." };
  if (name.length > 100) return { error: "Name must be 100 characters or fewer." };
  if (!ROLES.includes(role as AppRole) || !STATUSES.includes(status as (typeof STATUSES)[number])) {
    return { error: "Choose a valid role and account status." };
  }
  if (id === admin.user.id && role !== "admin") {
    return { error: "You cannot remove your own administrator access." };
  }

  const { data: target, error: targetError } = await admin.supabase
    .from("profiles").select("id, role, status").eq("id", id).maybeSingle();
  if (targetError || !target) return { error: "That user could not be found." };

  if (target.role === "admin" && (role !== "admin" || status !== "active")) {
    const { count, error } = await admin.supabase
      .from("profiles").select("id", { count: "exact", head: true }).eq("role", "admin").eq("status", "active");
    if (error || (count ?? 0) <= 1) return { error: "The last administrator cannot be demoted." };
  }

  const { error } = await admin.supabase.from("profiles").update({
    name: name || null,
    role: role as AppRole,
    status: status as (typeof STATUSES)[number],
  }).eq("id", id);
  if (error) return { error: "User changes could not be saved. Please try again." };

  revalidatePath("/admin/users");
  return { success: "User details updated." };
}

export async function deleteUserAccount(id: string): Promise<{ error?: string; success?: string }> {
  const admin = await getAdmin();
  if (!admin || admin.role !== "admin") return { error: "You do not have permission to delete users." };
  if (!UUID.test(id)) return { error: "That user could not be found." };
  if (id === admin.user.id) return { error: "You cannot delete your own administrator account." };

  const { data: target, error: targetError } = await admin.supabase
    .from("profiles").select("id, role, status, email").eq("id", id).maybeSingle();
  if (targetError || !target) return { error: "That user could not be found." };

  if (target.role === "admin") {
    const { count, error } = await admin.supabase
      .from("profiles").select("id", { count: "exact", head: true }).eq("role", "admin");
    if (error || (count ?? 0) <= 1) return { error: "The last administrator cannot be deleted." };
  }

  const authAdmin = adminAuthClient();
  if (!authAdmin) {
    return { error: "Account deletion is not configured. Add SUPABASE_SECRET_KEY to the server environment, then try again." };
  }

  const { error } = await authAdmin.auth.admin.deleteUser(id);
  if (error) return { error: "The account could not be deleted. Check whether the user owns any Supabase Storage files, then try again." };

  revalidatePath("/admin/users");
  return { success: "User account permanently deleted." };
}
