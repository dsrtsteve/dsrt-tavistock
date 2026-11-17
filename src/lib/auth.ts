import "server-only";
import { redirect } from "next/navigation";
import { createServerSupabase } from "./supabase/server";
import { supabaseConfig } from "./supabase/config";

export async function getAdmin() {
  if (!supabaseConfig()) return null;
  const supabase = await createServerSupabase();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .maybeSingle();
  // The profiles role is the canonical authorisation source after the role migration.
  // Existing admin_users entries are backfilled to role='admin' by that migration.
  if (profileError || profile?.role !== "admin" || profile.status !== "active") return null;
  return { user, supabase, role: profile.role };
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
