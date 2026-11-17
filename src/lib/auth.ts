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
  const { data: admin, error: roleError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (roleError || !admin) return null;
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError || !profile) return null;
  return { user, supabase, role: profile.role };
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
