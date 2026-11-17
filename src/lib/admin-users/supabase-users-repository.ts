import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { mapProfileToAdminUser } from "./mapper";
import type { AdminUser, UsersRepository } from "./types";

export class SupabaseUsersRepository implements UsersRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async listUsers(): Promise<AdminUser[]> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("id, name, email, role, image, status, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      // Do not surface database details to the admin page.
      throw new Error("Users could not be loaded");
    }

    return (data ?? []).map((row) => mapProfileToAdminUser(row));
  }
}
